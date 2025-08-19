import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button, Card, CardContent } from "@profesional/ui";
import { Filter, MapPin, Search, Star } from "lucide-react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Explorar Profesionales",
  description:
    "Encuentra profesionales verificados en tu área. Filtra por categoría, ubicación, valoración y precio.",
};

export default function ExplorarPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Explorar Profesionales
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encuentra el profesional perfecto para tu proyecto. Todos nuestros
            profesionales están verificados y tienen garantía de calidad.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-muted/50 p-6 rounded-lg space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar profesionales, servicios..."
                className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" size="sm">
                <MapPin className="h-4 w-4 mr-2" />
                Ubicación
              </Button>
            </div>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              Todas las categorías
            </span>
            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
              Capital Federal
            </span>
            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
              4+ estrellas
            </span>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Professional Card Example */}
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      JP
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Juan Pérez</h3>
                    <p className="text-sm text-muted-foreground">
                      Desarrollador Web
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">4.9</span>
                  <span className="text-sm text-muted-foreground">
                    (23 reseñas)
                  </span>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  Capital Federal
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  Especialista en React, Next.js y desarrollo full-stack. Más de
                  5 años de experiencia creando aplicaciones web modernas.
                </p>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">Desde $15.000</span>
                  <Button size="sm">Ver Perfil</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            Cargar Más Profesionales
          </Button>
        </div>
      </div>
    </div>
  );
}
