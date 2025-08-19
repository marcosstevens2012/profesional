# App Web - Marketplace de Profesionales

Aplicación web frontend construida con **Next.js 14**, **App Router**, **TypeScript**, **Tailwind CSS** y **shadcn/ui**.

## 🚀 Características

### Arquitectura

- ✅ **Next.js 14** con App Router
- ✅ **TypeScript** para tipado estático
- ✅ **Tailwind CSS** para styling
- ✅ **shadcn/ui** para componentes
- ✅ **TanStack Query** para estado del servidor
- ✅ **next-themes** para tema claro/oscuro
- ✅ **React Intl** para internacionalización (es-AR)

### Rutas Implementadas

- ✅ `/` - Landing page con hero section y features
- ✅ `/explorar` - Listado de profesionales con filtros
- ✅ `/profesionales/[slug]` - Perfil público de profesional
- ✅ `/ingresar` - Autenticación (login/registro)
- ✅ `/panel` - Dashboard de usuario con tabs

### Funcionalidades UI/UX

- ✅ Layout responsivo con header/footer
- ✅ Sistema de temas (claro/oscuro)
- ✅ Breadcrumbs automáticos
- ✅ Navegación intuitiva
- ✅ Formateo de moneda ARS
- ✅ Tipografías del sistema

### Integración Técnica

- ✅ Variables de entorno tipadas (Zod)
- ✅ Integración con `@profesional/contracts`
- ✅ Integración con `@profesional/ui`
- ✅ Configuración SEO con next-seo

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
# Desarrollo (desde la raíz del monorepo)
pnpm run dev

# Build
pnpm run build

# Linting
pnpm run lint

# Formateo
pnpm run format

# Type checking
pnpm run typecheck
```

### Estructura de Archivos

```
src/
├── app/                      # App Router pages
│   ├── layout.tsx           # Root layout con providers
│   ├── page.tsx             # Landing page
│   ├── explorar/            # Explorar profesionales
│   ├── profesionales/[slug] # Perfil de profesional
│   ├── ingresar/            # Autenticación
│   └── panel/               # Dashboard de usuario
├── components/              # Componentes reutilizables
│   ├── header.tsx          # Navegación principal
│   ├── footer.tsx          # Footer del sitio
│   └── breadcrumbs.tsx     # Navegación breadcrumbs
├── lib/                    # Utilidades y configuraciones
│   ├── query-provider.tsx  # TanStack Query setup
│   ├── theme-provider.tsx  # next-themes setup
│   ├── i18n-provider.tsx   # React Intl setup
│   ├── messages.ts         # Textos en español
│   ├── i18n.ts            # Utilidades de i18n
│   └── utils.ts           # Utilidades generales
└── types/
    └── env.ts              # Validación de variables de entorno
```

## 🌍 Internacionalización

La aplicación está configurada para **es-AR** (Español Argentina):

- Formateo de moneda: `ARS $15.000`
- Formateo de fechas en formato argentino
- Textos en español rioplatense
- Configuración de locale en Next.js

## 🎨 Theming

Sistema de temas implementado con `next-themes`:

- Tema claro (por defecto)
- Tema oscuro
- Auto (sigue preferencia del sistema)
- Toggle en header

## 🔧 Variables de Entorno

Copia `.env.example` a `.env.local` y configura:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Mercado Pago
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=your_key_here

# Jitsi
NEXT_PUBLIC_JITSI_DOMAIN=meet.jit.si
```

## 🔗 Integración con Backend

La app está configurada para conectar con la API NestJS:

- Endpoint base: `process.env.NEXT_PUBLIC_API_URL`
- Tipos compartidos desde `@profesional/contracts`
- TanStack Query para manejo de estado del servidor

## 📱 Rutas y Navegación

### Estructura de Rutas

1. **Landing (`/`)**
   - Hero section con CTAs
   - Sección de características
   - Links a explorar y registro

2. **Explorar (`/explorar`)**
   - Filtros por categoría, ubicación, rating
   - Grid de profesionales
   - Paginación y búsqueda

3. **Perfil Profesional (`/profesionales/[slug]`)**
   - Información completa del profesional
   - Servicios y precios
   - Reseñas y ratings
   - CTAs de contacto

4. **Autenticación (`/ingresar`)**
   - Login y registro
   - OAuth con Google/LinkedIn
   - CTA para registro de profesionales

5. **Panel de Usuario (`/panel`)**
   - Dashboard with tabs:
     - Mis Solicitudes
     - Mensajes
     - Pagos
     - Mi Perfil

### Breadcrumbs

Sistema automático de breadcrumbs que genera navegación contextual basada en la URL actual.

## 🎯 Próximos Pasos

- [ ] Implementar autenticación real
- [ ] Conectar con API backend
- [ ] Agregar tests unitarios
- [ ] Implementar PWA
- [ ] Optimizar performance
- [ ] Agregar analytics

## 📚 Recursos

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query)
- [React Intl](https://formatjs.io/docs/react-intl)
