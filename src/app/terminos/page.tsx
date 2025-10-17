import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Lee nuestros términos y condiciones de uso de la plataforma.",
};

export default function TerminosPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Términos y Condiciones</h1>
      <p className="text-muted-foreground mb-8">
        Última actualización: Octubre 2025
      </p>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            1. Aceptación de los Términos
          </h2>
          <p className="text-muted-foreground">
            Al acceder y usar la plataforma Profesional, aceptas estar sujeto a
            estos términos y condiciones. Si no estás de acuerdo con alguna
            parte de estos términos, no debes usar nuestra plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            2. Descripción del Servicio
          </h2>
          <p className="text-muted-foreground">
            Profesional es una plataforma que conecta a clientes con
            profesionales verificados para la prestación de diversos servicios.
            Actuamos como intermediarios y facilitadores de la conexión, pero no
            somos responsables directos de la calidad de los servicios
            prestados.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            3. Registro y Cuenta de Usuario
          </h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              Para usar ciertos servicios, debes crear una cuenta. Te
              comprometes a:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proporcionar información veraz y actualizada</li>
              <li>Mantener la seguridad de tu contraseña</li>
              <li>
                Notificarnos inmediatamente ante cualquier uso no autorizado
              </li>
              <li>
                Ser responsable de todas las actividades realizadas desde tu
                cuenta
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            4. Obligaciones de los Profesionales
          </h2>
          <div className="space-y-3 text-muted-foreground">
            <p>Los profesionales registrados deben:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Contar con las certificaciones y licencias requeridas para su
                actividad
              </li>
              <li>
                Mantener actualizada su información profesional y disponibilidad
              </li>
              <li>Cumplir con los servicios contratados según lo acordado</li>
              <li>Respetar los estándares de calidad y profesionalismo</li>
              <li>Pagar las comisiones acordadas por servicios completados</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            5. Obligaciones de los Clientes
          </h2>
          <div className="space-y-3 text-muted-foreground">
            <p>Los clientes deben:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Proporcionar información precisa sobre el servicio requerido
              </li>
              <li>Respetar los horarios acordados</li>
              <li>
                Permitir al profesional realizar su trabajo en condiciones
                adecuadas
              </li>
              <li>Pagar el monto acordado por los servicios</li>
              <li>Tratar a los profesionales con respeto</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Pagos y Comisiones</h2>
          <p className="text-muted-foreground">
            Los pagos se procesan de forma segura a través de nuestra
            plataforma. Aplicamos una comisión sobre cada transacción
            completada, según el plan del profesional. Los reembolsos están
            sujetos a nuestra política de cancelación.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            7. Política de Cancelación
          </h2>
          <div className="space-y-3 text-muted-foreground">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Cancelación con más de 24h de anticipación: reembolso completo
              </li>
              <li>Cancelación entre 12-24h: reembolso del 50%</li>
              <li>Cancelación con menos de 12h: sin reembolso</li>
              <li>
                Cancelaciones del profesional: reembolso completo automático
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            8. Propiedad Intelectual
          </h2>
          <p className="text-muted-foreground">
            Todo el contenido de la plataforma, incluyendo diseño, logos, texto
            e imágenes, es propiedad de Profesional y está protegido por las
            leyes de propiedad intelectual.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            9. Limitación de Responsabilidad
          </h2>
          <p className="text-muted-foreground">
            Profesional no se hace responsable de daños directos, indirectos o
            consecuentes derivados del uso de la plataforma o de los servicios
            prestados por los profesionales. Nuestra responsabilidad se limita
            al monto pagado por el servicio en cuestión.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            10. Suspensión y Terminación
          </h2>
          <p className="text-muted-foreground">
            Nos reservamos el derecho de suspender o terminar cuentas que violen
            estos términos, sin previo aviso. Los usuarios también pueden
            cancelar su cuenta en cualquier momento desde su panel de
            configuración.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">11. Modificaciones</h2>
          <p className="text-muted-foreground">
            Podemos modificar estos términos en cualquier momento. Los cambios
            importantes serán notificados por email. El uso continuado de la
            plataforma después de los cambios constituye la aceptación de los
            nuevos términos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">12. Ley Aplicable</h2>
          <p className="text-muted-foreground">
            Estos términos se rigen por las leyes de la República Argentina.
            Cualquier disputa será resuelta en los tribunales competentes de
            Buenos Aires.
          </p>
        </section>

        <section className="bg-muted p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Contacto</h2>
          <p className="text-muted-foreground">
            Si tienes preguntas sobre estos términos, contáctanos en:
            <br />
            Email: legal@profesional.com
            <br />
            Teléfono: +54 11 1234-5678
          </p>
        </section>
      </div>
    </div>
  );
}
