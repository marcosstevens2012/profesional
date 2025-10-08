# 🚀 Guía Completa: Separación de API y Frontend

## 📋 Resumen

Este documento describe el proceso completo para separar el monorepo en dos proyectos independientes:

- **Frontend**: Next.js (este repositorio)
- **API**: NestJS (nuevo repositorio)

## ✅ Estado Actual

- ✅ Código de API migrado a `/Users/marcosstevens/Desktop/CARPETAS/PROFESIONAL/profesional-api`
- ✅ Configuraciones actualizadas
- ✅ CORS configurado
- ✅ Scripts de automatización creados
- ⏳ Pendiente: Publicar `@profesional/contracts`
- ⏳ Pendiente: Limpiar monorepo actual
- ⏳ Pendiente: Configurar despliegues

## 🎯 Pasos a Seguir

### 1. Publicar @profesional/contracts a GitHub Packages

Este es el paso **MÁS IMPORTANTE** porque ambos proyectos dependen de este paquete.

#### A. Crear Personal Access Token en GitHub

1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click en "Generate new token (classic)"
3. Dale un nombre: `profesional-packages`
4. Selecciona estos permisos:
   - ✅ `write:packages` (incluye read:packages)
   - ✅ `read:packages`
   - ✅ `repo` (si el repo es privado)
5. Copia el token generado

#### B. Configurar el token localmente

```bash
# Opción 1: Variable de entorno (temporal)
export GITHUB_TOKEN=tu_token_aqui

# Opción 2: En tu ~/.npmrc (permanente)
echo "//npm.pkg.github.com/:_authToken=TU_TOKEN_AQUI" >> ~/.npmrc
```

#### C. Compilar y publicar contracts

```bash
cd packages/contracts

# Compilar
pnpm build

# Verificar que dist/ tiene los archivos
ls -la dist/

# Publicar
npm publish

# Deberías ver algo como:
# + @profesional/contracts@0.1.0
# ✅ Published to GitHub Packages
```

#### D. Verificar publicación

Ve a: `https://github.com/marcosstevens2012/profesional/packages`

Deberías ver el paquete `@profesional/contracts` listado.

### 2. Configurar el Nuevo Proyecto API

```bash
cd /Users/marcosstevens/Desktop/CARPETAS/PROFESIONAL/profesional-api

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de Supabase, etc.

# Agregar CORS_ORIGINS
echo "CORS_ORIGINS=http://localhost:3000" >> .env

# Configurar GitHub Token para instalar packages
export GITHUB_TOKEN=tu_token_aqui

# Instalar dependencias
pnpm install

# Generar Prisma client
pnpm prisma:generate

# Probar que funciona
pnpm dev
```

Si todo está bien, deberías ver:

```
[Nest] 12345  - 10/07/2025, 7:30:00 PM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 10/07/2025, 7:30:01 PM     LOG [NestApplication] Nest application successfully started
```

### 3. Crear Repositorio en GitHub para la API

```bash
cd /Users/marcosstevens/Desktop/CARPETAS/PROFESIONAL/profesional-api

# Inicializar git (ya debería estar hecho por el script)
git add .
git commit -m "Initial commit: API migration from monorepo"

# Crear repo en GitHub
# Ve a https://github.com/new
# Nombre: profesional-api
# Descripción: Backend API for Profesional platform
# Privado: Sí

# Conectar y subir
git remote add origin https://github.com/marcosstevens2012/profesional-api.git
git branch -M main
git push -u origin main
```

### 4. Limpiar el Monorepo (Frontend)

**⚠️ IMPORTANTE:** Solo ejecuta esto DESPUÉS de confirmar que la API funciona correctamente.

```bash
cd /Users/marcosstevens/Desktop/CARPETAS/PROFESIONAL/profesional

# El script te pedirá confirmación
./cleanup-monorepo.sh

# Responde "yes" cuando te lo pida
```

El script hará:

1. ✅ Crear backup de `apps/api`
2. ✅ Eliminar `apps/api`
3. ✅ Actualizar `pnpm-workspace.yaml`
4. ✅ Actualizar `turbo.json`
5. ✅ Actualizar `package.json` raíz
6. ✅ Limpiar dependencias

Después de ejecutarlo:

```bash
# Reinstalar dependencias
pnpm install

# Configurar URL de API
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" >> apps/web/.env.local

# Probar frontend
pnpm dev
```

### 5. Configurar Despliegues

#### Railway (API)

