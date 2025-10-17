"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useAcceptMeeting,
  useHasNewBookingRequests,
  useProfessionalDashboard,
} from "@/hooks/useProfessionalBookings";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  RefreshCw,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";

export default function ProfessionalDashboard() {
  const {
    waitingBookings,
    waitingCount,
    meetings,
    meetingsCount,
    isLoading,
    error,
    refetch,
  } = useProfessionalDashboard();

  const acceptMeeting = useAcceptMeeting();
  const { hasNewRequests } = useHasNewBookingRequests();

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      await acceptMeeting.mutateAsync(bookingId);
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar el dashboard
          </h2>
          <p className="text-gray-600 mb-4">
            No se pudieron cargar las consultas pendientes
          </p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Profesional
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona tus consultas y reuniones pendientes
          </p>
        </div>
        <Button onClick={refetch} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Esperando Aceptación
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {waitingCount}
                {hasNewRequests && (
                  <Badge variant="destructive" className="ml-2">
                    Nuevo
                  </Badge>
                )}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Video className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Reuniones Listas
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {meetingsCount}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Activas</p>
              <p className="text-2xl font-bold text-gray-900">
                {waitingCount + meetingsCount}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Ingresos Pendientes
              </p>
              <p className="text-2xl font-bold text-gray-900">
                $
                {waitingBookings
                  .reduce((sum, booking) => sum + (booking.price || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Consultas Esperando Aceptación */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Consultas Esperando Aceptación
            </h2>
            <Badge variant="secondary">{waitingCount}</Badge>
          </div>

          {waitingCount === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">
                No hay consultas esperando aceptación
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {waitingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {booking.client?.name || "Cliente"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {booking.client?.email}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-orange-50 text-orange-700"
                    >
                      Esperando
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(booking.scheduledAt)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatTime(booking.scheduledAt)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />$
                      {(booking.price || 0).toLocaleString()}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {booking.duration || 60} min
                    </div>
                  </div>

                  {booking.notes && (
                    <p className="text-sm text-gray-600 mb-4 italic">
                      &ldquo;{booking.notes}&rdquo;
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAcceptBooking(booking.id)}
                      disabled={acceptMeeting.isPending}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {acceptMeeting.isPending
                        ? "Aceptando..."
                        : "Aceptar Consulta"}
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/bookings/${booking.id}`}>Ver Detalle</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Reuniones Listas */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Reuniones Listas
            </h2>
            <Badge variant="secondary">{meetingsCount}</Badge>
          </div>

          {meetingsCount === 0 ? (
            <div className="text-center py-8">
              <Video className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">
                No hay reuniones listas para iniciar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {meetings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {booking.client?.name || "Cliente"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {booking.client?.email}
                      </p>
                    </div>
                    <Badge className="bg-green-50 text-green-700">
                      Confirmada
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(booking.scheduledAt)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatTime(booking.scheduledAt)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Video className="w-4 h-4 mr-2" />
                      Sala: {booking.jitsiRoom}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {booking.duration || 60} min
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href={`/bookings/${booking.id}/meeting`}>
                        <Video className="w-4 h-4 mr-2" />
                        Unirse a Reunión
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/bookings/${booking.id}`}>Ver Detalle</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
