import { getButtonClasses } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui";
import { ArrowRight, Search, Shield, Star } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Conecta con profesionales de confianza. Encuentra y contrata servicios profesionales de calidad en tu área.",
};

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Conecta con <span className="text-primary">Profesionales</span> de
            Confianza
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Encuentra y contrata servicios profesionales de calidad en tu área.
            Profesionales verificados, pagos seguros y comunicación directa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/explorar"
              className={getButtonClasses("default", "lg")}
            >
              Explorar Profesionales
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/ingresar"
              className={getButtonClasses("outline", "lg")}
            >
              Únete como Profesional
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">¿Cómo funciona?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conectamos clientes con profesionales de manera simple, segura y
            eficiente
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Busca y Filtra</h3>
              <p className="text-muted-foreground">
                Encuentra profesionales por categoría, ubicación, valoración y
                precio. Filtros avanzados para resultados precisos.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Reserva Segura</h3>
              <p className="text-muted-foreground">
                Pagos protegidos con Mercado Pago. Videollamadas integradas para
                comunicación directa.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Califica y Recomienda</h3>
              <p className="text-muted-foreground">
                Deja reseñas después del servicio. Ayuda a otros usuarios y
                mejora la calidad de la plataforma.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">¿Listo para comenzar?</h2>
            <p className="text-lg text-muted-foreground">
              Únete a miles de usuarios que ya confían en nuestra plataforma
            </p>
            <Link
              href="/explorar"
              className={getButtonClasses("default", "lg")}
            >
              Comenzar Ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
