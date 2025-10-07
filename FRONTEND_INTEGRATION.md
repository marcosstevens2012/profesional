# Frontend Payment & Notifications Integration

## 📋 Resumen

Este documento describe la integración completa del sistema de pagos y notificaciones en el frontend de la aplicación.

## 🎯 Componentes Implementados

### 1. Payment Hooks

**Archivo:** `apps/web/src/hooks/useCreateBookingPayment.ts`

```typescript
const { createPayment, isLoading, error } = useCreateBookingPayment();
await createPayment(bookingId); // Auto-redirige a MercadoPago
```

**Características:**

- Llama a `POST /bookings/:id/payment`
- Redirección automática al checkout de MercadoPago
- Estados de loading y error
- Integración con React Query

### 2. Notification Hooks

**Archivo:** `apps/web/src/hooks/useNotifications.ts`

**Hooks disponibles:**

```typescript
// Obtener notificaciones (all/unread)
const { data: notifications } = useNotifications("unread");

// Contador de no leídas
const { data: unreadCount } = useUnreadNotificationsCount();

// Marcar como leída
const { mutateAsync } = useMarkNotificationAsRead();
await mutateAsync(notificationId);

// Marcar todas como leídas
const { mutateAsync } = useMarkAllNotificationsAsRead();
await mutateAsync();

// Eliminar notificación
const { mutateAsync } = useDeleteNotification();
await mutateAsync(notificationId);
```

**Características:**

- Auto-refetch cada 30 segundos
- Integración con React Query
- Manejo de errores
- Cache automático

### 3. Payment Result Pages

#### Success Page

**Archivo:** `apps/web/src/app/bookings/[id]/success/page.tsx`

**URL:** `/bookings/:id/success?payment_id=xxx&status=approved`

**Características:**

- ✅ Ícono de éxito con animación bounce
- Muestra booking ID y payment ID
- Links a detalles de la reserva y dashboard
- Información de próximos pasos
- Diseño con gradiente verde

#### Failure Page

**Archivo:** `apps/web/src/app/bookings/[id]/failure/page.tsx`

**URL:** `/bookings/:id/failure?status=rejected`

**Características:**

- ❌ Ícono de error
- Botón para reintentar pago
- Lista de razones comunes de rechazo
- Opciones de navegación
- Diseño con gradiente rojo

#### Pending Page

**Archivo:** `apps/web/src/app/bookings/[id]/pending/page.tsx`

**URL:** `/bookings/:id/pending?payment_id=xxx&status=pending`

**Características:**

- ⏳ Ícono de reloj con animación pulse
- Información sobre tiempo de procesamiento (hasta 48h)
- Explicación de estados pendientes
- Aviso de notificación por email
- Diseño con gradiente amarillo/naranja

### 4. Payment Checkout Component

**Archivo:** `apps/web/src/components/PaymentCheckout.tsx`

**Props:**

```typescript
interface PaymentCheckoutProps {
  bookingId: string;
  professionalName: string;
  sessionDate: string;
  sessionTime: string;
  price: number;
}
```

**Características:**

- Resumen de la reserva
- Información del profesional
- Fecha y hora de la sesión
- Precio destacado
- Botón "Pagar con MercadoPago"
- Estados de loading
- Manejo de errores
- Badge de seguridad

**Uso:**

```tsx
<PaymentCheckout
  bookingId={booking.id}
  professionalName={booking.professional.name}
  sessionDate="15 de Mayo, 2024"
  sessionTime="14:00 hs"
  price={booking.professional.pricePerSession}
/>
```

### 5. Notification Bell Component

**Archivo:** `apps/web/src/components/NotificationBell.tsx`

**Características:**

- 🔔 Ícono de campana en navbar
- Badge rojo con contador (máx 9+)
- Dropdown con notificaciones recientes
- Botón "Marcar todas como leídas"
- Botón individual para marcar cada una
- Links a detalles de reservas
- Timestamps relativos (hace 5m, 2h, etc.)
- Auto-cierre al hacer click fuera
- Link a página completa de notificaciones

**Uso:**

```tsx
// En navbar/header
<NotificationBell />
```

### 6. Notifications Page

**Archivo:** `apps/web/src/app/notifications/page.tsx`

**Ruta:** `/notifications`

**Características:**

- Filtros: "Todas" / "No leídas"
- Lista completa de notificaciones
- Íconos por tipo de notificación:
  - 📅 BOOKING_REQUEST
  - ✅ BOOKING_CONFIRMED
  - ❌ BOOKING_CANCELLED
  - 💰 PAYMENT_RECEIVED
  - ⭐ REVIEW_RECEIVED
  - 🔔 SYSTEM_NOTIFICATION
- Botón "Marcar todas como leídas"
- Botón para eliminar individualmente
- Links a detalles de reservas
- Fechas formateadas completas
- Destacado visual para no leídas (fondo azul)

## 🔄 Flujo Completo de Pago

### 1. Iniciación del Pago

