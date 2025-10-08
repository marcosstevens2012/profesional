# Profesional Frontend Monorepo

Frontend de la plataforma Profesional construido con Next.js y pnpm workspaces.

## 📦 Estructura del Proyecto

```
profesional/
├── apps/
│   └── web/              # Aplicación Next.js (Frontend)
├── packages/
│   ├── contracts/        # Tipos y contratos compartidos (TypeScript + Zod)
│   ├── ui/              # Componentes UI reutilizables
│   └── config/          # Configuraciones compartidas (ESLint, TypeScript, Prettier)
```

## 🚀 Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms & Validation**: Zod
- **Package Manager**: pnpm + Workspaces
- **Build Tool**: Turbo
- **Backend**: API externa (separada)
- **Database**: Supabase
- **Payments**: Mercado Pago
- **Video Calls**: Jitsi Meet

## 📋 Prerequisitos

- Node.js >= 20.0.0
- pnpm >= 8.0.0

## 🛠️ Instalación

```bash
# Instalar dependencias
pnpm install

# Copiar variables de entorno
cp apps/web/.env.example apps/web/.env.local

# Configurar variables de entorno en .env.local
```

## 🏃 Desarrollo

```bash
# Ejecutar en modo desarrollo
pnpm dev

# Build de producción
pnpm build

# Ejecutar build de producción
pnpm start

# Linting
pnpm lint

# Type checking
pnpm typecheck

# Formatear código
pnpm format
```

## 📦 Workspaces

### `@profesional/web`

Aplicación principal Next.js con:

- Autenticación con Supabase
- Búsqueda y exploración de profesionales
- Sistema de reservas y pagos
- Video llamadas integradas
- Panel de administración

### `@marcosstevens2012/contracts`

Tipos TypeScript compartidos y esquemas Zod para:

- Modelos de datos
- Validaciones
- Tipos de API
- Contratos compartidos con el backend

### `@profesional/ui`

Biblioteca de componentes UI reutilizables basada en:

- Radix UI
- Tailwind CSS
- CVA (Class Variance Authority)

### `@profesional/config`

Configuraciones compartidas:

- ESLint configs
- TypeScript configs
- Prettier config

## 🌐 Deployment

### Vercel (Recomendado)

El proyecto está optimizado para deployar en Vercel:

1. **Conectar repositorio a Vercel**
2. **Configurar proyecto:**
   - Framework: Next.js
   - Root Directory: `apps/web`
   - Build Command: `cd ../.. && pnpm build --filter=@profesional/web`
   - Install Command: `cd ../.. && pnpm install --frozen-lockfile`
   - Output Directory: `.next`

3. **Variables de entorno requeridas:**
   ```bash
   NEXT_PUBLIC_API_URL=https://tu-api-backend.com
   NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=tu_mp_public_key
   NEXT_PUBLIC_JITSI_DOMAIN=meet.jit.si
   NODE_ENV=production
   ```

## 🧪 Testing

```bash
# Ejecutar tests
pnpm test

# Ejecutar tests en modo watch
pnpm test:watch

# Coverage
pnpm test:coverage
```

## 📝 Scripts Disponibles

| Script           | Descripción                               |
| ---------------- | ----------------------------------------- |
| `pnpm dev`       | Inicia servidor de desarrollo             |
| `pnpm build`     | Build de producción de todos los paquetes |
| `pnpm start`     | Inicia servidor de producción             |
| `pnpm lint`      | Ejecuta linter                            |
| `pnpm format`    | Formatea código con Prettier              |
| `pnpm typecheck` | Verifica tipos TypeScript                 |
| `pnpm clean`     | Limpia archivos de build                  |

## 🔒 Variables de Entorno

Ver `apps/web/.env.example` para la lista completa de variables requeridas.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y propietario.

## 👥 Equipo

- Marcos Stevens (@marcosstevens2012)
