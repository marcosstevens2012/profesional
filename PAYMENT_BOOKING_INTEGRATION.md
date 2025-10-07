# Integración Pago-Booking Implementada

## Fecha: 2024-01-07

## Resumen

Se ha implementado la integración completa entre el sistema de pagos y las reservas (bookings), permitiendo que los clientes paguen directamente por una consulta específica.

## Cambios Realizados

### 1. Endpoint Nuevo en BookingsController

```typescript
POST /bookings/:id/payment
```

**Propósito**: Crear un pago vinculado a una reserva específica

**Seguridad**:

- Requiere autenticación JWT
- Solo accesible para rol CLIENT
- Valida que la booking pertenezca al cliente autenticado

**Respuesta**:

```json
{
  "paymentId": "uuid",
  "preferenceId": "mp-preference-id",
  "init_point": "https://www.mercadopago.com.ar/checkout/...",
  "amount": 5000,
  "bookingId": "uuid"
}
```

### 2. Método en BookingsService

#### `createPaymentForBooking(bookingId: string, clientId: string)`

**Validaciones**:

1. ✅ Booking existe
2. ✅ Booking pertenece al cliente
3. ✅ Estado es PENDING_PAYMENT
4. ✅ No existe ya un pago para esta booking

**Flujo**:

1. Obtiene booking con professional profile y precio
2. Crea MercadoPago preference con:
   - Item: Consulta con [nombre profesional]
   - External reference: bookingId
   - Payer: email y nombre del cliente
   - Back URLs configuradas a frontend
   - Webhook configurado
   - Metadata: bookingId, professionalId, clientId
3. Crea registro Payment vinculado a booking
4. Retorna init_point para redirección

### 3. Configuración de Pago

**Tipo de pago**: Plataforma única (NO split payment)

- Todo el dinero va a la cuenta de la plataforma
- Se rastrea el profesional en metadata para futura distribución
- No se usa `marketplace_fee` ni `split_payments`

**MercadoPago Preference**:

```typescript
{
  items: [{
    title: "Consulta con Dr. Juan Pérez",
    description: "Consulta profesional - 07/01/2024",
    quantity: 1,
    unit_price: 5000,
    currency_id: "ARS"
  }],
  external_reference: "booking-uuid",
  payer: { email, name },
  back_urls: { success, failure, pending },
  auto_return: "approved",
  notification_url: "webhook-url",
  metadata: { bookingId, professionalId, clientId }
}
```

## Flujo de Usuario Completo

### Cliente

1. Navega al perfil del profesional
2. Solicita una consulta (crea booking con estado PENDING_PAYMENT)
3. **[NUEVO]** POST /bookings/:id/payment
4. Recibe `init_point` y es redirigido a MercadoPago
5. Completa el pago
6. Es redirigido según resultado:
   - Success: `/bookings/:id/success`
   - Failure: `/bookings/:id/failure`
   - Pending: `/bookings/:id/pending`

### Profesional (Pendiente de implementar)

1. Recibe notificación cuando pago es aprobado
2. Puede aceptar/rechazar la consulta
3. Si acepta, booking pasa a CONFIRMED

## Próximos Pasos

### 1. Webhook → Booking Update

```typescript
// En payments.service.ts handleWebhook()
if (payment.status === "approved") {
  const booking = await findBookingByExternalRef(data.external_reference);
  await bookingsService.markAsWaitingForProfessional(booking.id);
  await notificationService.notifyProfessional(booking.professionalId, booking);
}
```

### 2. Sistema de Notificaciones

- [ ] Crear tabla `Notification` en schema
- [ ] Implementar NotificationService
- [ ] Email cuando pago aprobado
- [ ] Notificación in-app para profesional

### 3. Actualización de Estados

```
PENDING_PAYMENT (cliente crea booking)
    ↓ (pago aprobado via webhook)
WAITING_FOR_PROFESSIONAL (notificar profesional)
    ↓ (profesional acepta)
CONFIRMED
    ↓ (hora de la cita)
IN_PROGRESS
    ↓ (videollamada termina)
COMPLETED
```

### 4. Frontend Integration

- [ ] Hook para crear pago: `useCreateBookingPayment(bookingId)`
- [ ] Redirección a MercadoPago checkout
- [ ] Páginas de resultado: success/failure/pending
- [ ] Mostrar estado de pago en booking detail

## Archivos Modificados

1. **apps/api/src/bookings/bookings.controller.ts**
   - Agregado endpoint POST /:id/payment

2. **apps/api/src/bookings/bookings.service.ts**
   - Agregado método createPaymentForBooking()
   - Inyectado MercadoPagoService

3. **apps/api/src/bookings/bookings.module.ts**
   - Ya tenía PaymentsModule importado ✅

## Decisiones Técnicas

### ¿Por qué no usar PaymentsService.createMarketplacePreference()?

- Ese método está diseñado para split payments con comisión
- Queremos pago directo a plataforma (100%)
- Usamos MercadoPagoService.createPreference() directamente

### ¿Por qué external_reference = bookingId?

- Permite vincular webhook de MP con booking
- Al recibir notificación, sabemos qué booking actualizar
- Un payment puede tener un bookingId FK, pero external_reference es la clave en MP

### ¿Por qué metadata incluye professionalId?

- Para futura distribución de fondos
- Para analytics y reportes
- Para auditoría de transacciones

## Testing

### Casos a probar:

1. ✅ Cliente crea pago para su propia booking
2. ❌ Cliente intenta pagar booking de otro cliente (ForbiddenException)
3. ❌ Cliente intenta pagar booking ya pagada (BadRequestException)
4. ❌ Cliente intenta pagar booking con estado != PENDING_PAYMENT
5. ✅ Webhook actualiza booking cuando pago aprobado
6. ✅ Profesional recibe notificación cuando pago aprobado

## Referencias

- BUSINESS_FLOW_ANALYSIS.md (análisis del flujo completo)
- MERCADOPAGO_INTEGRATION_REVIEW.md (documentación de MP)
- apps/api/prisma/schema.prisma (modelo Payment con bookingId FK)
