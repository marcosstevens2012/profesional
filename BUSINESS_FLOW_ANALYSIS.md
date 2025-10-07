# 📋 Análisis del Flujo de Negocio - Plataforma Profesional

## Estado Actual vs Flujo Esperado

### ✅ PASO 1: Profesional se registra y valida email

**Estado: IMPLEMENTADO ✅**

**Backend:**

- `apps/api/src/auth/auth.service.ts` - Método `register()`
  - ✅ Acepta `role: PROFESSIONAL`
  - ✅ Hash de password con bcrypt
  - ✅ Crea User con status `PENDING_VERIFICATION`
  - ✅ Crea Profile básico
  - ✅ Genera token de verificación (24h)
  - ✅ Envía email de verificación
- Método `verifyEmail()`
  - ✅ Valida token
  - ✅ Actualiza status a `ACTIVE`

**Código clave:**

```typescript
// auth.service.ts - línea 45-95
const user = await this._prisma.$transaction(async tx => {
  const newUser = await tx.user.create({
    data: {
      email,
      password: hashedPassword,
      role: role.toUpperCase(), // PROFESSIONAL
      status: "PENDING_VERIFICATION",
      profile: { create: { firstName, lastName } },
    },
  });

  // Token de verificación
  await tx.verificationToken.create({
    data: {
      userId: newUser.id,
      token: verificationToken,
      type: "EMAIL_VERIFICATION",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  await this._emailService.sendEmailVerification(email, token);
});
```

---

### ❌ PASO 2: Completa perfil profesional + credenciales MercadoPago

**Estado: PARCIALMENTE IMPLEMENTADO ⚠️**

**Lo que SÍ existe:**

✅ **Schema de BD:**

```prisma
model ProfessionalProfile {
  id                String   @id @default(cuid())
  userId            String   @unique
  email             String?  // Email profesional
  name              String?  // Nombre profesional
  bio               String?
  description       String?
  pricePerSession   Decimal  @default(25000.00)
  standardDuration  Int      // Duración en minutos
  serviceCategoryId String
  tags              String[]
  locationId        String
  rating            Float    @default(0)
  reviewCount       Int      @default(0)
  isVerified        Boolean  @default(false)
  isActive          Boolean  @default(true)
}
```

✅ **Endpoints:**

- `POST /profiles` - Crear perfil
- `PUT /profiles/:id` - Actualizar perfil
- `GET /profiles/:id` - Obtener perfil

**Lo que FALTA:** ❌

❌ **No hay campo para credenciales de MercadoPago:**

```sql
-- FALTA EN SCHEMA:
mercadoPagoUserId    Int?     // MP User ID
mercadoPagoEmail     String?  // Email vinculado a MP
mercadoPagoAccessToken String? // Token de acceso (encriptado)
```

❌ **No hay endpoint para configurar MP:**

```typescript
// NECESARIO:
PUT /api/professionals/:id/mercadopago
{
  "mpUserId": 123456,
  "mpEmail": "pro@email.com"
}
```

**ACCIÓN REQUERIDA:**

1. Agregar campos MP al modelo `ProfessionalProfile`
2. Crear endpoint para setup de credenciales MP
3. Validar que profesional tenga MP antes de aparecer en búsquedas

---

### ✅ PASO 3: Aparece en buscador/listado

**Estado: IMPLEMENTADO ✅**

**Backend:**

- `apps/api/src/search/search.service.ts`
- `apps/api/src/profiles/profiles.service.ts`

**Endpoints:**

- ✅ `GET /api/search/professionals` - Búsqueda con filtros
- ✅ `GET /api/profiles` - Listado de profesionales
- ✅ Filtros: categoría, ubicación, rating, precio

**Código:**

```typescript
// search.service.ts
async searchProfessionals(query) {
  return await this.prisma.professionalProfile.findMany({
    where: {
      isActive: true,
      isVerified: true, // Solo verificados
      // ... filtros
    },
    include: { serviceCategory: true, location: true }
  });
}
```

**NOTA:** ⚠️ Debería verificar también que tenga credenciales MP configuradas.

---

### ✅ PASO 4: Cliente solicita consulta

**Estado: IMPLEMENTADO ✅**

**Backend:**

- `apps/api/src/bookings/bookings.service.ts` - Método `create()`

**Flujo:**

