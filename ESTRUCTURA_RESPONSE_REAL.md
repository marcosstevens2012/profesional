# 📋 Estructura Real de la Respuesta del Backend

## ✅ Response Actualizada

Basado en la respuesta real de tu API `/payments/status`:

```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "cmgpfkmnn0002pl205u7n9jh4",
      "status": "PENDING",
      "amount": "45000",
      "currency": "ARS",
      "paymentId": null,
      "preferenceId": "2642663435-88f250b4-d74e-44a4-92cb-fd8a6e6e6bc8",
      "paidAt": null,
      "createdAt": "2025-10-13T17:52:18.611Z"
    },
    "booking": {
      "id": "cmgpfkl520001pl20j1x6con9",
      "scheduledAt": "2025-10-14T17:52:15.781Z",
      "duration": 60,
      "status": "PENDING_PAYMENT",
      "jitsiRoom": "uf1fgtcm-8bfe755a",
      "meetingStatus": "PENDING",
      "professional": {
        "id": "cmgfrv34k001ryy32uf1fgtcm",
        "name": "Dr. Javier Silva",
        "email": "dr.silva@cardiologia.com"
      },
      "client": {
        "id": "cmgfrv2ak0012yy32xkj49oyx",
        "name": "Pedro Gómez",
        "email": "cliente1@email.com"
      }
    }
  }
}
```

## 🔧 Cambios Realizados

### 1. Interface TypeScript Actualizada

```typescript
export interface PaymentStatusResponse {
  success: boolean;
  data: {
    payment: {
      id: string;
      status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
      amount: string; // ⚠️ Viene como STRING, no como número
      currency: string;
      paymentId: string | null; // ⚠️ Puede ser null si aún no hay pago
      preferenceId: string;
      paidAt: string | null;
      createdAt: string;
    };
    booking: {
      id: string;
      scheduledAt: string;
      duration: number;
      status: string;
      jitsiRoom: string;
      meetingStatus: string;
      professional: {
        id: string;
        name: string; // ⚠️ Directo, no anidado en "user"
        email: string;
      };
      client: {
        id: string;
        name: string; // ⚠️ Directo, no anidado en "user"
        email: string;
      };
    };
  };
}
```

### 2. Código Actualizado en `exito/page.tsx`

```typescript
// ANTES ❌
const { data } = response;
if (data.status === "COMPLETED") {
  setBookingDetails({
    id: data.booking.id,
    title: data.booking.title, // ❌ No existe
    professional: {
      name: data.booking.professional.user.name, // ❌ No existe "user"
      slug: data.booking.professional.slug, // ❌ No existe "slug"
    },
  });
}

// AHORA ✅
const { payment, booking } = response.data;
if (payment.status === "COMPLETED") {
  setBookingDetails({
    id: booking.id,
    title: `Consulta con ${booking.professional.name}`, // ✅ Construido
    professional: {
      name: booking.professional.name, // ✅ Directo
      slug: params.slug, // ✅ De la URL
    },
    payment: {
      amount: parseFloat(payment.amount), // ✅ Convertir string a number
    },
  });
}
```

## 📊 Diferencias Clave

| Campo                 | Antes (esperado)                      | Ahora (real)                       |
| --------------------- | ------------------------------------- | ---------------------------------- |
| **Estructura**        | `data.status`                         | `data.payment.status`              |
| **Amount**            | `number`                              | `string` → requiere `parseFloat()` |
| **Professional**      | `data.booking.professional.user.name` | `data.booking.professional.name`   |
| **Client**            | `data.booking.client.user.name`       | `data.booking.client.name`         |
| **Title**             | `data.booking.title`                  | ❌ No existe                       |
| **Professional Slug** | `data.booking.professional.slug`      | ❌ No existe                       |
| **PaymentId**         | Siempre presente                      | `null` si aún no se procesó        |

## 🎯 Campos Importantes

### Payment Object

