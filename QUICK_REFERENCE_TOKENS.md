# 🚀 Quick Reference: Sistema de Tokens

> Guía rápida para uso diario del nuevo sistema de autenticación

---

## 📦 Imports Necesarios

```typescript
// Para hacer requests autenticados (RECOMENDADO)
import { apiClient } from "@/lib/api/client";

// Para obtener headers manualmente
import { getAuthHeaders, getAuthToken } from "@/lib/utils/auth-helpers";

// Para operaciones avanzadas con tokens
import {
  accessToken,
  refreshToken,
  hasValidSession,
  getUserFromToken,
} from "@/lib/utils/token-utils";

// Para auth context
import { useAuth } from "@/hooks/useAuth";
```

---

## 🔥 Casos de Uso Comunes

### 1. Hacer un Request GET Autenticado

```typescript
// ✅ OPCIÓN 1 (MEJOR): Usar apiClient
import { apiClient } from "@/lib/api/client";

const fetchUsers = async () => {
  const response = await apiClient.get("/users");
  return response.data;
};

// ✅ OPCIÓN 2: Usar fetch
import { getAuthHeaders } from "@/lib/utils/auth-helpers";

const fetchUsers = async () => {
  const response = await fetch(`${API_URL}/users`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};
```

### 2. Hacer un Request POST Autenticado

```typescript
// ✅ Con apiClient (auto-serializa JSON)
import { apiClient } from "@/lib/api/client";

const createBooking = async (data) => {
  const response = await apiClient.post("/bookings", data);
  return response.data;
};

// ✅ Con fetch
import { getAuthHeaders } from "@/lib/utils/auth-helpers";

const createBooking = async (data) => {
  const response = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};
```

### 3. Verificar si Usuario Está Logueado

```typescript
import { hasValidSession } from "@/lib/utils/token-utils";

// En un componente
if (!hasValidSession()) {
  router.push("/ingresar");
}

// En useEffect
useEffect(() => {
  if (!hasValidSession()) {
    router.push("/ingresar");
  }
}, []);
```

### 4. Obtener Información del Usuario del Token

```typescript
import { getUserFromToken } from "@/lib/utils/token-utils";

const userInfo = getUserFromToken();
console.log(userInfo?.email); // email del usuario
console.log(userInfo?.role); // "professional" | "customer" | "admin"
console.log(userInfo?.sub); // user ID
```

### 5. Login Programático

```typescript
import { useAuth } from '@/hooks/useAuth';

const LoginComponent = () => {
  const { login, isLoading, user } = useAuth();

  const handleLogin = async () => {
    try {
      await login({
        email: 'user@example.com',
        password: 'password123',
      });
      // Tokens se guardan automáticamente
      router.push('/panel');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return <button onClick={handleLogin}>Ingresar</button>;
};
```

### 6. Logout Programático

```typescript
import { useAuth } from '@/hooks/useAuth';

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Limpia tokens automáticamente
    router.push('/ingresar');
  };

  return <button onClick={handleLogout}>Salir</button>;
};
```

### 7. Proteger una Página

```typescript
// pages/admin/dashboard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hasValidSession } from '@/lib/utils/token-utils';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!hasValidSession()) {
      router.push('/ingresar');
    }
  }, [router]);

  return <div>Admin Dashboard</div>;
}
```

### 8. Usar React Query con Auth

```typescript
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

const useUserProfile = () => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const response = await apiClient.get("/users/me");
      return response.data;
    },
  });
};

// Uso
const { data: profile, isLoading } = useUserProfile();
```

### 9. Subir Archivo con Autenticación

```typescript
import { getAuthToken } from "@/lib/utils/auth-helpers";

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const token = getAuthToken();

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // NO agregar Content-Type, fetch lo hará automáticamente
    },
    body: formData,
  });

  return response.json();
};
```

### 10. Verificar Expiración del Token

```typescript
import { accessToken } from "@/lib/utils/token-utils";

// Verificar si está por expirar
const timeToExpiry = accessToken.getTimeToExpiry();
console.log(`Token expira en ${timeToExpiry / 1000 / 60} minutos`);

// Verificar si es válido
if (accessToken.isValid()) {
  console.log("Token válido");
} else {
  console.log("Token expirado o no existe");
}
```

---

## ❌ Qué NO Hacer

