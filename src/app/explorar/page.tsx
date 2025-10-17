"use client";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button, Card, CardContent } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { FrontendProfessional } from "@/lib/adapters/professional-adapter";
import { useSearchProfessionals } from "@/lib/hooks/use-search";
import { useServiceCategories } from "@/lib/hooks/use-services";
import { formatLocation } from "@/lib/utils/location-utils";
import { Filter, MapPin, Search, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ExplorarPage() {
  const [searchFilters, setSearchFilters] = useState({
    page: 1,
    limit: 12,
    sortBy: "rating" as const,
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Data fetching
  const {
    data: professionals,
    isLoading,
    error,
  } = useSearchProfessionals(searchFilters);
  const { data: _categories } = useServiceCategories();

  const handleSearch = () => {
    setSearchFilters((prev) => ({
      ...prev,
      query: searchQuery,
      page: 1, // Reset to first page
    }));
  };

  const handleLoadMore = () => {
    if (professionals?.pagination?.hasNext) {
      setSearchFilters((prev) => ({
        ...prev,
        page: (prev.page || 1) + 1,
      }));
    }
  };

  const breadcrumbItems = [{ label: "Explorar profesionales" }];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            Encontrá el profesional perfecto
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Conectate con profesionales verificados en tu área. Desde desarrollo
            hasta diseño, encontrá el talento que necesitás para tu proyecto.
          </p>
        </div>

        {/* Search Bar */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="¿Qué tipo de profesional buscás?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="sm:w-auto">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
            <Button variant="outline" className="sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-muted-foreground">
              Buscando profesionales...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-destructive">
              Error al cargar los profesionales. Por favor, intentá nuevamente.
            </p>
          </div>
        )}

        {/* Results Grid */}
        {professionals &&
          professionals.data &&
          Array.isArray(professionals.data) &&
          professionals.data.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                  {professionals.pagination?.total || 0} profesionales
                  encontrados
                </p>
                <p className="text-sm text-muted-foreground">
                  Página {professionals.pagination?.page || 1} de{" "}
                  {professionals.pagination?.totalPages || 1}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {professionals.data.map(
                  (professional: FrontendProfessional) => (
                    <Link
                      key={professional.id}
                      href={`/profesionales/${professional.slug || professional.id}`}
                      className="block transition-transform hover:scale-105"
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                              {professional.user?.avatarUrl ? (
                                <Image
                                  src={professional.user.avatarUrl}
                                  alt={professional.user.name || "Professional"}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-lg font-bold text-primary">
                                    {professional.user?.name?.charAt(0) || "P"}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg truncate">
                                {professional.user?.name}
                              </h3>
                              <p className="text-primary font-medium truncate">
                                {professional.title}
                              </p>

                              <div className="flex items-center gap-1 mt-2">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">
                                  {professional.rating}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  ({professional.reviewCount})
                                </span>
                              </div>

                              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">
                                  {formatLocation(professional.location)}
                                </span>
                              </div>

                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {professional.description}
                              </p>

                              <div className="mt-3">
                                <span className="text-lg font-bold">
                                  ${professional.hourlyRate?.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Skills */}
                          {professional.skills &&
                            professional.skills.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {professional.skills
                                  .slice(0, 3)
                                  .map((skill: string, index: number) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                {professional.skills.length > 3 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{professional.skills.length - 3} más
                                  </span>
                                )}
                              </div>
                            )}
                        </CardContent>
                      </Card>
                    </Link>
                  )
                )}
              </div>

              {/* Load More Button */}
              {professionals.pagination?.hasNext && (
                <div className="text-center">
                  <Button onClick={handleLoadMore} variant="outline" size="lg">
                    Cargar más profesionales
                  </Button>
                </div>
              )}
            </>
          )}

        {/* Empty State */}
        {professionals &&
          professionals.data &&
          Array.isArray(professionals.data) &&
          professionals.data.length === 0 &&
          !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                No encontramos profesionales
              </h3>
              <p className="text-muted-foreground mb-4">
                Probá ajustando los filtros o buscando con términos diferentes.
              </p>
              <Button variant="outline">Limpiar filtros</Button>
            </div>
          )}
      </div>
    </div>
  );
}
