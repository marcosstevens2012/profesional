"use client";

import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { paymentsAPI } from "@/lib/api/payments";
import { useProfileBySlug } from "@/lib/hooks/use-profiles";
import { formatLocation } from "@/lib/utils/location-utils";
import { ArrowLeft, MapPin, MessageCircle, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProfessionalPageProps {
  params: {
    slug: string;
  };
}

// Modal de solicitud de consulta simplificado
function ConsultationRequestModal({
  professional,
  isOpen,
  onClose,
  consultationPrice,
  professionalSlug,
}: {
  professional: any;
  isOpen: boolean;
  onClose: () => void;
  consultationPrice: number;
  professionalSlug: string;
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setLoading(true);
    try {
      console.log("🚀 Iniciando pago para:", {
        professionalSlug,
        amount: consultationPrice,
        title: `Consulta con ${professional.user?.name || "Profesional"}`,
      });

      // Crear preferencia de pago en MercadoPago
      const paymentResponse = await paymentsAPI.createConsultationPayment({
        title: `Consulta con ${professional.user?.name || "Profesional"}`,
        amount: consultationPrice,
        professionalSlug,
      });

      console.log("✅ Payment preference creada:", paymentResponse);

      // Determinar qué URL usar según el entorno
      const checkoutUrl = paymentResponse.metadata?.is_sandbox
        ? paymentResponse.sandbox_init_point
        : paymentResponse.init_point;

      console.log("✅ Checkout URL:", checkoutUrl);

      // Verificar que tenemos el init_point
      if (!checkoutUrl) {
        console.error("❌ No init_point found in response:", paymentResponse);
        alert("Error: No se pudo obtener el enlace de pago");
        return;
      }

      // Redirigir a MercadoPago
      console.log("🚀 Redirecting to MercadoPago...");
      window.location.href = checkoutUrl;
    } catch (error: any) {
      console.error("❌ Error completo en el pago:", error);
      console.error("❌ Error response:", error.response);
      console.error("❌ Error response data:", error.response?.data);
      console.error("❌ Error message:", error.message);

      const errorMessage =
        error.response?.data?.message || error.message || "Error desconocido";
      alert(`Error al procesar el pago: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl">
        {/* Header simplificado */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
            {professional.user?.name?.charAt(0) || "P"}
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Consulta con {professional.user?.name}
          </h2>
          <p className="text-gray-500 text-sm">
            {professional.serviceCategory?.name}
          </p>
        </div>

        {/* Precio destacado */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg mb-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">
            ${consultationPrice.toLocaleString()}
          </div>
          <div className="text-sm text-green-700">Precio fijo • Pago único</div>
        </div>

        {/* Beneficios clave */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-gray-700">
              Respuesta en {professional.responseTime || "24 horas"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-gray-700">Pago seguro con MercadoPago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span className="text-gray-700">
              Notificación inmediata al profesional
            </span>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handlePayment}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Procesando...
              </div>
            ) : (
              "Pagar y Solicitar"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ProfessionalPage({ params }: ProfessionalPageProps) {
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const router = useRouter();
  const {
    data: professional,
    isLoading,
    error,
  } = useProfileBySlug(params.slug);

  // Type assertion para las propiedades extendidas
  const prof = professional as any;

  // Obtener precio directamente del perfil del profesional
  const consultationPrice = prof?.pricePerSession
    ? Number(prof.pricePerSession)
    : 25000;

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
          <h1 className="text-2xl font-bold mb-4">Profesional no encontrado</h1>
          <p className="mt-2 text-muted-foreground">
            El profesional que buscas no existe o ha sido removido.
          </p>
          <div className="mt-6">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver atrás
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Profesionales", href: "/profesionales" },
    { label: prof?.user?.name || "Cargando...", href: "#" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mt-8 grid lg:grid-cols-3 gap-8">
          {/* Perfil Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header del perfil mejorado */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {/* Banner de color */}
                <div className="h-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800"></div>

                <div className="p-6 -mt-12">
                  <div className="flex items-start gap-4">
                    {/* Avatar mejorado */}
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                          {prof.user?.name?.charAt(0) || "P"}
                        </div>
                      </div>
                      {prof.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                          ✓
                        </div>
                      )}
                    </div>

                    <div className="flex-1 mt-12">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">
                          {prof.user?.name}
                        </h1>
                        {prof.isVerified && (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            ✓ Verificado
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl text-blue-600 font-semibold mb-3">
                        {prof.serviceCategory?.name}
                      </h2>

                      {/* Métricas destacadas */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-lg">
                            {prof.rating}
                          </span>
                          <span className="text-gray-600">
                            ({prof.reviewCount} reseñas)
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{formatLocation(prof.location)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MessageCircle className="h-4 w-4" />
                          <span>Responde en {prof.responseTime || "24h"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags mejorados */}
                  {prof.tags && prof.tags.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex flex-wrap gap-2">
                        {prof.tags.map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Descripción mejorada */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    👤
                  </div>
                  Sobre {prof.user?.name?.split(" ")[0] || "este profesional"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  {prof.description}
                </p>

                {/* Métricas destacadas */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {prof.experience || 1}+
                    </div>
                    <div className="text-sm text-blue-700 font-medium">
                      Años de experiencia
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {prof.reviewCount}
                    </div>
                    <div className="text-sm text-green-700 font-medium">
                      Consultas realizadas
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      {prof.rating}
                    </div>
                    <div className="text-sm text-purple-700 font-medium">
                      Calificación promedio
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reseñas mejoradas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    ⭐
                  </div>
                  Reseñas de clientes ({prof.reviewCount})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {prof.reviews && prof.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {prof.reviews.slice(0, 3).map((review: any) => (
                      <div
                        key={review.id}
                        className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold text-sm">
                              {review.client?.profile?.firstName?.charAt(0) ||
                                "C"}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {review.client?.profile
                                  ? `${review.client.profile.firstName} ${review.client.profile.lastName}`
                                  : "Cliente"}
                              </div>
                              <div className="flex items-center gap-1">
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
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            Hace {Math.floor(Math.random() * 30) + 1} días
                          </div>
                        </div>
                        <p className="text-gray-700 italic">
                          &ldquo;{review.comment}&rdquo;
                        </p>
                      </div>
                    ))}

                    {prof.reviews.length > 3 && (
                      <div className="text-center pt-4">
                        <Button variant="outline" className="text-blue-600">
                          Ver todas las reseñas ({prof.reviews.length})
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-gray-400 mx-auto mb-4">
                      💬
                    </div>
                    <p className="text-gray-500 text-lg font-medium mb-2">
                      Este profesional aún no tiene reseñas
                    </p>
                    <p className="text-gray-400 text-sm">
                      ¡Sé el primero en dejar una reseña después de tu consulta!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar de consulta optimizado */}
          <div className="space-y-4">
            {/* Card principal de consulta */}
            <Card className="border-2 border-green-100">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-3">
                    💬 Consulta Online
                  </div>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    ${consultationPrice.toLocaleString()}
                  </div>
                  <div className="text-gray-600 font-medium mb-1">
                    Precio fijo • Sin sorpresas
                  </div>
                  <div className="text-sm text-gray-500">
                    Todas las consultas cuestan lo mismo
                  </div>
                </div>

                <Button
                  className="w-full mb-4 h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  onClick={() => setShowConsultationModal(true)}
                >
                  💳 Pagar y Solicitar Consulta
                </Button>

                {/* Garantías rápidas */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                  <div className="text-sm space-y-2">
                    <div className="flex items-center gap-2 text-blue-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span className="font-medium">
                        Respuesta garantizada en {prof.responseTime || "24h"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span className="font-medium">
                        Pago 100% seguro con MercadoPago
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span className="font-medium">
                        Notificación inmediata al profesional
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats compactas */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-lg">{prof.rating}</span>
                    </div>
                    <div className="text-xs text-gray-600">Calificación</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-blue-600">
                      {prof.reviewCount}
                    </div>
                    <div className="text-xs text-gray-600">Consultas</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-purple-600">
                      {prof.experience || 1}+
                    </div>
                    <div className="text-xs text-gray-600">Años exp.</div>
                  </div>
                  <div>
                    <div
                      className={`font-bold text-lg ${prof.isVerified ? "text-green-600" : "text-gray-400"}`}
                    >
                      {prof.isVerified ? "✓" : "✗"}
                    </div>
                    <div className="text-xs text-gray-600">Verificado</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de solicitud de consulta */}
      <ConsultationRequestModal
        professional={prof}
        isOpen={showConsultationModal}
        onClose={() => setShowConsultationModal(false)}
        consultationPrice={consultationPrice}
        professionalSlug={params.slug}
      />
    </div>
  );
}