1. ✅ Cliente crea booking
2. ✅ Se genera sala Jitsi única
3. ✅ Status inicial: `PENDING_PAYMENT`
4. ✅ MeetingStatus: `PENDING`

**Código:**

```typescript
// bookings.service.ts - línea 14-45
async create(createBookingDto) {
  const professional = await this.prisma.professionalProfile.findUnique({
    where: { id: createBookingDto.professionalId }
  });

  const jitsiRoom = `${professional.id.slice(-8)}-${uuidv4().split("-")[0]}`;

  const booking = await this.prisma.booking.create({
    data: {
      ...createBookingDto,
      jitsiRoom,
      meetingStatus: MeetingStatus.PENDING,
      status: BookingStatus.PENDING_PAYMENT, // ✅
    }
  });

  return booking;
}
```

---

### ⚠️ PASO 5: Pago online (MercadoPago)

**Estado: IMPLEMENTADO PERO INCOMPLETO ⚠️**

**Lo que SÍ funciona:**

- ✅ `apps/api/src/payments/mercadopago.service.ts`
- ✅ Crear preferencia de pago
- ✅ Procesar webhooks
- ✅ Actualizar estado de payment

**El problema:**
❌ **No está conectado con el booking automáticamente**

**Flujo actual:**

```typescript
// payments.controller.ts
POST /api/payments/create-preference
{
  "title": "Consulta",
  "amount": 5000,
  "professionalSlug": "juan-perez"
}
// ❌ NO recibe bookingId
// ❌ NO vincula payment con booking
```

**Flujo esperado:**

```typescript
POST /api/bookings/:bookingId/payment
{
  "amount": 5000
}
// ✅ Crea payment vinculado a booking
// ✅ Genera preferencia MP
// ✅ Retorna init_point para checkout
```

**ACCIÓN REQUERIDA:**

1. Modificar endpoint de pago para recibir `bookingId`
2. Vincular Payment con Booking en BD (ya existe relación)
3. Al aprobar pago, actualizar booking a `CONFIRMED`

---

### ⚠️ PASO 6: Pago va a la plataforma (por ahora)

**Estado: CONFIGURACIÓN PENDIENTE ⚠️**

**Situación actual:**

- ✅ MercadoPago integrado
- ⚠️ Sistema tiene soporte para marketplace split payments
- ❌ No está configurado para enviar TODO a la plataforma

**Código actual (payments.service.ts):**

```typescript
// Tiene soporte para split:
const mpPreference = {
  items: [{ unit_price: totalAmount }],
  marketplace: "PROFESIONAL-MARKETPLACE",
  marketplace_fee: platformFee, // ⚠️
  split_payments: [
    {
      amount: professionalAmount,
      collector: { id: professionalMPUserId }, // ⚠️
    },
  ],
};
```

**Para que TODO vaya a la plataforma:**

**Opción A - Sin split (RECOMENDADO para esta fase):**

```typescript
const mpPreference = {
  items: [{ unit_price: totalAmount }],
  // ❌ NO incluir marketplace
  // ❌ NO incluir split_payments
  notification_url: webhook_url,
  external_reference: bookingId,
};
```

**Opción B - Con tracking interno:**

```typescript
// Payment en BD con comisión virtual
const payment = await prisma.payment.create({
  data: {
    amount: 5000,
    platformFee: 5000, // 100% a plataforma
    professionalAmount: 0, // 0% al profesional por ahora
    netAmount: 5000,
    status: "PENDING",
  },
});
```

**ACCIÓN REQUERIDA:**

1. Remover lógica de split payments temporalmente
2. Configurar que 100% vaya a la plataforma
3. Guardar en metadata del payment el monto que "corresponde" al profesional (para futura distribución manual)

---

### ❌ PASO 7: Notificación al profesional

**Estado: PARCIALMENTE IMPLEMENTADO ⚠️**

**Lo que existe:**

- ✅ Sistema de notificaciones en BD
- ✅ Webhook de MercadoPago configurado
- ✅ Método para actualizar booking cuando pago aprobado

**Lo que FALTA:**

- ❌ Email al profesional cuando pago confirmado
- ❌ Notificación en la app (frontend)

**Código actual:**

