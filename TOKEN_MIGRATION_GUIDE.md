# 🔄 Guía de Migración: Sistema de Gestión de Tokens Mejorado

## 📋 Resumen de Cambios

Se ha implementado un sistema de gestión de tokens **más seguro y consistente** que corrige varios problemas críticos de seguridad identificados en el código.

---

## ✅ Mejoras Implementadas

### 1. **Separación de Almacenamiento de Tokens**

**Antes:**

- Todo en `localStorage` (inseguro)
- Tokens mezclados con datos de usuario

**Ahora:**

- ✅ **Access Token**: `sessionStorage` (más seguro, se pierde al cerrar tab)
- ✅ **Refresh Token**: `localStorage` (persistencia necesaria)
- ✅ **Usuario**: `localStorage` (solo info básica, no sensible)

### 2. **Renovación Automática de Tokens**

**Antes:**

- ❌ No existía renovación automática
- ❌ Al expirar token, se redirigía a login inmediatamente

**Ahora:**

- ✅ Interceptor inteligente que detecta 401
- ✅ Renueva automáticamente con refresh token
- ✅ Reintenta el request original
- ✅ Cola de requests durante renovación (evita múltiples refresh)

### 3. **API Centralizada y Consistente**

**Antes:**

- ❌ ~19 archivos usando `localStorage.getItem("token")` directamente
- ❌ Inconsistencias entre archivos

**Ahora:**

- ✅ Helper centralizado: `getAuthHeaders()`
- ✅ Token utils reutilizables
- ✅ Un solo punto de verdad

---

## 🗂️ Archivos Nuevos

```
src/lib/utils/
├── token-utils.ts       # Gestión segura de tokens
└── auth-helpers.ts      # Helpers para obtener headers/token
```

### `token-utils.ts`

Funciones disponibles:

```typescript
import {
  accessToken,
  refreshToken,
  setTokens,
  clearAllTokens,
} from "@/lib/utils/token-utils";

// Access Token
accessToken.get(); // Obtener access token
accessToken.set(token); // Guardar access token
accessToken.remove(); // Eliminar access token
accessToken.isValid(); // Verificar si es válido
accessToken.getTimeToExpiry(); // Tiempo hasta expiración (ms)

// Refresh Token
refreshToken.get();
refreshToken.set(token);
refreshToken.remove();
refreshToken.isValid();

// Utilidades generales
setTokens({ accessToken, refreshToken }); // Guardar ambos
clearAllTokens(); // Limpiar todo
hasValidSession(); // ¿Hay sesión válida?
getUserFromToken(); // Info del usuario desde JWT
shouldRefreshToken(); // ¿Debe renovarse?
```

### `auth-helpers.ts`

Helpers para requests:

```typescript
import { getAuthHeaders, getAuthToken } from "@/lib/utils/auth-helpers";

// Para fetch
fetch("/api/endpoint", {
  headers: getAuthHeaders(),
});

// Para obtener solo el token
const token = getAuthToken();
```

---

## 🔧 Archivos Modificados

### 1. `src/lib/auth/auth-store.ts`

**Cambios:**

- ✅ Eliminada sincronización con cookies (insegura desde cliente)
- ✅ Solo persiste usuario, no tokens
- ✅ Tokens se manejan con `token-utils`
- ✅ Hidratación desde `sessionStorage`/`localStorage`

### 2. `src/lib/api/client.ts`

**Cambios:**

- ✅ Request interceptor usa `accessToken.get()`
- ✅ Response interceptor con renovación automática
- ✅ Cola de requests durante renovación
- ✅ Manejo inteligente de errores 401

### 3. Hooks actualizados

Los siguientes hooks ahora usan `getAuthHeaders()`:

- ✅ `src/hooks/useNotifications.ts`
- ✅ `src/hooks/useCreateBookingPayment.ts`

---

## 📝 Cómo Migrar Código Legacy

### ❌ Código Antiguo (NO USAR)

```typescript
// ❌ INCORRECTO
const token = localStorage.getItem("token");

fetch("/api/endpoint", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
```

### ✅ Código Nuevo (USAR)

```typescript
// ✅ CORRECTO - Opción 1: usar helper
import { getAuthHeaders } from "@/lib/utils/auth-helpers";

fetch("/api/endpoint", {
  headers: getAuthHeaders(),
});

// ✅ CORRECTO - Opción 2: usar apiClient (recomendado)
import { apiClient } from "@/lib/api/client";

const response = await apiClient.get("/endpoint");
```

---

## 🚀 Archivos Pendientes de Migración

Los siguientes archivos **aún usan `localStorage.getItem("token")`** y deben migrarse:

### Admin Pages

- `src/app/admin/page.tsx`
- `src/app/admin/pagos/page.tsx`
- `src/app/admin/profesionales/page.tsx`
- `src/app/admin/usuarios/page.tsx`
- `src/app/admin/bookings/page.tsx`

### Otros

- `src/app/bookings/[id]/meeting/page.tsx`
- `src/components/WaitingRoom.tsx`

### Migración en masa

