"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCreateBookingPayment } from "@/hooks/useClientBookings";
import { useBookingDetails } from "@/hooks/useMeetings";
import { useAuth } from "@/lib/auth/auth-hooks";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Mail,
  Play,
  RefreshCw,
  User,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const { user } = useAuth();
  const {
    data: booking,
    isLoading,
    error,
    refetch,
  } = useBookingDetails(bookingId);
  const createPayment = useCreateBookingPayment();

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return <Badge variant="destructive">Pago Pendiente</Badge>;
      case "WAITING_FOR_PROFESSIONAL":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            Esperando Aceptación
          </Badge>
        );
      case "CONFIRMED":
        return <Badge className="bg-green-50 text-green-700">Confirmada</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-blue-50 text-blue-700">En Progreso</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary">Completada</Badge>;
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700">
            Cancelada
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMeetingStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline">Pendiente</Badge>;
      case "WAITING":
        return (
          <Badge className="bg-orange-50 text-orange-700">Esperando</Badge>
        );
      case "ACTIVE":
        return <Badge className="bg-green-50 text-green-700">Activa</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary">Completada</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelada</Badge>;
      case "EXPIRED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Expirada
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handlePayNow = () => {
    createPayment.mutate(bookingId);
  };

  const isClient = user?.id === booking?.clientId;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar la consulta
          </h2>
          <p className="text-gray-600 mb-4">
            No se pudo encontrar la información de esta consulta
          </p>
          <div className="space-x-4">
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
            <Button onClick={() => router.push("/panel")}>
              Volver al Panel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Detalles de la Consulta
          </h1>
          <div className="flex items-center gap-4">
            {getStatusBadge(booking.status)}
            {booking.meetingStatus &&
              getMeetingStatusBadge(booking.meetingStatus)}
          </div>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Información de la Consulta
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Fecha</div>
                    <div className="text-sm text-gray-600">
                      {formatDate(booking.scheduledAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Hora</div>
                    <div className="text-sm text-gray-600">
                      {formatTime(booking.scheduledAt)} ({booking.duration} min)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Precio</div>
                    <div className="text-sm text-gray-600">
                      ${(booking.price || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {booking.jitsiRoom && (
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Sala de Reunión
                      </div>
                      <div className="text-sm text-gray-600 font-mono">
                        {booking.jitsiRoom}
                      </div>
                    </div>
                  </div>
                )}

                {booking.meetingStartTime && (
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Inicio de Reunión
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatTime(booking.meetingStartTime)}
                      </div>
                    </div>
                  </div>
                )}

                {booking.meetingEndTime && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Fin de Reunión
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatTime(booking.meetingEndTime)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {booking.notes && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900 mb-1">Notas</div>
                    <p className="text-sm text-gray-600">{booking.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Professional/Client Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {isClient
                ? "Información del Profesional"
                : "Información del Cliente"}
            </h2>

            {isClient && booking.professional ? (
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {booking.professional.user?.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {booking.professional.title}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {booking.professional.user?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {booking.professional.user.email}
                        </span>
                      </div>
                    )}

                    {/* Teléfono no disponible en el schema actual */}
                  </div>
                </div>
              </div>
            ) : booking.client ? (
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {booking.client.name}
                  </h3>

                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {booking.client.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </Card>

          {/* Payment Information */}
          {booking.payment && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Información de Pago
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Estado</div>
                  <div className="font-medium">
                    {booking.payment.status === "COMPLETED"
                      ? "Completado"
                      : booking.payment.status}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Monto</div>
                  <div className="font-medium">
                    ${(booking.payment.amount || 0).toLocaleString()}
                  </div>
                </div>
                {booking.payment.paidAt && (
                  <div>
                    <div className="text-sm text-gray-600">Fecha de Pago</div>
                    <div className="font-medium">
                      {new Date(booking.payment.paidAt).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Acciones</h3>

            <div className="space-y-3">
              {/* Payment Action */}
              {booking.status === "PENDING_PAYMENT" && isClient && (
                <Button
                  onClick={handlePayNow}
                  disabled={createPayment.isPending}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {createPayment.isPending ? "Procesando..." : "Pagar Ahora"}
                </Button>
              )}

              {/* Join Meeting Action */}
              {(booking.status === "CONFIRMED" ||
                booking.status === "IN_PROGRESS") &&
                booking.jitsiRoom && (
                  <Button asChild className="w-full" size="lg">
                    <Link href={`/bookings/${bookingId}/meeting`}>
                      <Video className="w-5 h-5 mr-2" />
                      {booking.status === "IN_PROGRESS"
                        ? "Continuar Reunión"
                        : "Unirse a Reunión"}
                    </Link>
                  </Button>
                )}

              {/* Waiting Status */}
              {booking.status === "WAITING_FOR_PROFESSIONAL" && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 text-orange-800">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Esperando confirmación</span>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    El profesional ha sido notificado y confirmará pronto tu
                    consulta.
                  </p>
                </div>
              )}

              {/* Completed Status */}
              {booking.status === "COMPLETED" && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Consulta completada</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    La consulta ha finalizado exitosamente.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Info */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Información Rápida
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ID de Consulta:</span>
                <span className="font-mono">{booking.id.slice(-8)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Creada:</span>
                <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Modalidad:</span>
                <span>Videollamada</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Duración:</span>
                <span>{booking.duration} minutos</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