```typescript
// bookings.service.ts - línea 99-128
async markAsWaitingForProfessional(bookingId: string) {
  const updatedBooking = await this.prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: BookingStatus.CONFIRMED,
      meetingStatus: MeetingStatus.WAITING // ✅ Esperando aceptación
    }
  });

  // TODO: Enviar email al profesional ❌
  // await this.sendProfessionalNotification(updatedBooking);

  return updatedBooking;
}
```

**ACCIÓN REQUERIDA:**

1. Implementar `sendProfessionalNotification()`
2. Crear notificación en tabla `Notification`
3. Enviar email al profesional con link al booking

**Código sugerido:**

```typescript
async sendProfessionalNotification(booking) {
  // Crear notificación en BD
  await this.prisma.notification.create({
    data: {
      userId: booking.professional.user.id,
      type: 'BOOKING_CONFIRMED',
      title: 'Nueva solicitud de consulta',
      message: `${booking.client.email} solicitó una consulta`,
      payload: { bookingId: booking.id }
    }
  });

  // Enviar email
  await this.emailService.sendEmail({
    to: booking.professional.user.email,
    subject: 'Nueva solicitud de consulta',
    template: 'booking-request',
    data: { booking }
  });
}
```

---

### ⚠️ PASO 8: Profesional acepta → Chat + Videollamada

**Estado: PARCIALMENTE IMPLEMENTADO ⚠️**

**🚨 PROBLEMA CRÍTICO:**
El flujo requiere **"chat interno"** pero acabamos de eliminarlo completamente.

**Estado actual:**

✅ **Aceptación de solicitud - IMPLEMENTADO:**

```typescript
// bookings.service.ts - línea 131-180
async acceptMeeting(bookingId: string, professionalUserId: string) {
  // ✅ Verifica que sea el profesional correcto
  // ✅ Verifica estado WAITING
  // ✅ Verifica límite de reuniones (max 1 activa + 1 en cola)

  const updatedBooking = await this.prisma.booking.update({
    where: { id: bookingId },
    data: {
      meetingStatus: MeetingStatus.ACTIVE,
      meetingStartTime: now,
      meetingEndTime: now + 18min, // ✅ Timer de 18 min
      status: BookingStatus.IN_PROGRESS
    }
  });

  // ✅ Auto-finalización después de 18 min
  setTimeout(() => this.endMeetingAutomatically(bookingId), 18 * 60 * 1000);

  return updatedBooking;
}
```

✅ **Videollamada Jitsi - IMPLEMENTADO:**

- `apps/web/src/components/JitsiMeeting.tsx`
- ✅ Integración completa con Jitsi
- ✅ Toolbar personalizado
- ✅ Configuración de sala
- ✅ Sin chat (removido en paso anterior)

❌ **Chat interno - ELIMINADO:**

- ❌ Se eliminaron todos los archivos de chat
- ❌ No hay WebSocket/Socket.IO
- ❌ No hay modelos de Message en BD

**DECISIÓN REQUERIDA DEL USUARIO:**

**Opción A - Sin chat (mantener actual):**

- Comunicación SOLO por videollamada
- Profesional acepta → va directo a Jitsi
- Más simple, menos complejo

**Opción B - Re-implementar chat:**

- Necesitaría crear todo de nuevo
- WebSocket server
- Modelos de Message/Conversation
- UI de chat
- Storage para adjuntos

**Opción C - Chat externo (Telegram/WhatsApp):**

- Al aceptar, mostrar botón "Contactar por WhatsApp"
- Link a chat de Telegram
- No requiere desarrollo

---

## 🎯 Resumen de Estado por Paso

| Paso | Descripción                 | Estado       | Prioridad Fix |
| ---- | --------------------------- | ------------ | ------------- |
| 1    | Registro y validación email | ✅ COMPLETO  | -             |
| 2    | Perfil + Credenciales MP    | ⚠️ PARCIAL   | 🔴 ALTA       |
| 3    | Listado/buscador            | ✅ COMPLETO  | -             |
| 4    | Solicitud de consulta       | ✅ COMPLETO  | -             |
| 5    | Pago MercadoPago            | ⚠️ PARCIAL   | 🔴 ALTA       |
| 6    | Pago a plataforma           | ⚠️ CONFIG    | 🟡 MEDIA      |
| 7    | Notificación profesional    | ⚠️ PARCIAL   | 🟡 MEDIA      |
| 8    | Aceptación + Videollamada   | ✅ COMPLETO  | -             |
| 8    | Chat interno                | ❌ ELIMINADO | 🔴 DECISIÓN   |