Para estos archivos, reemplazar:

```typescript
// Buscar:
localStorage.getItem("token");

// Reemplazar con:
import { getAuthToken } from "@/lib/utils/auth-helpers";
// ...
const token = getAuthToken();
```

O mejor aún, usar `getAuthHeaders()`:

```typescript
import { getAuthHeaders } from "@/lib/utils/auth-helpers";

// Antes:
headers: {
  Authorization: `Bearer ${localStorage.getItem("token")}`;
}

// Después:
headers: getAuthHeaders();
```

---

## 🔐 Mejores Prácticas

### 1. **Usar apiClient para requests autenticados**

```typescript
// ✅ RECOMENDADO
import { apiClient } from "@/lib/api/client";

// El token se agrega automáticamente
const response = await apiClient.get("/users/me");
const data = await apiClient.post("/bookings", bookingData);
```

### 2. **Para fetch directo, usar getAuthHeaders()**

```typescript
// ✅ OK (cuando no puedas usar apiClient)
import { getAuthHeaders } from "@/lib/utils/auth-helpers";

const response = await fetch("/api/endpoint", {
  method: "POST",
  headers: getAuthHeaders(),
  body: JSON.stringify(data),
});
```

### 3. **NO acceder a localStorage directamente**

```typescript
// ❌ NUNCA HACER ESTO
const token = localStorage.getItem("token");
const token = localStorage.getItem("auth-storage");

// ✅ USAR ESTO
import { getAuthToken } from "@/lib/utils/auth-helpers";
const token = getAuthToken();
```

### 4. **Verificar sesión válida**

```typescript
import { hasValidSession } from "@/lib/utils/token-utils";

if (!hasValidSession()) {
  router.push("/ingresar");
}
```

---

## 🧪 Cómo Probar

### Test 1: Renovación automática

1. Iniciar sesión
2. Esperar ~15 minutos (o modificar expiración en backend)
3. Hacer un request (debería renovarse automáticamente)
4. Verificar en DevTools > Application > Storage:
   - `sessionStorage`: nuevo access token
   - `localStorage`: nuevo refresh token

### Test 2: Token expirado completamente

1. Iniciar sesión
2. Borrar el refresh token: `localStorage.removeItem("refresh_token")`
3. Hacer un request
4. Debería redirigir a `/ingresar`

### Test 3: Múltiples requests simultáneos

1. Hacer que el token expire
2. Disparar 3-4 requests simultáneos
3. Solo debe haber **1 llamada** a `/auth/refresh`
4. Todos los requests deberían completarse exitosamente

---

## 🐛 Troubleshooting

### Problema: "Token inválido" al recargar página

**Causa**: sessionStorage se limpia al cerrar tab.

**Solución**: Esto es normal y deseado. El refresh token en localStorage permite login automático.

### Problema: Logout no redirige

**Verificar**:

```typescript
// En auth-store.ts
logout: () => {
  clearAllTokens(); // ✅ Debe estar
  // ...
};
```

### Problema: Admin pages dan 401

**Causa**: Aún usan `localStorage.getItem("token")` antiguo.

**Solución**: Migrar usando la guía de arriba.

---

## 📊 Comparación Antes/Después

| Aspecto                   | Antes                           | Ahora                        |
| ------------------------- | ------------------------------- | ---------------------------- |
| **Access Token**          | localStorage                    | sessionStorage ✅            |
| **Renovación automática** | ❌ No                           | ✅ Sí                        |
| **Consistencia**          | ~19 implementaciones diferentes | 1 centralizada ✅            |
| **Seguridad**             | Baja (tokens en localStorage)   | Alta ✅                      |
| **Manejo de errores**     | Redirect inmediato              | Retry con refresh ✅         |
| **DX (Dev Experience)**   | Repetitivo                      | `getAuthHeaders()` simple ✅ |

---

## ⚠️ Breaking Changes

### Para desarrolladores

1. **Ya NO usar** `localStorage.getItem("token")`
2. **Importar** helpers de `@/lib/utils/auth-helpers`
3. **Preferir** `apiClient` sobre `fetch` directo

### Para usuarios finales

- ✅ **Mejora**: Sesiones más seguras
- ✅ **Mejora**: Menos logouts inesperados (auto-refresh)
- ⚠️ **Cambio**: Al cerrar tab, se pierde access token (debe renovarse con refresh token)

---

## 🎯 Próximos Pasos Recomendados

1. ✅ Migrar todos los archivos admin que usan `localStorage.getItem("token")`
2. ✅ Migrar `WaitingRoom.tsx`
3. ✅ Migrar `meeting/page.tsx`
4. 🔄 Implementar refresh token rotation (backend)
5. 🔄 Considerar httpOnly cookies para refresh token (requiere cambio en backend)
6. 🔄 Agregar telemetría de fallos de refresh

---

## 📚 Referencias

- [Documentación de Autenticación](./AUTHENTICATION.md)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Token Storage](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-storage-on-client-side)

---

**Última actualización**: Octubre 2025  
**Autor**: Sistema de revisión de seguridad
