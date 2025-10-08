# Configuración CORS para API Separada

## Variables de Entorno Requeridas

Agrega estas variables a tu archivo `.env`:

```bash
# CORS Origins (separados por coma)
CORS_ORIGINS=http://localhost:3000,https://tu-frontend.vercel.app,https://tu-frontend-preview.vercel.app

# Frontend URL (para callbacks, redirects, etc.)
FRONTEND_URL=http://localhost:3000

# Database (Supabase)
DATABASE_URL=postgresql://usuario:password@host:5432/database

# JWT Secrets
JWT_SECRET=tu-jwt-secret-muy-seguro
JWT_REFRESH_SECRET=tu-jwt-refresh-secret-muy-seguro

# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-supabase-anon-key

# Node Environment
NODE_ENV=development
PORT=3001

# Request ID Header (opcional)
REQUEST_ID_HEADER=x-request-id
```

## Configuración de CORS

El archivo `src/main.ts` ya está configurado para aceptar CORS desde los orígenes especificados en `CORS_ORIGINS`.

### Desarrollo Local

Para desarrollo local con frontend y backend en puertos diferentes:

```bash
# En .env de la API
CORS_ORIGINS=http://localhost:3000
FRONTEND_URL=http://localhost:3000
PORT=3001
```

```bash
# En .env del frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Producción

```bash
# En Railway (API)
CORS_ORIGINS=https://profesional.vercel.app,https://profesional-*.vercel.app
FRONTEND_URL=https://profesional.vercel.app
PORT=3001  # Railway lo sobrescribirá automáticamente
```

```bash
# En Vercel (Frontend)
NEXT_PUBLIC_API_URL=https://profesional-api.up.railway.app
```

## Testing CORS

Para probar que CORS está funcionando correctamente:

```bash
# Desde el terminal
curl -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  http://localhost:3001/api/auth/login \
  -v
```

Deberías ver en la respuesta:

```
< access-control-allow-origin: http://localhost:3000
< access-control-allow-credentials: true
```

## Troubleshooting

### Error: "CORS policy blocked"

1. Verifica que `CORS_ORIGINS` incluye la URL exacta del frontend (con http/https)
2. Asegúrate de que `credentials: true` está en ambos lados (API y cliente)
3. Revisa que el frontend envía las credenciales:

```typescript
// En el cliente
fetch("http://localhost:3001/api/endpoint", {
  credentials: "include", // ✅ Importante
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Error: "Preflight request failed"

Verifica que el método HTTP está en la lista de `methods` permitidos en `src/main.ts`.

## Seguridad en Producción

⚠️ **IMPORTANTE**: En producción, NUNCA uses wildcards (`*`) en CORS_ORIGINS.

✅ **Correcto**:

```bash
CORS_ORIGINS=https://profesional.vercel.app,https://www.profesional.com
```

❌ **Incorrecto**:

```bash
CORS_ORIGINS=*  # ¡Inseguro!
```

Para manejar múltiples dominios de preview de Vercel, usa un patrón específico en el código si es necesario.
