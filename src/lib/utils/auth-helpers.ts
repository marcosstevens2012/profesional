/**
 * 🔧 Helper para obtener el token de autorización
 *
 * Este helper centraliza la obtención del token para requests.
 * Usa el nuevo sistema de token-utils.
 *
 * Reemplaza el código legacy: localStorage.getItem("token")
 */

import { accessToken } from "./token-utils";

/**
 * Obtiene el token de acceso actual
 * @returns El access token o null si no existe
 */
export function getAuthToken(): string | null {
  return accessToken.get();
}

/**
 * Crea headers de autorización para fetch requests
 * @returns Headers con Authorization si hay token disponible
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * Verifica si hay un token válido disponible
 */
export function hasAuthToken(): boolean {
  return accessToken.isValid();
}