---

## 🚨 Acciones Críticas Requeridas

### 1. **Credenciales MercadoPago en Perfil Profesional** 🔴

```sql
-- Migración requerida:
ALTER TABLE professional_profiles
ADD COLUMN mercadopago_user_id INTEGER,
ADD COLUMN mercadopago_email VARCHAR(255);
```

```typescript
// Endpoint requerido:
PUT /api/professionals/:id/mercadopago
POST /api/professionals/:id/mercadopago/verify
```

### 2. **Vincular Pago con Booking** 🔴

```typescript
// Modificar:
POST /api/bookings/:bookingId/payment

// En lugar de:
POST /api/payments/create-preference
```

### 3. **Configurar Pago 100% a Plataforma** 🟡

```typescript
// Remover en createPreference():
// - marketplace
// - marketplace_fee
// - split_payments
```

### 4. **Notificaciones al Profesional** 🟡

```typescript
// Implementar:
async sendProfessionalNotification(booking) {
  await createNotification();
  await sendEmail();
}
```

### 5. **Decisión sobre Chat** 🔴

**¿Qué hacer con el chat interno?**

- [ ] A) Mantener sin chat (solo videollamada)
- [ ] B) Re-implementar chat completo
- [ ] C) Integración con WhatsApp/Telegram
- [ ] D) Otro...

---

## 📊 Diagrama de Flujo Actual

```
1. Profesional → Registro → ✅ Email verificado
                          ↓
2. Profesional → Completa perfil → ⚠️ FALTA config MP
                          ↓
3. Sistema → ✅ Aparece en búsquedas
                          ↓
4. Cliente → ✅ Solicita consulta (Booking PENDING_PAYMENT)
                          ↓
5. Cliente → ⚠️ Pago MP (NO vinculado automáticamente)
                          ↓
6. Webhook → ⚠️ Actualiza payment (TODO a plataforma)
                          ↓
7. Sistema → ⚠️ FALTA notificación email al profesional
             ✅ Booking → WAITING
                          ↓
8. Profesional → ✅ Acepta solicitud
                          ↓
9. Sistema → ✅ Booking → ACTIVE (timer 18 min)
                          ↓
10. Ambos → ✅ Videollamada Jitsi
            ❌ Chat NO disponible
                          ↓
11. Auto → ✅ Finaliza después de 18 min
                          ↓
12. Cliente → ✅ Puede dejar review
```

---

## 📝 Checklist de Implementación Faltante

### Para completar el flujo mínimo viable:

- [ ] **Agregar campos MP a ProfessionalProfile**
  - [ ] Migración de BD
  - [ ] Actualizar schema Prisma
  - [ ] DTO de actualización

- [ ] **Endpoint de configuración MP**
  - [ ] PUT /professionals/:id/mercadopago
  - [ ] Validación de credenciales
  - [ ] Encriptación de tokens

- [ ] **Modificar flujo de pago**
  - [ ] Recibir bookingId en endpoint
  - [ ] Vincular payment con booking
  - [ ] Callback al aprobar pago

- [ ] **Configurar pago a plataforma**
  - [ ] Remover split payments
  - [ ] 100% a cuenta plataforma
  - [ ] Metadata para tracking

- [ ] **Notificaciones**
  - [ ] Email al profesional
  - [ ] Notificación in-app
  - [ ] Link a panel de solicitudes

- [ ] **Decisión sobre chat**
  - [ ] Definir approach
  - [ ] Implementar solución elegida

---

## ✅ Lo que SÍ está funcionando bien

1. ✅ Autenticación y autorización completa
2. ✅ Sistema de roles (CLIENT/PROFESSIONAL)
3. ✅ Perfiles profesionales con búsqueda
4. ✅ Sistema de bookings con estados
5. ✅ Integración MercadoPago (base)
6. ✅ Webhooks de pago
7. ✅ Videollamadas Jitsi completas
8. ✅ Timer de 18 minutos automático
9. ✅ Sistema de reviews
10. ✅ Base de datos bien diseñada

---

**Fecha de análisis:** 7 de octubre de 2025  
**Analizado por:** GitHub Copilot  
**Próxima acción:** Decisión del usuario sobre prioridades
