# 🚀 Guía de Deployment - Profesional Frontend

## 📋 Resumen

Este monorepo contiene **SOLO el frontend** de la plataforma Profesional. La API está en un repositorio/servidor separado.

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────┐
│   Frontend (Este Repo)                  │
│   - Next.js 14                          │
│   - Deployment: Vercel                  │
│   - URL: tu-dominio.vercel.app          │
└──────────────┬──────────────────────────┘
               │ HTTP/REST
               ▼
┌─────────────────────────────────────────┐
│   API Backend (Repo Separado)          │
│   - Node.js/Express                     │
│   - Deployment: Railway/Otro            │
│   - URL: tu-api.railway.app             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Database                              │
│   - Supabase PostgreSQL                 │
└─────────────────────────────────────────┘
```

## 🌐 Deployment en Vercel

### Paso 1: Preparación

1. **Asegúrate que el build funciona localmente:**

   ```bash
   pnpm build
   ```

2. **Verifica que todas las variables de entorno estén en `.env.local`**

### Paso 2: Conectar a Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en "Add New Project"
3. Importa el repositorio `marcosstevens2012/profesional`

### Paso 3: Configuración del Proyecto

**Framework Settings:**

- Framework Preset: `Next.js`
- Root Directory: `apps/web`
- Build Command: `cd ../.. && pnpm build --filter=@profesional/web`
- Output Directory: `.next`
- Install Command: `cd ../.. && pnpm install --frozen-lockfile`

**Node.js Version:**

- Node.js: `20.x`

### Paso 4: Variables de Entorno

Agrega estas variables en Vercel Dashboard → Settings → Environment Variables:

#### 🔴 Variables REQUERIDAS:

```bash
# API Backend (CRÍTICO - debe apuntar a tu API en producción)
NEXT_PUBLIC_API_URL=https://tu-api-backend-production.railway.app

# App URL
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://anqdbinmztorvdsausrn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui

# Mercado Pago (usar keys de PRODUCCIÓN)
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP-tu-public-key-de-produccion

# Node Environment
NODE_ENV=production
```

#### 🟡 Variables OPCIONALES:

```bash
# Jitsi (opcional - usa default si no se especifica)
NEXT_PUBLIC_JITSI_DOMAIN=meet.jit.si

# Sentry (opcional - para error tracking)
NEXT_PUBLIC_SENTRY_DSN=tu_sentry_dsn
SENTRY_DSN=tu_sentry_dsn

# PostHog (opcional - para analytics)
NEXT_PUBLIC_POSTHOG_KEY=tu_posthog_key
POSTHOG_KEY=tu_posthog_key

# Debug (opcional)
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEBUG=false
```

### Paso 5: Deploy

1. Click en **"Deploy"**
2. Espera a que termine el build (~2-3 minutos)
3. ¡Listo! 🎉

### Paso 6: Post-Deploy Checklist

- [ ] Verifica que la app carga correctamente
- [ ] Prueba login/registro
- [ ] Verifica que las llamadas a la API funcionan
- [ ] Prueba pagos en modo test
- [ ] Verifica video llamadas con Jitsi
- [ ] Revisa los logs en Vercel Dashboard

## 🔧 Configuración de CORS en el Backend

**IMPORTANTE:** Tu API backend debe permitir requests desde tu dominio de Vercel.

En tu API, agrega:

```javascript
// Ejemplo para Express
app.use(
  cors({
    origin: [
      "https://tu-dominio.vercel.app",
      "http://localhost:3000", // para desarrollo
    ],
    credentials: true,
  })
);
```

## 🔄 Continuous Deployment

Vercel automáticamente:

- ✅ Deploy en cada push a `main` (producción)
- ✅ Preview deploys para PRs
- ✅ Rollback automático si falla el build

## 📊 Monitoreo

### Logs

- Vercel Dashboard → Deployments → Logs
- Runtime Logs para errores en producción

### Analytics (Opcional)

Si configuraste Sentry/PostHog:

- Sentry: errores y crashes
- PostHog: analytics de usuarios

## 🐛 Troubleshooting

### Error: "NEXT_PUBLIC_API_URL is undefined"

- ✅ Verifica que la variable esté en Vercel
- ✅ Variables deben tener prefijo `NEXT_PUBLIC_` para el cliente
- ✅ Re-deploy después de agregar variables

### Error: CORS

- ✅ Verifica configuración de CORS en tu API
- ✅ Asegúrate que tu dominio de Vercel esté permitido

### Build Timeout

- ✅ Tu build toma ~1-20s, está perfecto
- ✅ Vercel Free tier: 45 min timeout

### Error: "Cannot find module '@marcosstevens2012/contracts'"

- ✅ Verifica que `transpilePackages` incluya todos los workspaces
- ✅ Ya está configurado en `next.config.mjs` ✅

## 🔐 Seguridad

### Checklist de Seguridad:

- [ ] Variables secretas solo en Vercel (no en código)
- [ ] `.env.local` en `.gitignore` ✅
- [ ] HTTPS habilitado (Vercel lo hace por default) ✅
- [ ] CORS configurado correctamente en API
- [ ] API keys de producción (no test) en producción
- [ ] Headers de seguridad configurados en `vercel.json` ✅

## 📱 Dominios Personalizados

Para usar tu propio dominio:

1. Vercel Dashboard → Settings → Domains
2. Agrega tu dominio
3. Configura DNS records según instrucciones
4. Actualiza `NEXT_PUBLIC_APP_URL` con tu dominio

## 🎯 Performance Tips

- ✅ Turbo caché habilitado
- ✅ Images optimizadas con Next.js Image
- ✅ Code splitting automático
- ✅ Edge runtime para middleware
- ✅ Static generation donde sea posible

## 📞 Soporte

Para issues de deployment:

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- GitHub Issues: https://github.com/marcosstevens2012/profesional/issues

---

**Última actualización:** 8 de Octubre, 2025
**Versión:** 0.1.0
