import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Centro de Ayuda",
  description:
    "Encuentra respuestas a las preguntas más frecuentes sobre nuestra plataforma.",
};

export default function AyudaPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Centro de Ayuda</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Preguntas Frecuentes</h2>

          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">
                ¿Cómo reservo un servicio?
              </h3>
              <p className="text-muted-foreground">
                1. Busca el profesional que necesitas en la sección
                &quot;Explorar&quot;
                <br />
                2. Revisa su perfil, servicios y disponibilidad
                <br />
                3. Selecciona el servicio y fecha que prefieras
                <br />
                4. Completa el pago de forma segura
                <br />
                5. Recibirás una confirmación por email
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">
                ¿Cómo me registro como profesional?
              </h3>
              <p className="text-muted-foreground">
                Ve a la página de registro, selecciona &quot;Quiero ofrecer
                servicios&quot; y completa el proceso de verificación con tu
                documentación profesional. Nuestro equipo revisará tu solicitud
                en 24-48 horas.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">
                ¿Los pagos son seguros?
              </h3>
              <p className="text-muted-foreground">
                Sí, utilizamos pasarelas de pago certificadas y encriptadas. Tu
                información financiera está protegida y nunca almacenamos datos
                de tarjetas de crédito.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">
                ¿Puedo cancelar una reserva?
              </h3>
              <p className="text-muted-foreground">
                Sí, puedes cancelar hasta 24 horas antes de la cita programada
                para obtener un reembolso completo. Consulta nuestra política de
                cancelación para más detalles.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">
                ¿Cómo contacto con un profesional?
              </h3>
              <p className="text-muted-foreground">
                Desde el perfil del profesional puedes enviar un mensaje directo
                para hacer consultas antes de reservar. También puedes
                contactarlo a través del chat una vez confirmada la reserva.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">
                ¿Qué hago si tengo un problema con un servicio?
              </h3>
              <p className="text-muted-foreground">
                Puedes reportar cualquier problema desde tu panel de usuario en
                la sección de reservas. Nuestro equipo de soporte lo revisará y
                tomará las medidas necesarias.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-muted p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">¿Necesitas más ayuda?</h2>
          <p className="text-muted-foreground mb-4">
            Si no encontraste la respuesta que buscabas, nuestro equipo de
            soporte está disponible para ayudarte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/contacto"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
            >
              Contactar Soporte
            </a>
            <a
              href="mailto:soporte@profesional.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-card border rounded-lg font-semibold hover:bg-accent transition"
            >
              soporte@profesional.com
            </a>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Categorías de Ayuda</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-card p-4 rounded-lg border hover:shadow-md transition cursor-pointer">
              <h3 className="font-semibold mb-2">📱 Uso de la Plataforma</h3>
              <p className="text-sm text-muted-foreground">
                Guías sobre cómo usar todas las funciones
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border hover:shadow-md transition cursor-pointer">
              <h3 className="font-semibold mb-2">💳 Pagos y Facturación</h3>
              <p className="text-sm text-muted-foreground">
                Información sobre métodos de pago y facturas
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border hover:shadow-md transition cursor-pointer">
              <h3 className="font-semibold mb-2">👤 Cuenta y Perfil</h3>
              <p className="text-sm text-muted-foreground">
                Gestiona tu cuenta y configuración
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border hover:shadow-md transition cursor-pointer">
              <h3 className="font-semibold mb-2">🔒 Seguridad</h3>
              <p className="text-sm text-muted-foreground">
                Protección de datos y privacidad
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
