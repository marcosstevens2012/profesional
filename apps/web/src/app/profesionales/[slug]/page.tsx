"use client";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { useProfileBySlug } from "@/lib/hooks/use-profiles";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@profesional/ui";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  MessageCircle,
  Star,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfessionalPageProps {
  params: {
    slug: string;
  };
}

export default function ProfessionalPage({ params }: ProfessionalPageProps) {
  const router = useRouter();
  const {
    data: professional,
    isLoading,
    error,
  } = useProfileBySlug(params.slug);
  // Type assertion para las propiedades extendidas
  const prof = professional as any;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Cargando...</h1>
          <p className="mt-2 text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !prof) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Perfil no encontrado</h1>
          <p className="mt-2 text-muted-foreground">
            El profesional que buscas no está disponible.
          </p>
          <Button onClick={() => router.push("/explorar")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a explorar
          </Button>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Explorar", href: "/explorar" },
    { label: prof.user?.name || "Profesional" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mt-8 grid lg:grid-cols-3 gap-8">
          {/* Perfil Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header del perfil */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                    {prof.user?.name?.charAt(0) || "P"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {prof.user?.name}
                      </h1>
                      {prof.isVerified && (
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          ✓ Verificado
                        </div>
                      )}
                    </div>
                    <h2 className="text-xl text-gray-600 mt-1">{prof.title}</h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{prof.rating}</span>
                        <span>({prof.reviewCount} reseñas)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {prof.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        Responde en {prof.responseTime || "24 horas"}
                      </div>
                    </div>
                  </div>
                </div>
                {prof.skills && prof.skills.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {prof.skills.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Descripción */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre mí</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {prof.description}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {prof.experience || 1}+ años en el área
                    </div>
                    <div className="text-sm text-gray-600">Experiencia</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {prof.reviewCount}
                    </div>
                    <div className="text-sm text-gray-600">
                      Proyectos completados
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Servicios */}
            <Card>
              <CardHeader>
                <CardTitle>Servicios que ofrezco</CardTitle>
              </CardHeader>
              <CardContent>
                {prof.services && prof.services.length > 0 ? (
                  <div className="space-y-4">
                    {prof.services.map((service: any) => (
                      <div
                        key={service.id}
                        className="flex justify-between items-center p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{service.title}</h3>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">
                            ${service.price.toLocaleString()} ARS
                          </div>
                          <div className="text-sm text-gray-600">por hora</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Este profesional aún no ha listado sus servicios
                    específicos.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Reseñas */}
            <Card>
              <CardHeader>
                <CardTitle>Reseñas de clientes</CardTitle>
              </CardHeader>
              <CardContent>
                {prof.reviews && prof.reviews.length > 0 ? (
                  prof.reviews.map((review: any) => (
                    <div
                      key={review.id}
                      className="border-b last:border-b-0 py-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">{review.client}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Este profesional aún no tiene reseñas.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar de contacto */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900">
                    ${prof.hourlyRate?.toLocaleString()} ARS
                  </div>
                  <div className="text-gray-600">por hora</div>
                </div>

                <div className="space-y-3 mb-6">
                  <Button className="w-full" size="lg">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Enviar mensaje
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Video className="mr-2 h-4 w-4" />
                    Videollamada
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar cita
                  </Button>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Tiempo de respuesta:</span>
                    <span>{prof.responseTime || "24 horas"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Idiomas:</span>
                    <span>Español, Inglés</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats adicionales */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Calificación promedio:
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{prof.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Proyectos completados:
                    </span>
                    <span className="font-medium">{prof.reviewCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Años de experiencia:</span>
                    <span className="font-medium">{prof.experience}+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Verificado:</span>
                    <span
                      className={
                        prof.isVerified ? "text-green-600" : "text-gray-400"
                      }
                    >
                      {prof.isVerified ? "✓ Sí" : "No"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