- **id**: ID interno del pago en tu base de datos
- **status**: Estado del pago (`PENDING`, `COMPLETED`, `FAILED`, `CANCELLED`)
- **amount**: Monto como STRING (ej: `"45000"`)
- **paymentId**: ID de MercadoPago (puede ser `null` si aún no se procesó)
- **preferenceId**: ID de la preferencia de MP
- **paidAt**: Timestamp del pago (`null` si aún no se pagó)

### Booking Object

- **id**: ID del booking
- **scheduledAt**: Fecha/hora de la consulta
- **duration**: Duración en minutos
- **status**: Estado del booking (`PENDING_PAYMENT`, `CONFIRMED`, etc.)
- **jitsiRoom**: ID de la sala de Jitsi
- **professional**: Datos del profesional (directo, sin nested `user`)
- **client**: Datos del cliente (directo, sin nested `user`)

## 🔄 Mapeo de Estados

### Estados del Payment

```typescript
payment.status === "PENDING"    → Mostrar retry o redirigir a /pendiente
payment.status === "COMPLETED"  → Mostrar confirmación ✅
payment.status === "FAILED"     → Redirigir a /error
payment.status === "CANCELLED"  → Redirigir a /error
```

### Estados del Booking (información)

```typescript
booking.status === "PENDING_PAYMENT" → Esperando pago
booking.status === "CONFIRMED"       → Reserva confirmada
booking.meetingStatus === "PENDING"  → Reunión pendiente
```

## 💡 Notas Importantes

### 1. Amount es String

```typescript
// ❌ NO hagas esto
const total = payment.amount + 100; // Concatenación de strings!

// ✅ SÍ haz esto
const total = parseFloat(payment.amount) + 100;
```

### 2. PaymentId puede ser null

```typescript
// Cuando el pago está PENDING y el webhook aún no procesó
payment.paymentId === null; // ⚠️ Normal en estados tempranos

// Cuando el pago está COMPLETED, debería tener valor
payment.paymentId === "129746963794"; // ✅ Del webhook de MP
```

### 3. No hay "title" en booking

```typescript
// Construir dinámicamente
const title = `Consulta con ${booking.professional.name}`;
// O usar un genérico
const title = "Consulta Profesional";
```

### 4. No hay "slug" en professional

```typescript
// Usar el slug de la URL actual
professional: {
  name: booking.professional.name,
  slug: params.slug, // De la ruta actual
}
```

## 🧪 Ejemplo de Uso

```typescript
const response = await paymentsAPI.getPaymentStatus(
  "129746963794",
  "cmgpfkl520001pl20j1x6con9"
);

if (response.success) {
  const { payment, booking } = response.data;

  console.log("Estado del pago:", payment.status);
  console.log("Monto:", parseFloat(payment.amount));
  console.log("Profesional:", booking.professional.name);
  console.log("Cliente:", booking.client.name);
  console.log("Fecha consulta:", booking.scheduledAt);

  if (payment.status === "COMPLETED") {
    // Mostrar confirmación
    showSuccessPage({
      amount: parseFloat(payment.amount),
      professionalName: booking.professional.name,
      scheduledAt: booking.scheduledAt,
    });
  } else if (payment.status === "PENDING") {
    // Esperar o redirigir
    if (retryCount < 3) {
      retry();
    } else {
      redirectToPending();
    }
  }
}
```

## ✅ Validación de la Respuesta

```typescript
function validatePaymentResponse(response: any): boolean {
  if (!response.success) return false;
  if (!response.data) return false;
  if (!response.data.payment) return false;
  if (!response.data.booking) return false;

  const { payment, booking } = response.data;

  // Validar campos requeridos
  if (!payment.id || !payment.status || !payment.amount) return false;
  if (!booking.id || !booking.scheduledAt) return false;
  if (!booking.professional?.name) return false;
  if (!booking.client?.name) return false;

  return true;
}
```

## 🎯 Resumen de Cambios

✅ **Interface actualizada** según respuesta real  
✅ **Código adaptado** para usar `payment` y `booking` separados  
✅ **Amount parseado** de string a number  
✅ **Professional.name y client.name** accedidos directamente  
✅ **Title construido** dinámicamente  
✅ **Slug tomado** de params de la URL

---

**¡El sistema ahora maneja correctamente la estructura real de tu API!** 🎉
