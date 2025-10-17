import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Precios",
  description: "Conoce nuestros planes y comisiones para profesionales.",
};

export default function PreciosPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Precios Transparentes</h1>
        <p className="text-xl text-muted-foreground">
          Sin costos ocultos. Paga solo cuando recibes reservas.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-card p-8 rounded-lg border text-center">
          <h2 className="text-2xl font-bold mb-4">Para Clientes</h2>
          <div className="text-5xl font-bold text-primary mb-4">Gratis</div>
          <p className="text-muted-foreground mb-6">
            Buscar y contactar profesionales es completamente gratuito.
          </p>
          <ul className="space-y-3 text-left">
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>Búsqueda ilimitada</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>Ver perfiles completos</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>Leer reseñas</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>Mensajería directa</span>
            </li>
          </ul>
        </div>

        <div className="bg-primary text-primary-foreground p-8 rounded-lg border-2 border-primary shadow-lg transform md:scale-105">
          <div className="text-center">
            <div className="bg-accent text-accent-foreground inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4">
              Más Popular
            </div>
            <h2 className="text-2xl font-bold mb-4">Plan Básico</h2>
            <div className="mb-4">
              <span className="text-5xl font-bold">10%</span>
            </div>
            <p className="mb-6 opacity-90">Comisión por reserva completada</p>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Perfil profesional</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Gestión de agenda</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Pagos seguros</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Soporte básico</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Panel de estadísticas</span>
            </li>
          </ul>
        </div>

        <div className="bg-card p-8 rounded-lg border text-center">
          <h2 className="text-2xl font-bold mb-4">Plan Premium</h2>
          <div className="mb-4">
            <span className="text-5xl font-bold text-primary">7%</span>
          </div>
          <p className="text-muted-foreground mb-6">
            Comisión por reserva completada
          </p>
          <ul className="space-y-3 text-left">
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>Todo del Plan Básico</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>Perfil destacado</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>Prioridad en búsquedas</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>Soporte prioritario</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>Analytics avanzados</span>
            </li>
          </ul>
        </div>
      </div>

      <section className="bg-muted p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Preguntas Frecuentes
        </h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          <div>
            <h3 className="font-semibold mb-2">
              ¿Cuándo se cobra la comisión?
            </h3>
            <p className="text-muted-foreground">
              La comisión se cobra únicamente cuando se completa una reserva
              exitosamente.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">¿Hay costos de registro?</h3>
            <p className="text-muted-foreground">
              No, registrarse como profesional es completamente gratuito.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">¿Puedo cambiar de plan?</h3>
            <p className="text-muted-foreground">
              Sí, puedes actualizar a Premium en cualquier momento desde tu
              panel.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
