/**
 * 🔐 Token Management Utilities
 *
 * Gestión centralizada y segura de tokens de autenticación.
 * Implementa las mejores prácticas descritas en la documentación.
 *
 * Estrategia de almacenamiento:
 * - Access Token: sessionStorage (15 min de vida)
 * - Refresh Token: localStorage (7 días de vida)
 * - Usuario: localStorage (para persistencia entre sesiones)
 */

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const TOKEN_EXPIRY_KEY = "token_expiry";

/**
 * Decodifica un JWT sin verificar la firma
 * Solo para leer el payload en el cliente
 */
export function decodeJWT(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

/**
 * Verifica si un token está expirado
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  // Agregar un buffer de 30 segundos para evitar edge cases
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now + 30;
}

/**
 * Obtiene el tiempo restante hasta que expire el token (en ms)
 */
export function getTokenTimeToExpiry(token: string): number {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return 0;

  const now = Math.floor(Date.now() / 1000);
  const timeToExpiry = (decoded.exp - now) * 1000;
  return Math.max(0, timeToExpiry);
}

/**
 * Gestión del Access Token (sessionStorage para seguridad)
 */
export const accessToken = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  },

  set(token: string): void {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);

    // Guardar timestamp de expiración para referencia rápida
    const decoded = decodeJWT(token);
    if (decoded?.exp) {
      sessionStorage.setItem(TOKEN_EXPIRY_KEY, decoded.exp.toString());
    }
  },

  remove(): void {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
  },

  isValid(): boolean {
    const token = this.get();
    if (!token) return false;
    return !isTokenExpired(token);
  },

  getTimeToExpiry(): number {
    const token = this.get();
    if (!token) return 0;
    return getTokenTimeToExpiry(token);
  },
};

/**
 * Gestión del Refresh Token (localStorage para persistencia)
 */
export const refreshToken = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  set(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  remove(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  isValid(): boolean {
    const token = this.get();
    if (!token) return false;
    return !isTokenExpired(token);
  },
};

/**
 * Limpia todos los tokens
 */
export function clearAllTokens(): void {
  accessToken.remove();
  refreshToken.remove();
}

/**
 * Guarda ambos tokens de una vez
 */
export function setTokens(tokens: {
  accessToken: string;
  refreshToken: string;
}): void {
  accessToken.set(tokens.accessToken);
  refreshToken.set(tokens.refreshToken);
}

/**
 * Verifica si el usuario tiene una sesión válida
 */
export function hasValidSession(): boolean {
  return accessToken.isValid() || refreshToken.isValid();
}

/**
 * Obtiene información del usuario desde el access token
 */
export function getUserFromToken(): {
  sub: string;
  email: string;
  role: string;
} | null {
  const token = accessToken.get();
  if (!token) return null;

  const decoded = decodeJWT(token);
  if (!decoded) return null;

  return {
    sub: decoded.sub,
    email: decoded.email,
    role: decoded.role,
  };
}

/**
 * Determina si se debe renovar el token
 * Se renueva si expira en menos de 5 minutos
 */
export function shouldRefreshToken(): boolean {
  const timeToExpiry = accessToken.getTimeToExpiry();
  const FIVE_MINUTES = 5 * 60 * 1000;

  return timeToExpiry > 0 && timeToExpiry < FIVE_MINUTES;
}
