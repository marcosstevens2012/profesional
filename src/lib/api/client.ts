import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { accessToken, refreshToken } from "../utils/token-utils";

// Base URL de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003";

// Cliente axios configurado
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== REQUEST INTERCEPTOR =====
// Agrega el access token a cada request
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = accessToken.get();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===== RESPONSE INTERCEPTOR =====
// Maneja errores 401 y renueva tokens automáticamente
let isRefreshing = false;
let refreshSubscribers: Array<(_token: string) => void> = [];

// Función para suscribirse a la renovación del token
const subscribeTokenRefresh = (cb: (_token: string) => void) => {
  refreshSubscribers.push(cb);
};

// Función para notificar a todos los suscriptores cuando el token se renueva
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Si es un error 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Lista de endpoints que pueden fallar con 401 sin necesidad de renovar token
      const allowedFailureEndpoints = [
        "/config/consultation_price",
        "/config/",
        "/auth/login",
        "/auth/register",
      ];

      const requestUrl = originalRequest.url || "";
      const shouldAllowFailure = allowedFailureEndpoints.some((endpoint) =>
        requestUrl.includes(endpoint)
      );

      if (shouldAllowFailure) {
        return Promise.reject(error);
      }

      // Si ya intentamos renovar el token, redirigir a login
      if (originalRequest._retry) {
        if (typeof window !== "undefined") {
          // Limpiar tokens y redirigir
          localStorage.removeItem("auth-storage");
          accessToken.remove();
          refreshToken.remove();

          if (window.location.pathname !== "/ingresar") {
            window.location.href = "/ingresar";
          }
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // Si ya se está renovando el token, esperar
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const currentRefreshToken = refreshToken.get();

        if (!currentRefreshToken) {
          throw new Error("No refresh token available");
        }

        // Renovar el token
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken: currentRefreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        // Guardar nuevos tokens
        accessToken.set(newAccessToken);
        refreshToken.set(newRefreshToken);

        // Actualizar el store de Zustand también
        if (typeof window !== "undefined") {
          try {
            const authStorage = localStorage.getItem("auth-storage");
            if (authStorage) {
              const authData = JSON.parse(authStorage);
              authData.state.tokens = {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                expiresIn: 900, // 15 minutos
              };
              localStorage.setItem("auth-storage", JSON.stringify(authData));
            }
          } catch (e) {
            console.error("Error updating auth storage:", e);
          }
        }

        isRefreshing = false;

        // Notificar a todos los requests en espera
        onTokenRefreshed(newAccessToken);

        // Reintentar el request original
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];

        // Si falló la renovación, limpiar todo y redirigir
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
          accessToken.remove();
          refreshToken.remove();

          if (window.location.pathname !== "/ingresar") {
            window.location.href = "/ingresar";
          }
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
