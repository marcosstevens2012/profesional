"use client";

import { JitsiMeeting } from "@/components/JitsiMeeting";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useActiveMeetingMonitor,
  useMeetingManager,
} from "@/hooks/useMeetings";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  RefreshCw,
  Users,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface WaitingRoomProps {
  bookingId: string;
  clientName?: string;
  professionalName?: string;
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({
  bookingId,
  clientName,
  professionalName,
}) => {
  const router = useRouter();

  const {
    canJoin,
    jitsiRoom,
    role,
    meetingStatus,
    bookingStatus,
    booking,
    isLoading,
    isStarting,
    startMeeting,
    handleJoinMeeting,
    refetch,
    canStart,
    isActive,
    isCompleted,
    isWaiting,
  } = useMeetingManager(bookingId);

  const { formattedTime, isEnding } = useActiveMeetingMonitor(bookingId, () => {
    // Callback cuando termina la reunión
    router.push(`/bookings/${bookingId}/success`);
  });

  // Auto-start meeting si está listo
  useEffect(() => {
    if (canStart && meetingStatus === "WAITING") {
      // Auto-iniciar después de un breve delay
      const timer = setTimeout(() => {
        startMeeting();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [canStart, meetingStatus, startMeeting]);

  const handleVideoConferenceLeft = () => {
    router.push(`/bookings/${bookingId}/success`);
  };

  // Estados de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Cargando reunión...
          </h2>
          <p className="text-gray-600">Verificando el estado de tu consulta</p>
        </Card>
      </div>
    );
  }

  // Error o no puede unirse
  if (!canJoin && !isLoading) {
    const getErrorMessage = () => {
      switch (bookingStatus) {
        case "PENDING_PAYMENT":
          return "El pago aún no ha sido procesado";
        case "WAITING_FOR_PROFESSIONAL":
          return "Esperando que el profesional acepte la consulta";
        case "CANCELLED":
          return "La consulta ha sido cancelada";
        case "COMPLETED":
          return "La consulta ya ha finalizado";
        default:
          return "No es posible unirse a la reunión en este momento";
      }
    };

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Reunión no disponible
          </h2>
          <p className="text-gray-600 mb-6">{getErrorMessage()}</p>
          <div className="space-y-3">
            <Button onClick={refetch} variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Verificar Estado
            </Button>
            <Button
              onClick={() => router.push(`/bookings/${bookingId}`)}
              className="w-full"
            >
              Ver Detalles
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Reunión activa - mostrar Jitsi
  if (isActive && jitsiRoom) {
    return (
      <div className="h-screen relative">
        {/* Header con tiempo restante */}
        <div className="absolute top-4 right-4 z-50">
          <Card className="p-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span
                className={
                  isEnding ? "text-red-600 font-bold" : "text-gray-700"
                }
              >
                {formattedTime}
              </span>
              {isEnding && (
                <Badge variant="destructive" className="text-xs">
                  Finalizando
                </Badge>
              )}
            </div>
          </Card>
        </div>

        {/* Mensaje de permisos mejorado para Safari */}
        <div className="absolute top-4 left-4 z-50 max-w-sm">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3 text-sm text-blue-800">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">
                  Permisos de cámara y micrófono
                </p>
                <p className="text-xs leading-relaxed">
                  Si el navegador solicita permisos, por favor haga clic en
                  &quot;Permitir&quot; para cámara y micrófono. Los errores de
                  audio son normales en Safari y no afectan la funcionalidad de
                  la videollamada.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <JitsiMeeting
          roomName={jitsiRoom}
          userDisplayName={clientName || professionalName || "Usuario"}
          userEmail={
            booking?.client?.email || booking?.professional?.user?.email
          }
          onVideoConferenceLeft={handleVideoConferenceLeft}
          maxDuration={18 * 60 * 1000} // 18 minutos
        />
      </div>
    );
  }

  // Reunión completada
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Consulta Completada
          </h2>
          <p className="text-gray-600 mb-6">
            Su sesión ha finalizado exitosamente.
          </p>
          <Button
            onClick={() => router.push(`/bookings/${bookingId}/success`)}
            className="w-full"
          >
            Continuar
          </Button>
        </Card>
      </div>
    );
  }

  // Sala de espera
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="p-8 max-w-lg w-full text-center">
        {/* Header */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Sala de Espera
          </h2>
          <p className="text-gray-600">
            {isWaiting
              ? `Esperando a que ${role === "client" ? "el profesional" : "el cliente"} se una`
              : "Preparando reunión..."}
          </p>
        </div>

        {/* Estado actual */}
        <div className="mb-6">
          <Badge variant="outline" className="mb-4">
            {meetingStatus === "WAITING"
              ? "Esperando confirmación"
              : meetingStatus}
          </Badge>

          {isStarting && (
            <div className="flex items-center justify-center gap-2 text-blue-600 mb-4">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Iniciando reunión...</span>
            </div>
          )}

          <div className="flex items-center justify-center space-x-2 text-blue-600 mb-4">
            <div className="animate-bounce">●</div>
            <div className="animate-bounce" style={{ animationDelay: "0.1s" }}>
              ●
            </div>
            <div className="animate-bounce" style={{ animationDelay: "0.2s" }}>
              ●
            </div>
          </div>
        </div>

        {/* Información de la sesión */}
        {booking && (
          <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">
              Información de la Consulta
            </h3>
            <div className="grid grid-cols-1 gap-2 text-sm text-left">
              {role === "client" && booking.professional && (
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-blue-600" />
                  <span>
                    <strong>Profesional:</strong>{" "}
                    {booking.professional.user?.name}
                  </span>
                </div>
              )}
              {role === "professional" && booking.client && (
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-blue-600" />
                  <span>
                    <strong>Cliente:</strong> {booking.client.name}
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                <span>
                  <strong>Fecha:</strong>{" "}
                  {new Date(booking.scheduledAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-blue-600" />
                <span>
                  <strong>Duración:</strong> {booking.duration || 60} minutos
                </span>
              </div>
              {jitsiRoom && (
                <div className="flex items-center">
                  <Video className="w-4 h-4 mr-2 text-blue-600" />
                  <span>
                    <strong>Sala:</strong> {jitsiRoom}
                  </span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Acciones */}
        <div className="space-y-3">
          {canStart && !isStarting && (
            <Button onClick={handleJoinMeeting} className="w-full" size="lg">
              <Video className="w-5 h-5 mr-2" />
              Iniciar Reunión
            </Button>
          )}

          <Button onClick={refetch} variant="outline" className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar Estado
          </Button>

          <Button
            onClick={() => router.push(`/bookings/${bookingId}`)}
            variant="ghost"
            className="w-full"
          >
            Ver Detalles de la Consulta
          </Button>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-xs text-gray-500">
          <p>
            La reunión comenzará automáticamente cuando ambas partes estén
            listas.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default WaitingRoom;
