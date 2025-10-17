import { bookingsAPI } from "@/lib/api/bookings";
import type { StartMeetingResponse } from "@/lib/contracts/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

/**
 * Hook para verificar si el usuario puede unirse a una reunión
 */
export function useCanJoinMeeting(bookingId: string, enabled = true) {
  return useQuery({
    queryKey: ["bookings", bookingId, "can-join"],
    queryFn: () => bookingsAPI.canJoinMeeting(bookingId),
    enabled: enabled && !!bookingId,
    refetchInterval: 5000, // Verificar cada 5 segundos
    staleTime: 1000, // Datos obsoletos después de 1 segundo
  });
}

/**
 * Hook para obtener el estado actual de una reunión
 */
export function useMeetingStatus(bookingId: string, enabled = true) {
  return useQuery({
    queryKey: ["bookings", bookingId, "meeting-status"],
    queryFn: () => bookingsAPI.getMeetingStatus(bookingId),
    enabled: enabled && !!bookingId,
    refetchInterval: 5000, // Verificar cada 5 segundos
    staleTime: 1000,
  });
}

/**
 * Hook para obtener detalles de un booking
 */
export function useBookingDetails(bookingId: string, enabled = true) {
  return useQuery({
    queryKey: ["bookings", bookingId, "details"],
    queryFn: () => bookingsAPI.getBookingDetails(bookingId),
    enabled: enabled && !!bookingId,
    staleTime: 30000, // 30 segundos
  });
}

/**
 * Hook para iniciar una reunión
 */
export function useStartMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => bookingsAPI.startMeeting(bookingId),
    onSuccess: (data: StartMeetingResponse, bookingId: string) => {
      // Invalidar todas las consultas relacionadas con este booking
      queryClient.invalidateQueries({
        queryKey: ["bookings", bookingId],
      });

      // Invalidar listas de bookings
      queryClient.invalidateQueries({
        queryKey: ["bookings", "client"],
      });
      queryClient.invalidateQueries({
        queryKey: ["bookings", "professional"],
      });

      toast.success("Reunión iniciada correctamente");
    },
    onError: (error: any) => {
      console.error("❌ Error al iniciar reunión:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Error al iniciar la reunión";

      toast.error(errorMessage);
    },
  });
}

/**
 * Hook combinado para gestión completa de reuniones
 * Proporciona toda la información y acciones necesarias
 */
export function useMeetingManager(bookingId: string) {
  const canJoin = useCanJoinMeeting(bookingId);
  const meetingStatus = useMeetingStatus(bookingId);
  const bookingDetails = useBookingDetails(bookingId);
  const startMeeting = useStartMeeting();

  const handleJoinMeeting = () => {
    if (canJoin.data?.canJoin && canJoin.data?.meetingStatus === "WAITING") {
      // Si la reunión está esperando, la iniciamos automáticamente
      startMeeting.mutate(bookingId);
    }
  };

  return {
    // Estados
    canJoin: canJoin.data?.canJoin || false,
    jitsiRoom: canJoin.data?.jitsiRoom || meetingStatus.data?.jitsiRoom,
    role: canJoin.data?.role || meetingStatus.data?.role,
    meetingStatus:
      meetingStatus.data?.meetingStatus || canJoin.data?.meetingStatus,
    bookingStatus:
      meetingStatus.data?.bookingStatus || canJoin.data?.bookingStatus,
    remainingTime: meetingStatus.data?.remainingTime,
    booking: bookingDetails.data,

    // Estados de carga
    isLoading:
      canJoin.isLoading || meetingStatus.isLoading || bookingDetails.isLoading,
    isStarting: startMeeting.isPending,

    // Acciones
    startMeeting: () => startMeeting.mutate(bookingId),
    handleJoinMeeting,

    // Funciones de utilidad
    refetch: () => {
      canJoin.refetch();
      meetingStatus.refetch();
      bookingDetails.refetch();
    },

    // Estados derivados
    canStart:
      canJoin.data?.canJoin && canJoin.data?.meetingStatus === "WAITING",
    isActive: meetingStatus.data?.meetingStatus === "ACTIVE",
    isCompleted: meetingStatus.data?.meetingStatus === "COMPLETED",
    isWaiting: meetingStatus.data?.meetingStatus === "WAITING",
  };
}

/**
 * Hook para verificar continuamente el estado de una reunión activa
 * Útil para mostrar tiempo restante y manejar finalizaciones automáticas
 */
export function useActiveMeetingMonitor(
  bookingId: string,
  onMeetingEnd?: () => void
) {
  const { data, isLoading } = useMeetingStatus(bookingId, true);

  // Efecto para manejar el final de la reunión
  React.useEffect(() => {
    if (data?.meetingStatus === "COMPLETED" && onMeetingEnd) {
      onMeetingEnd();
    }
  }, [data?.meetingStatus, onMeetingEnd]);

  const formatRemainingTime = (milliseconds?: number) => {
    if (!milliseconds) return "00:00";

    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return {
    meetingStatus: data?.meetingStatus,
    remainingTime: data?.remainingTime,
    formattedTime: formatRemainingTime(data?.remainingTime),
    isActive: data?.meetingStatus === "ACTIVE",
    isEnding: data?.remainingTime && data.remainingTime < 60000, // Menos de 1 minuto
    isLoading,
  };
}

// Import React for useEffect
