import { JitsiMeeting } from "@/components/JitsiMeeting";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface WaitingRoomProps {
  bookingId: string;
  clientName: string;
  professionalName: string;
}

type MeetingStatus =
  | "PENDING"
  | "WAITING"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

interface MeetingStatusResponse {
  bookingId: string;
  jitsiRoom: string;
  meetingStatus: MeetingStatus;
  meetingStartTime?: string;
  meetingEndTime?: string;
  remainingTime?: number;
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({
  bookingId,
  clientName,
  professionalName,
}) => {
  const [meetingStatus, setMeetingStatus] =
    useState<MeetingStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMeetingStatus = async () => {
      try {
        const response = await fetch(
          `/api/bookings/${bookingId}/meeting-status`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener el estado de la reunión");
        }

        const data = await response.json();
        setMeetingStatus(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setIsLoading(false);
      }
    };

    fetchMeetingStatus();

    // Polling cada 5 segundos para verificar si el profesional acepta la reunión
    const interval = setInterval(fetchMeetingStatus, 5000);

    return () => clearInterval(interval);
  }, [bookingId]);

  const handleVideoConferenceLeft = () => {
    // Redirigir a una página de feedback o resumen
    router.push(`/bookings/${bookingId}/completed`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estado de la reunión...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/panel")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Volver al Panel
          </button>
        </div>
      </div>
    );
  }

  if (!meetingStatus) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">
            No se pudo obtener el estado de la reunión
          </p>
        </div>
      </div>
    );
  }

  // Si la reunión está activa, mostrar Jitsi
  if (meetingStatus.meetingStatus === "ACTIVE") {
    return (
      <div className="h-screen">
        <JitsiMeeting
          roomName={meetingStatus.jitsiRoom}
          userDisplayName={clientName}
          onVideoConferenceLeft={handleVideoConferenceLeft}
          maxDuration={meetingStatus.remainingTime || 18 * 60 * 1000}
        />
      </div>
    );
  }

  // Si la reunión terminó
  if (meetingStatus.meetingStatus === "COMPLETED") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Reunión Completada
          </h2>
          <p className="text-gray-600 mb-6">
            Su sesión con {professionalName} ha finalizado.
          </p>
          <button
            onClick={() => router.push(`/bookings/${bookingId}/completed`)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  // Si la reunión fue cancelada o expiró
  if (
    meetingStatus.meetingStatus === "CANCELLED" ||
    meetingStatus.meetingStatus === "EXPIRED"
  ) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-orange-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {meetingStatus.meetingStatus === "CANCELLED"
              ? "Reunión Cancelada"
              : "Reunión Expirada"}
          </h2>
          <p className="text-gray-600 mb-6">
            {meetingStatus.meetingStatus === "CANCELLED"
              ? "El profesional ha cancelado la reunión."
              : "El tiempo de espera ha expirado."}
          </p>
          <button
            onClick={() => router.push("/panel")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Volver al Panel
          </button>
        </div>
      </div>
    );
  }

  // Sala de espera por defecto
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full text-center">
        <div className="mb-6">
          <div className="animate-pulse rounded-full h-20 w-20 bg-blue-200 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">👨‍💼</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Sala de Espera
          </h2>
          <p className="text-gray-600">
            Esperando a que <strong>{professionalName}</strong> se una a la
            reunión
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 text-blue-600 mb-4">
            <div className="animate-bounce">●</div>
            <div className="animate-bounce" style={{ animationDelay: "0.1s" }}>
              ●
            </div>
            <div className="animate-bounce" style={{ animationDelay: "0.2s" }}>
              ●
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Su pago ha sido procesado correctamente. El profesional ha sido
            notificado y se unirá en breve.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            Información de la Sesión
          </h3>
          <div className="text-left space-y-1 text-sm">
            <p>
              <strong>Cliente:</strong> {clientName}
            </p>
            <p>
              <strong>Profesional:</strong> {professionalName}
            </p>
            <p>
              <strong>Duración:</strong> 18 minutos
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              {meetingStatus.meetingStatus === "WAITING"
                ? "Esperando confirmación"
                : "Preparando reunión"}
            </p>
          </div>
        </div>

        <div className="text-xs text-gray-400">
          <p>
            La reunión comenzará automáticamente cuando el profesional se una.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