```typescript
// ❌ NUNCA acceder a localStorage directamente
const token = localStorage.getItem("token");
const token = localStorage.getItem("auth-storage");

// ❌ NUNCA guardar tokens manualmente
localStorage.setItem("token", myToken);
sessionStorage.setItem("token", myToken);

// ❌ NUNCA mezclar ambos sistemas
const token = localStorage.getItem("token") || getAuthToken();

// ❌ NUNCA exponer tokens en URL
window.location.href = `/page?token=${token}`;

// ❌ NUNCA confiar solo en frontend
// Siempre validar en backend también
```

---

## 🎨 Patterns Recomendados

### Pattern 1: Hook Personalizado para Data Fetching

```typescript
// hooks/useAdminStats.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/stats");
      return response.data;
    },
    // Refetch automático
    refetchInterval: 60000, // cada 1 min
  });
};

// Uso en componente
const { data, isLoading, error } = useAdminStats();
```

### Pattern 2: API Service Layer

```typescript
// services/bookings.ts
import { apiClient } from "@/lib/api/client";

export const bookingsService = {
  getAll: async () => {
    const response = await apiClient.get("/bookings");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },

  create: async (data: CreateBookingDTO) => {
    const response = await apiClient.post("/bookings", data);
    return response.data;
  },

  update: async (id: string, data: UpdateBookingDTO) => {
    const response = await apiClient.patch(`/bookings/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/bookings/${id}`);
  },
};
```

### Pattern 3: Protected Route Component

```typescript
// components/ProtectedRoute.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hasValidSession } from '@/lib/utils/token-utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback
}) => {
  const router = useRouter();
  const isValid = hasValidSession();

  useEffect(() => {
    if (!isValid) {
      router.push('/ingresar');
    }
  }, [isValid, router]);

  if (!isValid) {
    return fallback || <div>Cargando...</div>;
  }

  return <>{children}</>;
};

// Uso
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

---

## 🐛 Debugging

### Ver Tokens en DevTools

```javascript
// En la consola del navegador:

// Ver access token
sessionStorage.getItem("access_token");

// Ver refresh token
localStorage.getItem("refresh_token");

// Ver datos de usuario
JSON.parse(localStorage.getItem("auth-storage"));

// Ver info del access token decodificado
const token = sessionStorage.getItem("access_token");
const parts = token.split(".");
const payload = JSON.parse(atob(parts[1]));
console.log(payload);
```

### Forzar Renovación de Token

```typescript
import { refreshToken as refreshTokenUtil } from "@/lib/utils/token-utils";
import { authAPI } from "@/lib/auth/auth-api";

// Forzar refresh manual
const forceRefresh = async () => {
  const currentRefreshToken = refreshTokenUtil.get();
  if (currentRefreshToken) {
    const newTokens = await authAPI.refreshToken({
      refreshToken: currentRefreshToken,
    });
    console.log("Tokens renovados:", newTokens);
  }
};
```

---

## 📋 Checklist de Troubleshooting

Cuando algo no funciona:

1. **¿Estás logueado?**
   - [ ] Verificar `hasValidSession()` retorna `true`
   - [ ] Verificar que hay tokens en DevTools > Storage

2. **¿Se envía el token?**
   - [ ] Abrir DevTools > Network
   - [ ] Verificar que header `Authorization: Bearer ...` está presente

3. **¿El token es válido?**
   - [ ] Verificar `accessToken.isValid()` retorna `true`
   - [ ] Verificar que no expiró hace mucho tiempo

4. **¿El interceptor funciona?**
   - [ ] Verificar que en Network no hay muchos requests a `/auth/refresh`
   - [ ] Verificar que requests 401 se reintentan automáticamente

5. **¿El backend responde?**
   - [ ] Verificar que backend está corriendo
   - [ ] Verificar que endpoint `/auth/refresh` funciona
   - [ ] Verificar logs del backend

---

## 🔗 Referencias Rápidas

- **Guía Migración**: `TOKEN_MIGRATION_GUIDE.md`
- **Informe Seguridad**: `SECURITY_AUDIT_TOKENS.md`
- **Resumen**: `RESUMEN_REVISION_TOKENS.md`
- **Plan Acción**: `PLAN_DE_ACCION.md`

---

## 💡 Tips Pro

1. **Siempre usar `apiClient`** cuando sea posible
2. **Crear hooks personalizados** para data fetching
3. **Centralizar servicios API** en archivos dedicados
4. **Proteger rutas** en nivel de componente y middleware
5. **No reinventar la rueda**: usa los helpers existentes

---

**Última actualización**: Octubre 2025
