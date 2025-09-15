import axios from "axios";

// Base URL de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

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
    // Obtener token del localStorage si existe
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("auth-token") ||
        document.cookie
          .split("; ")
          .find(row => row.startsWith("auth-token="))
          ?.split("=")[1];

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
      // Token expirado o no válido, limpiar almacenamiento
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-token");
        document.cookie =
          "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // Redirigir a login si no estamos ya en la página de login
        if (window.location.pathname !== "/ingresar") {
          window.location.href = "/ingresar";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
