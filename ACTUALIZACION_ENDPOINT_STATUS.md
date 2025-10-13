# 🔄 Actualización - Nuevo Endpoint de Status

## ✅ Cambio Realizado

Actualizamos la API para usar el nuevo endpoint de tu backend:

### Antes ❌

```
GET /api/payments/payment/{id}
```

### Ahora ✅

```
GET /api/payments/status?payment_id=XXX&external_reference=YYY
```

## 🔧 Cambios en el Código

### 1. `/src/lib/api/payments.ts`

**Antes:**

```typescript
async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
  const response = await apiClient.get<PaymentStatusResponse>(
    `/payments/payment/${paymentId}`
  );
  return response.data;
}
```

**Ahora:**

```typescript
async getPaymentStatus(
  paymentId: string,
  externalReference?: string
): Promise<PaymentStatusResponse> {
  const params = new URLSearchParams();
  params.append("payment_id", paymentId);

  if (externalReference) {
    params.append("external_reference", externalReference);
  }

  const response = await apiClient.get<PaymentStatusResponse>(
    `/payments/status?${params.toString()}`
  );
  return response.data;
}
```

### 2. `/src/app/profesionales/[slug]/pago/exito/page.tsx`

**Agregado:**

```typescript
// Extraer external_reference de la URL
const externalReference = searchParams.get("external_reference");

// Pasar ambos parámetros al consultar
const response = await paymentsAPI.getPaymentStatus(
  mpPaymentId,
  externalReference || undefined
);
```

## 🎯 Ventajas del Nuevo Endpoint

| Aspecto                  | Ventaja                                               |
| ------------------------ | ----------------------------------------------------- |
| **Búsqueda más precisa** | Usa tanto payment_id como booking_id                  |
| **Más flexible**         | Puede buscar por cualquiera de los dos                |
| **Menos ambigüedad**     | external_reference asegura que es el booking correcto |
| **Mejor para retry**     | Más fácil encontrar el pago si uno de los IDs falla   |

## 📊 Ejemplo Real

### URL que recibe MP:

```
http://localhost:3000/profesionales/juan-perez/pago/exito?
  collection_id=129746963794&
  collection_status=approved&
  payment_id=129746963794&
  status=approved&
  external_reference=cmgp6ovv2000414gb0goix501&
  payment_type=credit_card&
  merchant_order_id=34732437138&
  preference_id=2642663435-6f1c68e9-330f-4480-a5b1-2cb04a227da8&
  site_id=MLA&
  processing_mode=aggregator&
  merchant_account_id=null
```

### Request que hace el frontend:

```
GET /api/payments/status?payment_id=129746963794&external_reference=cmgp6ovv2000414gb0goix501
```

### Response esperada:

```json
{
  "success": true,
  "data": {
    "id": "payment_internal_id",
    "provider": "MERCADOPAGO",
    "paymentId": "129746963794",
    "status": "COMPLETED",
    "amount": 25000,
    "booking": {
      "id": "cmgp6ovv2000414gb0goix501",
      "title": "Consulta Psicológica",
      "scheduledAt": "2025-10-15T14:00:00Z",
      "professional": {
        "slug": "juan-perez",
        "user": {
          "name": "Juan Pérez"
        }
      },
      "client": {
        "user": {
          "name": "María García"
        }
      }
    }
  }
}
```

## 🔍 Lógica de Búsqueda en el Backend

Tu endpoint `/payments/status` debería:

1. **Buscar primero por payment_id**:

   ```sql
   SELECT * FROM Payment WHERE paymentId = ?
   ```

2. **Si no encuentra, buscar por external_reference**:

   ```sql
   SELECT * FROM Payment
   JOIN Booking ON Payment.bookingId = Booking.id
   WHERE Booking.id = ?
   ```

3. **Si encuentra ambos, validar que coincidan**:
   ```javascript
   if (payment && externalReference) {
     if (payment.booking.id !== externalReference) {
       throw new Error("Payment ID y Booking ID no coinciden");
     }
   }
   ```

## 🧪 Testing

### Test 1: Solo payment_id

```typescript
const response = await paymentsAPI.getPaymentStatus("129746963794");
// Debería funcionar si el pago existe
```

### Test 2: Con ambos parámetros

```typescript
const response = await paymentsAPI.getPaymentStatus(
  "129746963794",
  "cmgp6ovv2000414gb0goix501"
);
// Más preciso, mejor opción
```

### Test 3: Solo external_reference (si tu backend lo soporta)

```typescript
const response = await paymentsAPI.getPaymentStatus(
  "",
  "cmgp6ovv2000414gb0goix501"
);
// Útil si payment_id no llega en la URL
```

## ✅ Compatibilidad

El cambio es **backward compatible** si tu backend soporta:

- Buscar solo por `payment_id` (requerido)
- Buscar por ambos `payment_id` + `external_reference` (opcional pero recomendado)

## 🎯 Próximos Pasos

1. ✅ Código frontend actualizado
2. ✅ Documentación actualizada
3. ⚠️ Verificar que tu endpoint `/payments/status` funcione con estos query params
4. 🧪 Probar el flujo completo en sandbox
5. 🚀 Deploy a producción

## 📝 Notas Importantes

- **external_reference es opcional**: El sistema funciona solo con payment_id
- **Mejor con ambos**: Usar ambos parámetros da más precisión
- **URL params**: Se construyen automáticamente con URLSearchParams
- **Sin breaking changes**: Si external_reference no está disponible, funciona igual

---

**Resultado**: Sistema más robusto y flexible para consultar pagos 🎉
