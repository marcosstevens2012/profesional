# ✅ Checklist de Verificación - Integración MercadoPago

## 🔍 Verificaciones Inmediatas (Ahora)

### Frontend

- [x] Páginas creadas: `/profesionales/[slug]/pago/exito`
- [x] Páginas creadas: `/profesionales/[slug]/pago/pendiente`
- [x] Páginas creadas: `/profesionales/[slug]/pago/error`
- [x] API actualizada con `getPaymentStatus()`
- [x] Interfaces TypeScript completas
- [x] Manejo de errores implementado
- [x] Redirección automática según estados
- [ ] Sin errores de TypeScript ✅ (verificado)

### Backend a Verificar

- [ ] Endpoint `GET /payments/payment/{id}` existe y funciona
- [ ] Retorna todos los campos según `PaymentStatusResponse`
- [ ] Incluye datos del booking completos
- [ ] Incluye datos del profesional y cliente

## 🔔 Webhook de MercadoPago (CRÍTICO)

### Configuración

- [ ] Webhook configurado en MercadoPago Dashboard
- [ ] URL del webhook: `https://tudominio.com/api/payments/webhook`
- [ ] Eventos suscritos: `payment.created`, `payment.updated`
- [ ] Webhook funcionando en sandbox
- [ ] Webhook funcionando en producción

### Funcionalidad del Webhook

- [ ] Verifica la firma/seguridad de MP
- [ ] Obtiene datos completos del pago desde MP API
- [ ] Busca el booking por `external_reference`
- [ ] Actualiza booking status a `CONFIRMED`
- [ ] Crea/actualiza registro de Payment
- [ ] Guarda `paidAt` timestamp
- [ ] Es idempotente (no procesa duplicados)
- [ ] Envía email de confirmación al cliente
- [ ] Envía notificación al profesional
- [ ] Loguea todas las transacciones
- [ ] Maneja errores correctamente

## 🔗 URLs de Retorno en MP

### Al crear la preferencia

- [ ] `back_urls.success` configurada: `/profesionales/{slug}/pago/exito`
- [ ] `back_urls.pending` configurada: `/profesionales/{slug}/pago/pendiente`
- [ ] `back_urls.failure` configurada: `/profesionales/{slug}/pago/error`
- [ ] `auto_return` activado
- [ ] `{slug}` se reemplaza dinámicamente con el slug real

### Ejemplo de código backend:

```typescript
const preference = {
  items: [
    {
      /* ... */
    },
  ],
  back_urls: {
    success: `${FRONTEND_URL}/profesionales/${professionalSlug}/pago/exito`,
    failure: `${FRONTEND_URL}/profesionales/${professionalSlug}/pago/error`,
    pending: `${FRONTEND_URL}/profesionales/${professionalSlug}/pago/pendiente`,
  },
  auto_return: "approved",
  external_reference: bookingId,
  // ...
};
```

## 🧪 Testing en Sandbox

### Configuración Sandbox

- [ ] Credenciales de sandbox configuradas
- [ ] Access token de sandbox en variables de entorno
- [ ] Webhook apunta a URL de desarrollo (usar ngrok/tunnel)

### Casos de Prueba

#### ✅ Caso 1: Pago Exitoso

- [ ] Crear preferencia de pago
- [ ] Completar pago con tarjeta de prueba aprobada
- [ ] Webhook recibe notificación
- [ ] Backend actualiza booking a CONFIRMED
- [ ] MP redirige a `/pago/exito`
- [ ] Frontend muestra detalles correctos
- [ ] Email enviado al cliente
- [ ] Notificación creada

#### ⏳ Caso 2: Pago Pendiente

- [ ] Completar pago con método pendiente (ej: boleto)
- [ ] Webhook recibe notificación con status pending
- [ ] Backend mantiene booking en PENDING_PAYMENT
- [ ] MP redirige a `/pago/pendiente`
- [ ] Frontend muestra mensaje correcto

#### ❌ Caso 3: Pago Rechazado