1. Ve a [Railway](https://railway.app)
2. New Project → Deploy from GitHub
3. Selecciona `profesional-api`
4. Configurar variables de entorno:

```bash
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_KEY=...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
CORS_ORIGINS=https://profesional.vercel.app,https://profesional-*.vercel.app
FRONTEND_URL=https://profesional.vercel.app
NODE_ENV=production
```

5. El `railway.toml` ya está configurado
6. Deploy automático

#### Vercel (Frontend)

1. Ve a [Vercel](https://vercel.com)
2. Import Project → Selecciona `profesional` (el monorepo limpio)
3. Framework: Next.js
4. Root Directory: `apps/web`
5. Configurar variables de entorno:

```bash
NEXT_PUBLIC_API_URL=https://profesional-api-production.up.railway.app
# (usa la URL que te dio Railway)

# Otras variables que necesites...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

6. Deploy

### 6. Actualizar GitHub Secrets para CI/CD

Si usas GitHub Actions:

```bash
# En ambos repos, agregar:
Settings → Secrets and variables → Actions → New repository secret

# Nombre: GITHUB_TOKEN_PKG
# Valor: tu_github_personal_access_token
```

## 🧪 Testing

### Probar Localmente

Terminal 1 - API:

```bash
cd /Users/marcosstevens/Desktop/CARPETAS/PROFESIONAL/profesional-api
pnpm dev
# Debería correr en http://localhost:3001
```

Terminal 2 - Frontend:

```bash
cd /Users/marcosstevens/Desktop/CARPETAS/PROFESIONAL/profesional
pnpm dev
# Debería correr en http://localhost:3000
```

Prueba:

1. Abre http://localhost:3000
2. Intenta hacer login
3. Verifica en Network tab que las requests van a `localhost:3001`
4. No debería haber errores CORS

### Probar en Producción

1. Verifica que la API responde:

   ```bash
   curl https://tu-api.railway.app/health
   ```

2. Verifica que el frontend puede conectarse:
   - Abre https://tu-frontend.vercel.app
   - Abre DevTools → Network
   - Intenta hacer login
   - Las requests deberían ir a la URL de Railway

## 🔄 Flujo de Trabajo Post-Migración

### Actualizar Tipos Compartidos

Cuando cambies tipos en `@profesional/contracts`:

```bash
# 1. En el monorepo frontend
cd packages/contracts

# 2. Hacer cambios en src/
nano src/schemas.ts

# 3. Compilar
pnpm build

# 4. Incrementar versión
npm version patch  # o minor, major

# 5. Publicar
npm publish

# 6. Actualizar en API
cd /ruta/a/profesional-api
pnpm update @profesional/contracts

# 7. Actualizar en Frontend
cd /ruta/a/profesional
pnpm update @profesional/contracts
```

### Desarrollar Nueva Feature

1. **Si solo afecta Frontend**: Trabaja en el monorepo frontend
2. **Si solo afecta API**: Trabaja en el repo de API
3. **Si afecta ambos**:
   - Actualiza contracts primero
   - Publica nueva versión
   - Actualiza API
   - Actualiza Frontend
   - Deploy API primero, luego Frontend

## 📚 Documentación Adicional

- [CORS_SETUP.md](./CORS_SETUP.md) - Configuración detallada de CORS
- [packages/contracts/README.md](./packages/contracts/README.md) - Uso de contracts
- API Swagger: https://tu-api.railway.app/api/docs

## ❓ Troubleshooting

### "Cannot find module '@profesional/contracts'"

```bash
# Verifica que tienes el token configurado
echo $GITHUB_TOKEN

# Si no, configúralo
export GITHUB_TOKEN=tu_token

# Reinstala
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### CORS Errors

Ver [CORS_SETUP.md](./CORS_SETUP.md)

### Build Errors en Railway

Verifica que `railway.toml` tiene:

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "pnpm start"
```

## 🎉 Checklist Final

Antes de considerar la migración completa:

- [ ] @profesional/contracts publicado en GitHub Packages
- [ ] API corriendo localmente sin errores
- [ ] Frontend corriendo localmente sin errores
- [ ] Login funciona localmente
- [ ] CORS configurado correctamente
- [ ] API desplegada en Railway
- [ ] Frontend desplegado en Vercel
- [ ] Login funciona en producción
- [ ] Variables de entorno configuradas en ambos ambientes
- [ ] Documentación actualizada
- [ ] Equipo informado del cambio

## 📞 Siguiente Nivel

Una vez que todo funciona:

- Configura CI/CD con GitHub Actions
- Implementa tests E2E
- Monitoreo con Sentry
- Analytics con PostHog
- Considera usar Turbopack en el frontend

---

**Creado**: 2025-10-07  
**Autor**: GitHub Copilot  
**Versión**: 1.0
