import {
  profilesAPI,
  type CreateAvailabilitySlotDTO,
} from "@/lib/api/profiles";
import { useAuthStore } from "@/lib/auth/auth-store";
import type { UpdateProfessionalProfileDTO } from "@/lib/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Hook to get my professional profile
export function useMyProfile() {
  const { tokens } = useAuthStore();

  return useQuery({
    queryKey: ["my-profile"],
    queryFn: () => {
      if (!tokens?.accessToken) throw new Error("No token available");
      return profilesAPI.getMyProfile(tokens.accessToken);
    },
    enabled: !!tokens?.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to update my profile
export function useUpdateMyProfile() {
  const { tokens } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfessionalProfileDTO) => {
      if (!tokens?.accessToken) throw new Error("No token available");
      return profilesAPI.updateMyProfile(data, tokens.accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      toast.success("Perfil actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar perfil");
    },
  });
}

// Hook to toggle active status
export function useToggleActiveStatus() {
  const { tokens } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!tokens?.accessToken) throw new Error("No token available");
      return profilesAPI.toggleActiveStatus(tokens.accessToken);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["active-status"] });
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      toast.success(
        data.isActive
          ? "Perfil activado - Ahora estás visible para los clientes"
          : "Perfil desactivado - No recibirás nuevas reservas"
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al cambiar estado");
    },
  });
}

// Hook to get active status
export function useActiveStatus() {
  const { tokens } = useAuthStore();

  return useQuery({
    queryKey: ["active-status"],
    queryFn: () => {
      if (!tokens?.accessToken) throw new Error("No token available");
      return profilesAPI.getActiveStatus(tokens.accessToken);
    },
    enabled: !!tokens?.accessToken,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

// === AVAILABILITY HOOKS ===

export function useMyAvailability(params?: {
  type?: "RECURRING" | "ONE_TIME";
  dayOfWeek?: string;
  isActive?: boolean;
  fromDate?: string;
  toDate?: string;
}) {
  const { tokens } = useAuthStore();

  return useQuery({
    queryKey: ["my-availability", params],
    queryFn: () => {
      if (!tokens?.accessToken) throw new Error("No token available");
      return profilesAPI.getMyAvailability(tokens.accessToken, params);
    },
    enabled: !!tokens?.accessToken,
  });
}

export function useCreateAvailabilitySlot() {
  const { tokens } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAvailabilitySlotDTO) => {
      if (!tokens?.accessToken) throw new Error("No token available");
      return profilesAPI.createAvailabilitySlot(data, tokens.accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-availability"] });
      toast.success("Disponibilidad creada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear disponibilidad");
    },
  });
}

export function useUpdateAvailabilitySlot() {
  const { tokens } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      slotId,
      data,
    }: {
      slotId: string;
      data: Partial<CreateAvailabilitySlotDTO>;
    }) => {
      if (!tokens?.accessToken) throw new Error("No token available");
      return profilesAPI.updateAvailabilitySlot(
        slotId,
        data,
        tokens.accessToken
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-availability"] });
      toast.success("Disponibilidad actualizada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar disponibilidad");
    },
  });
}

export function useDeleteAvailabilitySlot() {
  const { tokens } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slotId: string) => {
      if (!tokens?.accessToken) throw new Error("No token available");
      return profilesAPI.deleteAvailabilitySlot(slotId, tokens.accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-availability"] });
      toast.success("Disponibilidad eliminada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar disponibilidad");
    },
  });
}

// === REVIEWS HOOKS ===

export function useMyReviews(params?: {
  page?: number;
  limit?: number;
  rating?: number;
  hasResponse?: boolean;
  orderBy?: "createdAt" | "rating";
  orderDirection?: "asc" | "desc";
}) {
  const { tokens } = useAuthStore();

  return useQuery({
    queryKey: ["my-reviews", params],
    queryFn: () => {
      if (!tokens?.accessToken) throw new Error("No token available");
      return profilesAPI.getMyReviews(tokens.accessToken, params);
    },
    enabled: !!tokens?.accessToken,
  });
}

export function useMyReviewStats() {
  const { tokens } = useAuthStore();

  return useQuery({
    queryKey: ["my-review-stats"],
    queryFn: () => {
      if (!tokens?.accessToken) throw new Error("No token available");
      return profilesAPI.getMyReviewStats(tokens.accessToken);
    },
    enabled: !!tokens?.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRespondToReview() {
  const { tokens } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      response,
    }: {
      reviewId: string;
      response: string;
    }) => {
      if (!tokens?.accessToken) throw new Error("No token available");
      return profilesAPI.respondToReview(
        reviewId,
        response,
        tokens.accessToken
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["my-review-stats"] });
      toast.success("Respuesta publicada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al responder reseña");
    },
  });
}

// === ANALYTICS HOOKS ===

export function useAnalytics(params?: {
  fromDate?: string;
  toDate?: string;
  period?: "day" | "week" | "month" | "year";
}) {
  const { tokens } = useAuthStore();

  return useQuery({
    queryKey: ["analytics", params],
    queryFn: () => {
      if (!tokens?.accessToken) throw new Error("No token available");
      return profilesAPI.getAnalytics(tokens.accessToken, params);
    },
    enabled: !!tokens?.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useBookingStats() {
  const { tokens } = useAuthStore();

  return useQuery({
    queryKey: ["booking-stats"],
    queryFn: () => {
      if (!tokens?.accessToken) throw new Error("No token available");
      return profilesAPI.getBookingStats(tokens.accessToken);
    },
    enabled: !!tokens?.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRevenueStats() {
  const { tokens } = useAuthStore();

  return useQuery({
    queryKey: ["revenue-stats"],
    queryFn: () => {
      if (!tokens?.accessToken) throw new Error("No token available");
      return profilesAPI.getRevenueStats(tokens.accessToken);
    },
    enabled: !!tokens?.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProfileStats() {
  const { tokens } = useAuthStore();

  return useQuery({
    queryKey: ["profile-stats"],
    queryFn: () => {
      if (!tokens?.accessToken) throw new Error("No token available");
      return profilesAPI.getProfileStats(tokens.accessToken);
    },
    enabled: !!tokens?.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