- [ ] Completar pago con tarjeta rechazada
- [ ] Webhook recibe notificación de fallo
- [ ] Backend mantiene booking sin confirmar
- [ ] MP redirige a `/pago/error`
- [ ] Frontend muestra opciones de reintento

#### 🔄 Caso 4: Webhook Antes de Redirect

- [ ] Completar pago normalmente
- [ ] Webhook procesa antes que user llegue a frontend
- [ ] Frontend consulta estado y ve COMPLETED
- [ ] Muestra confirmación correcta

#### 🔄 Caso 5: Redirect Antes de Webhook

- [ ] Completar pago (simular webhook lento)
- [ ] User llega a `/pago/exito` primero
- [ ] Frontend consulta estado y ve PENDING
- [ ] Redirige automáticamente a `/pago/pendiente`
- [ ] Cuando webhook complete, user puede refrescar

## 📧 Emails y Notificaciones

### Email de Confirmación

- [ ] Email se envía al cliente
- [ ] Incluye detalles de la consulta
- [ ] Incluye fecha y hora
- [ ] Incluye nombre del profesional
- [ ] Incluye instrucciones de conexión
- [ ] Tiene diseño responsive

### Notificaciones In-App

- [ ] Notificación creada para el cliente
- [ ] Notificación creada para el profesional
- [ ] Aparecen en el NotificationBell
- [ ] Tienen enlaces correctos

## 🔐 Seguridad

- [ ] No se confía en parámetros del frontend
- [ ] Solo el backend puede marcar pagos como completados
- [ ] Webhook valida requests de MP
- [ ] IDs de pago se validan contra la base de datos
- [ ] No se exponen datos sensibles en URLs
- [ ] Logs no incluyen información sensible
- [ ] Rate limiting en endpoints públicos

## 📊 Logs y Monitoreo

- [ ] Logs de cada notificación de webhook
- [ ] Logs de cada consulta de estado
- [ ] Logs de emails enviados
- [ ] Alertas si webhook falla
- [ ] Métricas de pagos completados
- [ ] Métricas de tiempos de respuesta

## 🚀 Producción

### Antes de Lanzar

- [ ] Webhook configurado en MP producción
- [ ] Access token de producción configurado
- [ ] URLs de retorno apuntan al dominio real
- [ ] Certificado SSL válido (requerido por MP)
- [ ] Testing completo en sandbox pasó
- [ ] Documentación actualizada
- [ ] Equipo capacitado en el flujo

### Monitoreo Post-Lanzamiento

- [ ] Monitorear logs de webhook por 24-48h
- [ ] Verificar que todos los pagos se procesen
- [ ] Verificar que emails se envíen
- [ ] Verificar que no haya errores 500
- [ ] Verificar tiempos de respuesta
- [ ] Hacer pagos de prueba reales

## 🐛 Debugging

Si algo no funciona:

### Webhook no llega

1. Verificar URL en MP dashboard
2. Verificar que el servidor sea accesible públicamente
3. Verificar logs del servidor
4. Usar ngrok para desarrollo local
5. Verificar que MP tenga la URL correcta

### Frontend no muestra datos

1. Verificar en Network tab el request a `/payments/payment/{id}`
2. Verificar response del backend
3. Verificar que payment_id esté en URL
4. Verificar estructura de datos en PaymentStatusResponse
5. Ver console.log de errores

### Pago procesado pero booking no se actualiza

1. Verificar logs del webhook
2. Verificar que external_reference sea correcto
3. Verificar que booking exista en BD
4. Verificar errores en logs del backend
5. Verificar idempotencia del webhook

---

## 📞 Contactos en Caso de Problemas

- **MercadoPago Soporte**: [developers.mercadopago.com](https://developers.mercadopago.com)
- **Docs del Webhook**: [Webhooks MP](https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks)
- **Sandbox**: [Dashboard Sandbox](https://www.mercadopago.com.ar/developers/panel/app)

---

**Última actualización**: {{ date }}
**Estado actual**: ✅ Frontend completo | ⚠️ Backend por verificar
