import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cómo Funciona?",
  description:
    "Aprende cómo funciona nuestra plataforma para conectar con profesionales de confianza.",
};

export default function ComoFuncionaPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8">¿Cómo Funciona?</h1>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Para Clientes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl font-bold text-primary mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Busca</h3>
              <p className="text-muted-foreground">
                Explora nuestro catálogo de profesionales verificados en tu
                área.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl font-bold text-primary mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Reserva</h3>
              <p className="text-muted-foreground">
                Selecciona el servicio que necesitas y agenda tu cita.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl font-bold text-primary mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Disfruta</h3>
              <p className="text-muted-foreground">
                Recibe el servicio profesional que buscabas con total confianza.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Para Profesionales</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl font-bold text-primary mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Regístrate</h3>
              <p className="text-muted-foreground">
                Crea tu perfil profesional y completa tu verificación.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl font-bold text-primary mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Configura</h3>
              <p className="text-muted-foreground">
                Define tus servicios, precios y disponibilidad.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl font-bold text-primary mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Crece</h3>
              <p className="text-muted-foreground">
                Recibe reservas, gestiona tu agenda y expande tu negocio.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-muted p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Beneficios de Nuestra Plataforma
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>Profesionales verificados con documentación al día</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>Pagos seguros y protegidos</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>Sistema de valoraciones y reseñas transparente</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>Soporte al cliente disponible</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>Gestión de agenda simplificada</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
