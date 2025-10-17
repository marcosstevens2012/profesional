import { bookingsAPI } from "@/lib/api/bookings";
import type { BookingView } from "@/lib/contracts/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook para obtener todos los bookings del cliente
 */
export function useClientBookings() {
  return useQuery({
    queryKey: ["bookings", "client", "my-bookings"],
    queryFn: () => bookingsAPI.getClientBookings(),
    refetchInterval: 30000, // Refetch cada 30 segundos
    staleTime: 10000,
  });
}

/**
 * Hook que devuelve los bookings del cliente agrupados por estado
 */
export function useClientBookingsGrouped() {
  const { data, isLoading, error, refetch } = useClientBookings();

  return {
    grouped: data?.grouped || {
      pending_payment: [],
      waiting_acceptance: [],
      confirmed: [],
      in_progress: [],
      completed: [],
      cancelled: [],
    },
    allBookings: data?.bookings || [],
    totalCount: data?.count || 0,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook para crear pago de un booking
 */
export function useCreateBookingPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) =>
      bookingsAPI.createBookingPayment(bookingId),
    onSuccess: (data) => {
      // Invalidar bookings del cliente
      queryClient.invalidateQueries({
        queryKey: ["bookings", "client"],
      });

      toast.success("Pago iniciado correctamente");

      // Si hay init_point, redirigir al checkout de MercadoPago
      if (data.init_point) {
        window.location.href = data.init_point;
      }
    },
    onError: (error: any) => {
      console.error("❌ Error al crear pago:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Error al procesar el pago";

      toast.error(errorMessage);
    },
  });
}

/**
 * Hook para obtener bookings por estado específico
 */
export function useBookingsByStatus(status: string) {
  const { grouped, isLoading, error } = useClientBookingsGrouped();

  const getBookingsByStatus = (status: string): BookingView[] => {
    switch (status) {
      case "PENDING_PAYMENT":
        return grouped.pending_payment;
      case "WAITING_FOR_PROFESSIONAL":
        return grouped.waiting_acceptance;
      case "CONFIRMED":
        return grouped.confirmed;
      case "IN_PROGRESS":
        return grouped.in_progress;
      case "COMPLETED":
        return grouped.completed;
      case "CANCELLED":
        return grouped.cancelled;
      default:
        return [];
    }
  };

  return {
    bookings: getBookingsByStatus(status),
    count: getBookingsByStatus(status).length,
    isLoading,
    error,
  };
}

/**
 * Hook para obtener estadísticas de bookings del cliente
 */
export function useClientBookingStats() {
  const { grouped, totalCount, isLoading } = useClientBookingsGrouped();

  const stats = {
    total: totalCount,
    pendingPayment: grouped.pending_payment.length,
    waitingAcceptance: grouped.waiting_acceptance.length,
    confirmed: grouped.confirmed.length,
    inProgress: grouped.in_progress.length,
    completed: grouped.completed.length,
    cancelled: grouped.cancelled.length,

    // Cálculos útiles
    active: grouped.confirmed.length + grouped.in_progress.length,
    pending: grouped.pending_payment.length + grouped.waiting_acceptance.length,
  };

  return {
    stats,
    isLoading,
  };
}

/**
 * Hook para verificar si el cliente tiene reuniones próximas
 */
export function useUpcomingMeetings() {
  const { grouped, isLoading } = useClientBookingsGrouped();

  // Reuniones que están confirmadas o en progreso
  const upcomingMeetings = [...grouped.confirmed, ...grouped.in_progress].sort(
    (a, b) =>
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );

  return {
    upcomingMeetings,
    hasUpcoming: upcomingMeetings.length > 0,
    nextMeeting: upcomingMeetings[0] || null,
    count: upcomingMeetings.length,
    isLoading,
  };
}
