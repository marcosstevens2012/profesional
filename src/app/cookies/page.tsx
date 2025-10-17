import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description:
    "Información sobre cómo utilizamos cookies en nuestra plataforma.",
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Política de Cookies</h1>
      <p className="text-muted-foreground mb-8">
        Última actualización: Octubre 2025
      </p>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            1. ¿Qué son las Cookies?
          </h2>
          <p className="text-muted-foreground">
            Las cookies son pequeños archivos de texto que se almacenan en tu
            dispositivo cuando visitas un sitio web. Se utilizan ampliamente
            para hacer que los sitios web funcionen de manera más eficiente, así
            como para proporcionar información a los propietarios del sitio.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            2. ¿Cómo Usamos las Cookies?
          </h2>
          <p className="text-muted-foreground mb-4">
            Utilizamos cookies para diferentes propósitos:
          </p>

          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold text-lg mb-3">
                Cookies Estrictamente Necesarias
              </h3>
              <p className="text-muted-foreground mb-2">
                Estas cookies son esenciales para el funcionamiento del sitio
                web. Sin ellas, no podrías usar funciones básicas como iniciar
                sesión o gestionar reservas.
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Autenticación de usuario</li>
                <li>Seguridad de la sesión</li>
                <li>Preferencias de idioma</li>
                <li>Carrito de compras</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">
                <strong>Duración:</strong> Sesión o hasta 1 año
                <br />
                <strong>Puede desactivarse:</strong> No
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold text-lg mb-3">
                Cookies de Rendimiento
              </h3>
              <p className="text-muted-foreground mb-2">
                Nos ayudan a entender cómo los visitantes interactúan con
                nuestro sitio, recopilando información de forma anónima.
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Análisis de tráfico web (Google Analytics)</li>
                <li>Páginas visitadas y tiempo de permanencia</li>
                <li>Rutas de navegación</li>
                <li>Errores encontrados</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">
                <strong>Duración:</strong> Hasta 2 años
                <br />
                <strong>Puede desactivarse:</strong> Sí
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold text-lg mb-3">
                Cookies Funcionales
              </h3>
              <p className="text-muted-foreground mb-2">
                Permiten que el sitio web recuerde las elecciones que haces para
                proporcionar funciones mejoradas y más personalizadas.
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Preferencias de tema (claro/oscuro)</li>
                <li>Recordar datos de formularios</li>
                <li>Ubicación geográfica</li>
                <li>Ajustes de visualización</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">
                <strong>Duración:</strong> Hasta 1 año
                <br />
                <strong>Puede desactivarse:</strong> Sí
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold text-lg mb-3">
                Cookies de Marketing
              </h3>
              <p className="text-muted-foreground mb-2">
                Se utilizan para rastrear visitantes en sitios web con el fin de
                mostrar anuncios relevantes y atractivos.
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Publicidad personalizada</li>
                <li>Remarketing</li>
                <li>Medición de campañas</li>
                <li>Redes sociales (Facebook, Instagram)</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">
                <strong>Duración:</strong> Hasta 2 años
                <br />
                <strong>Puede desactivarse:</strong> Sí
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            3. Cookies de Terceros
          </h2>
          <p className="text-muted-foreground mb-3">
            Algunos servicios de terceros pueden establecer sus propias cookies
            a través de nuestro sitio:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              <strong>Google Analytics:</strong> Para análisis de tráfico y
              comportamiento
            </li>
            <li>
              <strong>Procesadores de pago:</strong> Para transacciones seguras
            </li>
            <li>
              <strong>Redes sociales:</strong> Para compartir contenido y
              funciones sociales
            </li>
            <li>
              <strong>Servicios de mapas:</strong> Para mostrar ubicaciones
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            4. Cómo Controlar las Cookies
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                A través de tu navegador
              </h3>
              <p>
                La mayoría de los navegadores permiten controlar cookies a
                través de sus configuraciones. Puedes configurar tu navegador
                para:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Rechazar todas las cookies</li>
                <li>Permitir solo cookies de origen (first-party)</li>
                <li>Eliminar cookies al cerrar el navegador</li>
                <li>Recibir una notificación antes de aceptar una cookie</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="font-semibold mb-2">
                Enlaces para gestionar cookies:
              </p>
              <ul className="space-y-1">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan-en-"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Microsoft Edge
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                A través de nuestra plataforma
              </h3>
              <p>
                Puedes gestionar tus preferencias de cookies en cualquier
                momento haciendo clic en el botón &quot;Configuración de
                Cookies&quot; en el pie de página.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            5. Consecuencias de Desactivar Cookies
          </h2>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-6 rounded-lg">
            <p className="text-muted-foreground">
              Si desactivas las cookies, algunas funciones del sitio pueden no
              funcionar correctamente:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground mt-3">
              <li>No podrás mantener tu sesión iniciada</li>
              <li>Algunas páginas pueden no cargar correctamente</li>
              <li>Las preferencias no se guardarán</li>
              <li>La experiencia de usuario será menos personalizada</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            6. Actualización de Esta Política
          </h2>
          <p className="text-muted-foreground">
            Podemos actualizar esta Política de Cookies ocasionalmente para
            reflejar cambios en las cookies que utilizamos o por razones
            operativas, legales o regulatorias. Te recomendamos revisar esta
            página periódicamente.
          </p>
        </section>

        <section className="bg-muted p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">7. Más Información</h2>
          <p className="text-muted-foreground">
            Si tienes preguntas sobre cómo utilizamos las cookies, contáctanos:
            <br />
            <br />
            <strong>Email:</strong> privacidad@profesional.com
            <br />
            <strong>Consulta también:</strong>
          </p>
          <ul className="space-y-1 mt-3">
            <li>
              <a href="/privacidad" className="text-primary hover:underline">
                Política de Privacidad
              </a>
            </li>
            <li>
              <a href="/terminos" className="text-primary hover:underline">
                Términos y Condiciones
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