```tsx
// En página de booking
import PaymentCheckout from "@/components/PaymentCheckout";

<PaymentCheckout
  bookingId={booking.id}
  professionalName={booking.professional.user.name}
  sessionDate={formatDate(booking.scheduledAt)}
  sessionTime={formatTime(booking.scheduledAt)}
  price={booking.professional.pricePerSession}
/>;
```

### 2. Usuario Hace Click en "Pagar"

- Hook `useCreateBookingPayment` llama a API
- Backend crea Payment y retorna `init_point`
- Frontend redirige automáticamente a MercadoPago

### 3. Usuario Completa Pago en MercadoPago

MercadoPago redirige según resultado:

- Success: `/bookings/:id/success?payment_id=xxx&status=approved`
- Failure: `/bookings/:id/failure?status=rejected`
- Pending: `/bookings/:id/pending?payment_id=xxx&status=pending`

### 4. Webhook Procesa en Background

- Actualiza estado del Payment
- Actualiza Booking a `WAITING_FOR_PROFESSIONAL`
- Crea notificación para el profesional

### 5. Profesional Recibe Notificación

- Badge rojo aparece en NotificationBell
- Dropdown muestra nueva notificación
- Click en notificación → página de detalles de booking

## 📱 Integración en Navbar

```tsx
// app/layout.tsx o components/Navbar.tsx
import NotificationBell from "@/components/NotificationBell";

export default function Navbar() {
  return (
    <nav>
      <div className="flex items-center gap-4">
        {/* Otros elementos */}
        <NotificationBell />
        {/* User menu */}
      </div>
    </nav>
  );
}
```

## 🎨 Diseño y UX

### Paleta de Colores

- **Success:** Gradiente verde (`from-green-50 to-emerald-50`)
- **Failure:** Gradiente rojo (`from-red-50 to-pink-50`)
- **Pending:** Gradiente amarillo (`from-yellow-50 to-orange-50`)
- **Primary:** Azul 600 para botones y links

### Animaciones

- Success: CheckCircle con `animate-bounce`
- Pending: Clock con `animate-pulse`
- NotificationBell: Badge con fondo rojo pulsante

### Responsividad

- Todos los componentes son mobile-first
- Breakpoints con Tailwind CSS
- Dropdown de notificaciones ajustable a pantalla

## 🔔 Sistema de Notificaciones en Tiempo Real

### Polling Automático

Las notificaciones se actualizan cada 30 segundos:

```typescript
// En useNotifications hook
refetchInterval: 30000, // 30 segundos
```

### Tipos de Notificación Soportados

1. **BOOKING_REQUEST** - Nueva solicitud de consulta
2. **BOOKING_CONFIRMED** - Consulta confirmada
3. **BOOKING_CANCELLED** - Consulta cancelada
4. **PAYMENT_RECEIVED** - Pago recibido
5. **REVIEW_RECEIVED** - Nueva reseña recibida
6. **SYSTEM_NOTIFICATION** - Notificación del sistema

### Payload de Notificaciones

```typescript
interface NotificationPayload {
  bookingId?: string;
  paymentId?: string;
  amount?: number;
  clientId?: string;
  professionalId?: string;
}
```

## 🚀 Próximos Pasos

### Features Pendientes

1. **Email Notifications**
   - Configurar servicio de email (Resend/SendGrid)
   - Templates para cada tipo de notificación
   - Envío automático desde webhook

2. **Professional Dashboard**
   - Sección "Solicitudes Pendientes"
   - Lista de bookings con status `WAITING_FOR_PROFESSIONAL`
   - Botones rápidos: Aceptar/Rechazar
   - Información del cliente y pago

3. **Push Notifications**
   - Service Worker para notificaciones browser
   - Permisos de notificación
   - Integración con Firebase Cloud Messaging

4. **Refetch Manual**
   - Botón de refresh en NotificationBell
   - Pull-to-refresh en página de notificaciones
   - Indicador visual de sincronización

## 📝 Testing

### Test de Flujo Completo

1. Usuario crea booking
2. Usuario hace click en "Pagar"
3. Redirige a MercadoPago sandbox
4. Completa pago con tarjeta de prueba
5. Redirige a página de success/failure/pending
6. Webhook actualiza booking
7. Profesional ve notificación
8. Profesional aprueba/rechaza consulta

### Tarjetas de Prueba MercadoPago

- **Aprobado:** `4509 9535 6623 3704`
- **Rechazado:** `4000 0000 0000 0002`
- **Pendiente:** `3711 803032 57522`

## 🐛 Troubleshooting

### Notificaciones no se actualizan

- Verificar que React Query esté configurado correctamente
- Comprobar que el refetchInterval esté activo
- Revisar permisos de API (token JWT válido)

### Redirección de MercadoPago falla

- Verificar URLs de success/failure/pending en backend
- Comprobar que init_point sea válido
- Revisar configuración de MercadoPago en dashboard

### Badge no muestra contador

- Verificar que useUnreadNotificationsCount retorne data
- Comprobar que notifications tengan campo `read`
- Revisar query de backend `/notifications/unread/count`

## 📚 Referencias

- [MercadoPago Checkout Pro](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/landing)
- [React Query Docs](https://tanstack.com/query/latest)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
