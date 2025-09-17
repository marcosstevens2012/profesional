export const messages = {
  // Navigation
  "nav.home": "Inicio",
  "nav.explore": "Explorar",
  "nav.login": "Ingresar",
  "nav.logout": "Cerrar Sesión",
  "nav.panel": "Panel",
  "nav.profile": "Perfil",
  "nav.payments": "Pagos",
  "nav.requests": "Mis Solicitudes",

  // Common
  "common.loading": "Cargando...",
  "common.error": "Ha ocurrido un error",
  "common.search": "Buscar",
  "common.filter": "Filtrar",
  "common.clear": "Limpiar",
  "common.apply": "Aplicar",
  "common.cancel": "Cancelar",
  "common.save": "Guardar",
  "common.edit": "Editar",
  "common.delete": "Eliminar",
  "common.back": "Volver",

  // Landing Page
  "landing.title": "Conecta con Profesionales de Confianza",
  "landing.subtitle":
    "Encuentra y contrata servicios profesionales de calidad en tu área",
  "landing.cta": "Comenzar Ahora",

  // Explore
  "explore.title": "Explorar Profesionales",
  "explore.subtitle": "Encuentra el profesional perfecto para tu proyecto",
  "explore.filters.category": "Categoría",
  "explore.filters.location": "Ubicación",
  "explore.filters.rating": "Valoración",
  "explore.filters.price": "Precio",

  // Profile
  "profile.public.title": "Perfil de {name}",
  "profile.public.contact": "Contactar",
  "profile.public.book": "Reservar",
  "profile.public.reviews": "Reseñas",
  "profile.public.about": "Acerca de",
  "profile.public.services": "Servicios",

  // Panel
  "panel.welcome": "Bienvenido, {name}",
  "panel.tabs.requests": "Mis Solicitudes",
  "panel.tabs.payments": "Pagos",
  "panel.tabs.profile": "Mi Perfil",

  // Auth
  "auth.login.title": "Iniciar Sesión",
  "auth.login.subtitle": "Ingresa a tu cuenta para continuar",
  "auth.register.title": "Crear Cuenta",
  "auth.register.subtitle": "Únete a nuestra plataforma",

  // Currency
  "currency.ars": "ARS $",
} as const;

export type MessageKeys = keyof typeof messages;
