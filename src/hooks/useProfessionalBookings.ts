import { bookingsAPI } from "@/lib/api/bookings";
import type { AcceptMeetingResponse } from "@/lib/contracts/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook para obtener bookings esperando aceptación del profesional
 */
export function useWaitingBookings() {
  return useQuery({
    queryKey: ["bookings", "professional", "waiting"],
    queryFn: () => bookingsAPI.getWaitingBookings(),
    refetchInterval: 30000, // Refetch cada 30 segundos para estar actualizado
    staleTime: 10000, // Considera los datos obsoletos después de 10 segundos
    retry: (failureCount, error: any) => {
      // No reintentar si es 404 (usuario no es profesional)
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

/**
 * Hook para obtener reuniones pendientes del profesional
 */
export function useProfessionalMeetings() {
  return useQuery({
    queryKey: ["bookings", "professional", "meetings"],
    queryFn: () => bookingsAPI.getProfessionalMeetings(),
    refetchInterval: 30000, // Refetch cada 30 segundos
    staleTime: 10000,
    retry: (failureCount, error: any) => {
      // No reintentar si es 404 (usuario no es profesional)
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

/**
 * Hook para aceptar un booking (profesional)
 */
export function useAcceptMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => bookingsAPI.acceptMeeting(bookingId),
    onSuccess: (data: AcceptMeetingResponse) => {
      // Invalidar y refetch de las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: ["bookings", "professional"],
      });

      // También invalidar notificaciones por si hay cambios
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      // Mostrar mensaje de éxito
      toast.success(data.message || "Consulta aceptada exitosamente");
    },
    onError: (error: any) => {
      console.error("❌ Error al aceptar consulta:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Error al aceptar la consulta";

      toast.error(errorMessage);
    },
  });
}

/**
 * Hook combinado para el dashboard del profesional
 * Obtiene tanto bookings esperando como reuniones pendientes
 */
export function useProfessionalDashboard() {
  const waitingBookings = useWaitingBookings();
  const meetings = useProfessionalMeetings();

  return {
    waitingBookings: waitingBookings.data?.bookings || [],
    waitingCount: waitingBookings.data?.count || 0,
    meetings: meetings.data?.meetings || [],
    meetingsCount: meetings.data?.count || 0,
    isLoading: waitingBookings.isLoading || meetings.isLoading,
    error: waitingBookings.error || meetings.error,
    refetch: () => {
      waitingBookings.refetch();
      meetings.refetch();
    },
  };
}

/**
 * Hook para verificar si el profesional tiene nuevas solicitudes
 * Útil para mostrar badges de notificación
 */
export function useHasNewBookingRequests() {
  const { data, isLoading } = useWaitingBookings();

  return {
    hasNewRequests: (data?.count || 0) > 0,
    newRequestsCount: data?.count || 0,
    isLoading,
  };
}
