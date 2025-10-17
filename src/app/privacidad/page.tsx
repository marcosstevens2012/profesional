import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Conoce cómo protegemos y utilizamos tu información personal.",
};

export default function PrivacidadPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Política de Privacidad</h1>
      <p className="text-muted-foreground mb-8">
        Última actualización: Octubre 2025
      </p>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Introducción</h2>
          <p className="text-muted-foreground">
            En Profesional, nos tomamos muy en serio la privacidad de nuestros
            usuarios. Esta política describe qué información recopilamos, cómo
            la usamos y qué derechos tienes sobre tus datos personales.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            2. Información que Recopilamos
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                2.1 Información que proporcionas
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nombre completo y datos de contacto (email, teléfono)</li>
                <li>
                  Información de perfil (foto, descripción, especialidades)
                </li>
                <li>Información de pago y facturación</li>
                <li>
                  Documentación profesional (para profesionales verificados)
                </li>
                <li>Comunicaciones y reseñas</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                2.2 Información recopilada automáticamente
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Datos de uso de la plataforma</li>
                <li>Dirección IP y ubicación aproximada</li>
                <li>Tipo de dispositivo y navegador</li>
                <li>Cookies y tecnologías similares</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            3. Cómo Usamos tu Información
          </h2>
          <div className="space-y-3 text-muted-foreground">
            <p>Utilizamos la información recopilada para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Facilitar las conexiones entre clientes y profesionales</li>
              <li>Procesar pagos y transacciones</li>
              <li>
                Verificar la identidad y credenciales de los profesionales
              </li>
              <li>Mejorar nuestros servicios y experiencia de usuario</li>
              <li>
                Enviar notificaciones importantes sobre reservas y servicios
              </li>
              <li>Prevenir fraude y garantizar la seguridad</li>
              <li>Cumplir con obligaciones legales</li>
              <li>Comunicar ofertas y novedades (con tu consentimiento)</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            4. Compartir Información
          </h2>
          <div className="space-y-3 text-muted-foreground">
            <p>Podemos compartir tu información con:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Profesionales/Clientes:</strong> Información necesaria
                para completar el servicio (nombre, contacto, detalles del
                servicio)
              </li>
              <li>
                <strong>Procesadores de pago:</strong> Información necesaria
                para procesar transacciones de forma segura
              </li>
              <li>
                <strong>Proveedores de servicios:</strong> Empresas que nos
                ayudan a operar la plataforma (hosting, analytics, soporte)
              </li>
              <li>
                <strong>Autoridades:</strong> Cuando sea requerido por ley o
                para proteger nuestros derechos
              </li>
            </ul>
            <p className="mt-3">
              Nunca vendemos tu información personal a terceros.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            5. Seguridad de los Datos
          </h2>
          <p className="text-muted-foreground">
            Implementamos medidas de seguridad técnicas y organizativas para
            proteger tu información, incluyendo:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
            <li>Encriptación SSL/TLS para todas las comunicaciones</li>
            <li>Almacenamiento seguro de datos en servidores protegidos</li>
            <li>Acceso restringido a información personal</li>
            <li>Auditorías de seguridad regulares</li>
            <li>Protocolos de respuesta ante incidentes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Tus Derechos</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>Tienes derecho a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Acceder:</strong> Solicitar una copia de tus datos
                personales
              </li>
              <li>
                <strong>Rectificar:</strong> Corregir información inexacta o
                incompleta
              </li>
              <li>
                <strong>Eliminar:</strong> Solicitar la eliminación de tus datos
              </li>
              <li>
                <strong>Portabilidad:</strong> Recibir tus datos en formato
                estructurado
              </li>
              <li>
                <strong>Oponerte:</strong> Rechazar ciertos usos de tu
                información
              </li>
              <li>
                <strong>Retirar consentimiento:</strong> Para comunicaciones de
                marketing
              </li>
            </ul>
            <p className="mt-3">
              Para ejercer estos derechos, contáctanos en
              privacidad@profesional.com
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Retención de Datos</h2>
          <p className="text-muted-foreground">
            Conservamos tu información personal solo durante el tiempo necesario
            para cumplir con los propósitos descritos en esta política, salvo
            que la ley requiera un período de retención más largo. Los datos de
            transacciones se conservan según las obligaciones fiscales y
            legales.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Cookies</h2>
          <p className="text-muted-foreground">
            Utilizamos cookies y tecnologías similares para mejorar tu
            experiencia. Puedes controlar el uso de cookies a través de la
            configuración de tu navegador. Para más información, consulta
            nuestra{" "}
            <a href="/cookies" className="text-primary hover:underline">
              Política de Cookies
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Menores de Edad</h2>
          <p className="text-muted-foreground">
            Nuestros servicios no están dirigidos a menores de 18 años. No
            recopilamos intencionalmente información de menores. Si descubrimos
            que hemos recopilado datos de un menor, los eliminaremos de
            inmediato.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            10. Transferencias Internacionales
          </h2>
          <p className="text-muted-foreground">
            Tus datos pueden ser transferidos y procesados en países fuera de
            Argentina. En estos casos, garantizamos que se apliquen las
            protecciones adecuadas conforme a las leyes de protección de datos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            11. Cambios a esta Política
          </h2>
          <p className="text-muted-foreground">
            Podemos actualizar esta política periódicamente. Te notificaremos
            sobre cambios significativos por email o mediante un aviso destacado
            en la plataforma. La fecha de última actualización siempre aparece
            al inicio del documento.
          </p>
        </section>

        <section className="bg-muted p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">12. Contacto</h2>
          <p className="text-muted-foreground">
            Si tienes preguntas sobre esta política de privacidad o quieres
            ejercer tus derechos, contáctanos:
            <br />
            <br />
            <strong>Email:</strong> privacidad@profesional.com
            <br />
            <strong>Teléfono:</strong> +54 11 1234-5678
            <br />
            <strong>Dirección:</strong> Buenos Aires, Argentina
          </p>
        </section>
      </div>
    </div>
  );
}
