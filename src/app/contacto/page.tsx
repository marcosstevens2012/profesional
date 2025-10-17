import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Ponte en contacto con nuestro equipo. Estamos aquí para ayudarte.",
};

export default function ContactoPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contáctanos</h1>
        <p className="text-xl text-muted-foreground">
          Estamos aquí para ayudarte. Envíanos tu consulta y te responderemos
          pronto.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Envíanos un Mensaje</h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium mb-2"
              >
                Asunto
              </label>
              <select
                id="subject"
                name="subject"
                className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Selecciona un asunto</option>
                <option value="soporte">Soporte Técnico</option>
                <option value="profesional">Consulta de Profesional</option>
                <option value="cliente">Consulta de Cliente</option>
                <option value="facturacion">Facturación</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium mb-2"
              >
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
            >
              Enviar Mensaje
            </button>
          </form>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Información de Contacto
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="text-primary mr-4 text-2xl">📧</div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground">
                    contacto@profesional.com
                  </p>
                  <p className="text-muted-foreground">
                    soporte@profesional.com
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-primary mr-4 text-2xl">📱</div>
                <div>
                  <h3 className="font-semibold mb-1">Teléfono</h3>
                  <p className="text-muted-foreground">+54 11 1234-5678</p>
                  <p className="text-sm text-muted-foreground">
                    Lun - Vie: 9:00 - 18:00
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-primary mr-4 text-2xl">📍</div>
                <div>
                  <h3 className="font-semibold mb-1">Oficina</h3>
                  <p className="text-muted-foreground">
                    Buenos Aires, Argentina
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-primary mr-4 text-2xl">⏰</div>
                <div>
                  <h3 className="font-semibold mb-1">Horario de Atención</h3>
                  <p className="text-muted-foreground">
                    Lunes a Viernes: 9:00 - 18:00
                  </p>
                  <p className="text-muted-foreground">
                    Sábados: 10:00 - 14:00
                  </p>
                  <p className="text-muted-foreground">Domingos: Cerrado</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Redes Sociales</h3>
            <p className="text-muted-foreground mb-4">
              Síguenos en nuestras redes para estar al día con novedades y
              consejos.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-background border rounded-lg hover:bg-accent transition"
                aria-label="Facebook"
              >
                F
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-background border rounded-lg hover:bg-accent transition"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-background border rounded-lg hover:bg-accent transition"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-background border rounded-lg hover:bg-accent transition"
                aria-label="Twitter"
              >
                X
              </a>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-3">¿Prefieres el Chat?</h3>
            <p className="text-muted-foreground mb-4">
              Nuestro equipo de soporte está disponible para ayudarte en tiempo
              real.
            </p>
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition">
              Iniciar Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
