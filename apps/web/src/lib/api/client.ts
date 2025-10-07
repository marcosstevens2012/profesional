import axios from "axios";

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

// Interceptor para agregar token de autorización si existe
apiClient.interceptors.request.use(
  config => {
    // Obtener token del store de Zustand
    if (typeof window !== "undefined") {
      try {
        // Obtener el estado del store de Zustand
        const authStorage = localStorage.getItem("auth-storage");
        if (authStorage) {
          const authData = JSON.parse(authStorage);
          const token = authData?.state?.tokens?.accessToken;

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (error) {
        console.error("Error getting auth token:", error);
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para manejo de respuestas y errores
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Lista de endpoints que pueden fallar con 401 sin necesidad de redirigir
      const allowedFailureEndpoints = [
        "/config/consultation_price",
        "/config/",
      ];

      const requestUrl = error.config?.url || "";
      const shouldAllowFailure = allowedFailureEndpoints.some(endpoint =>
        requestUrl.includes(endpoint)
      );

      if (!shouldAllowFailure) {
        // Token expirado o no válido, limpiar almacenamiento
        if (typeof window !== "undefined") {
          // Limpiar el store de Zustand
          localStorage.removeItem("auth-storage");
          // Redirigir a login si no estamos ya en la página de login
          if (window.location.pathname !== "/ingresar") {
            window.location.href = "/ingresar";
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
