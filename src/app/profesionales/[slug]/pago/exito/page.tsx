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
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  User,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PagoExitoProps {
  params: {
    slug: string;
  };
}

interface BookingDetails {
  id: string;
  title: string;
  scheduledAt: string;
  professional: {
    name: string;
    slug: string;
  };
  client: {
    name: string;
  };
  payment: {
    id: string;
    amount: number;
    status: string;
    method: string;
  };
}

export default function PagoExitoPage({ params }: PagoExitoProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );

  // Extraer parámetros de la URL
  // MP puede enviar payment_id o collection_id (usar el que esté disponible)
  const paymentId = searchParams.get("payment_id");
  const collectionId = searchParams.get("collection_id");
  const externalReference = searchParams.get("external_reference"); // booking ID

  useEffect(() => {
    const checkPaymentStatus = async () => {
      // MP puede enviar collection_id o payment_id, usar el que esté disponible
      const mpPaymentId = collectionId || paymentId;

      if (!mpPaymentId) {
        setError("Faltan parámetros de pago. Por favor, contacta con soporte.");
        setLoading(false);
        return;
      }

      try {
        // Obtener el estado del pago desde el backend
        // Incluir external_reference si está disponible para mejor búsqueda
        const response = await paymentsAPI.getPaymentStatus(
          mpPaymentId,
          externalReference || undefined
        );

        if (response.success && response.data) {
          const { payment, booking } = response.data;

          // Verificar que el pago esté completado
          if (payment.status === "COMPLETED") {
            setBookingDetails({
              id: booking.id,
              title: `Consulta con ${booking.professional.name}`, // No viene title en la respuesta
              scheduledAt: booking.scheduledAt,
              professional: {
                name: booking.professional.name,
                slug: params.slug, // Usamos el slug de la URL
              },
              client: {
                name: booking.client.name,
              },
              payment: {
                id: payment.id,
                amount: parseFloat(payment.amount), // Convertir string a number
                status: payment.status,
                method: "MERCADOPAGO",
              },
            });
            setLoading(false);
          } else if (payment.status === "PENDING") {
            // Si está pendiente y no hemos reintentado mucho, esperar un poco
            // El webhook puede estar procesando todavía
            if (retryCount < 3) {
              console.log(
                `Pago aún pendiente, reintentando en 2s... (intento ${retryCount + 1}/3)`
              );
              setTimeout(() => {
                setRetryCount(retryCount + 1);
              }, 2000); // Esperar 2 segundos antes de reintentar
            } else {
              // Después de 3 intentos, redirigir a página de pendiente
              router.push(
                `/profesionales/${params.slug}/pago/pendiente?payment_id=${mpPaymentId}`
              );
            }
          } else if (
            payment.status === "FAILED" ||
            payment.status === "CANCELLED"
          ) {
            // Redirigir a página de error
            router.push(
              `/profesionales/${params.slug}/pago/error?payment_id=${mpPaymentId}`
            );
          } else {
            setError(`Estado de pago inesperado: ${payment.status}`);
            setLoading(false);
          }
        } else {
          setError("No se pudo obtener el estado del pago");
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Error verificando estado del pago:", err);

        // Si es un error 404, el pago aún no existe en el backend
        if (err.response?.status === 404 && retryCount < 3) {
          console.log(
            `Pago no encontrado, reintentando en 2s... (intento ${retryCount + 1}/3)`
          );
          setTimeout(() => {
            setRetryCount(retryCount + 1);
          }, 2000);
        } else {
          setError(
            err.response?.data?.error ||
              "Error al verificar el pago. Por favor, contacta con soporte."
          );
          setLoading(false);
        }
      }
    };

    checkPaymentStatus();
  }, [
    paymentId,
    collectionId,
    externalReference,
    params.slug,
    router,
    retryCount,
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg text-muted-foreground">
                {retryCount > 0
                  ? `Verificando tu pago... (${retryCount}/3)`
                  : "Confirmando tu pago..."}
              </p>
              {retryCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  Estamos esperando la confirmación del procesador de pagos
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: "Profesionales", href: "/profesionales" },
            { label: params.slug, href: `/profesionales/${params.slug}` },
            { label: "Error de Pago" },
          ]}
        />
        <div className="max-w-2xl mx-auto mt-8">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-6 w-6" />
                Error en el Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{error}</p>
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push(`/profesionales/${params.slug}`)}
                  variant="outline"
                >
                  Volver al Perfil
                </Button>
                <Button onClick={() => router.push("/panel")}>
                  Ir al Panel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!bookingDetails) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Profesionales", href: "/profesionales" },
          { label: params.slug, href: `/profesionales/${params.slug}` },
          { label: "Pago Exitoso" },
        ]}
      />

      <div className="max-w-2xl mx-auto mt-8 space-y-6">
        {/* Confirmación Principal */}
        <Card className="border-green-500 bg-green-50 dark:bg-green-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-400">
              <CheckCircle className="h-8 w-8" />
              ¡Pago Confirmado!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 dark:text-green-400">
              Tu consulta ha sido reservada exitosamente. Recibirás un correo de
              confirmación con todos los detalles.
            </p>
          </CardContent>
        </Card>

        {/* Detalles de la Consulta */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles de tu Consulta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">Fecha y Hora</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(bookingDetails.scheduledAt)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <User className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">Profesional</p>
                <p className="text-sm text-muted-foreground">
                  {bookingDetails.professional.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">Tipo de Consulta</p>
                <p className="text-sm text-muted-foreground">
                  {bookingDetails.title}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Pagado</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(bookingDetails.payment.amount)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ID de Transacción: {bookingDetails.payment.id}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Próximos Pasos */}
        <Card>
          <CardHeader>
            <CardTitle>¿Qué sigue?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <p className="text-sm">
                Recibirás un correo electrónico con los detalles de tu consulta
                y las instrucciones para conectarte.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <p className="text-sm">
                El profesional puede enviarte mensajes antes de la consulta si
                necesita información adicional.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <p className="text-sm">
                El día de la consulta, encontrarás el enlace de videollamada en
                tu panel de reservas.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => router.push("/panel")}
            className="flex-1"
            size="lg"
          >
            Ver Mis Reservas
          </Button>
          <Button
            onClick={() => router.push(`/profesionales/${params.slug}`)}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            Volver al Perfil
          </Button>
        </div>
      </div>
    </div>
  );
}
