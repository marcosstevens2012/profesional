import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@profesional/ui";
import { Calendar, MapPin, MessageCircle, Star, Video } from "lucide-react";
import { type Metadata } from "next";

interface ProfessionalPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProfessionalPageProps): Promise<Metadata> {
  // En producción, aquí harías fetch a la API para obtener los datos del profesional
  const professionalName = "Juan Pérez"; // Placeholder
  // Usamos params.slug para personalizar el metadata
  console.log("Professional slug:", params.slug);

  return {
    title: `${professionalName} - Desarrollador Web`,
    description: `Perfil de ${professionalName}. Contrata servicios profesionales verificados y de calidad.`,
  };
}

export default function ProfessionalPage({ params }: ProfessionalPageProps) {
  // En producción, aquí harías fetch a la API usando params.slug
  // Si no existe el profesional, return notFound()
  console.log("Loading professional:", params.slug);

  const professional = {
    id: "1",
    name: "Juan Pérez",
    title: "Desarrollador Web Full-Stack",
    avatar: null,
    location: "Capital Federal, Argentina",
    rating: 4.9,
    reviewsCount: 23,
    description:
      "Desarrollador especializado en React, Next.js y Node.js con más de 5 años de experiencia. Me apasiona crear aplicaciones web modernas y escalables que resuelvan problemas reales.",
    hourlyRate: 15000,
    responseTime: "2 horas",
    languages: ["Español", "Inglés"],
    skills: [
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Docker",
    ],
    availability: "Disponible",
  };

  const breadcrumbItems = [
    { label: "Explorar", href: "/explorar" },
    { label: professional.name },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-semibold text-primary">
                    {professional.name
                      .split(" ")
                      .map(n => n[0])
                      .join("")}
                  </span>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold">{professional.name}</h1>
                    <p className="text-lg text-muted-foreground">
                      {professional.title}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {professional.location}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {professional.rating} ({professional.reviewsCount}{" "}
                      reseñas)
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-green-600" />
                      {professional.availability}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {professional.skills.map(skill => (
                      <span
                        key={skill}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>Acerca de</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {professional.description}
              </p>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Servicios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Desarrollo Frontend</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    React, Next.js, TypeScript
                  </p>
                  <p className="font-medium mt-2">Desde $20.000</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Desarrollo Full-Stack</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Frontend + Backend + Base de datos
                  </p>
                  <p className="font-medium mt-2">Desde $35.000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Reseñas ({professional.reviewsCount})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">M</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">María González</p>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className="h-3 w-3 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Hace 2 semanas
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Excelente trabajo, muy profesional y cumplió con todos los
                    tiempos acordados. Recomendable al 100%.
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  ARS ${professional.hourlyRate.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">por hora</p>
              </div>

              <div className="space-y-3">
                <Button className="w-full" size="lg">
                  Contratar Ahora
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enviar Mensaje
                </Button>
                <Button variant="outline" className="w-full">
                  <Video className="h-4 w-4 mr-2" />
                  Videollamada
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Tiempo de respuesta
                </span>
                <span>{professional.responseTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Idiomas</span>
                <span>{professional.languages.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Miembro desde</span>
                <span>Enero 2023</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
