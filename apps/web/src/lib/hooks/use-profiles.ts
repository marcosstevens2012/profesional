import {
  CreateProfessionalProfileDTO,
  PaginatedResponse,
  ProfessionalProfile,
  UpdateProfessionalProfileDTO,
} from "@profesional/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profilesAPI } from "../api/profiles";
import { useAuthStore } from "../auth/auth-store";

// Query keys
export const profilesKeys = {
  all: ["profiles"] as const,
  lists: () => [...profilesKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...profilesKeys.lists(), filters] as const,
  details: () => [...profilesKeys.all, "detail"] as const,
  detail: (id: string) => [...profilesKeys.details(), id] as const,
  bySlug: (slug: string) => [...profilesKeys.all, "slug", slug] as const,
};

// Hooks
export function useProfiles(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useQuery<PaginatedResponse<ProfessionalProfile>>({
    queryKey: profilesKeys.list(params || {}),
    queryFn: () => profilesAPI.getAllProfiles(params),
  });
}

export function useProfile(id: string | null) {
  return useQuery<ProfessionalProfile>({
    queryKey: profilesKeys.detail(id || ""),
    queryFn: () => profilesAPI.getProfileById(id!),
    enabled: !!id,
  });
}

export function useProfileBySlug(slug: string | null) {
  return useQuery<ProfessionalProfile>({
    queryKey: profilesKeys.bySlug(slug || ""),
    queryFn: () => profilesAPI.getProfileBySlug(slug!),
    enabled: !!slug,
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();
  const { tokens } = useAuthStore();

  return useMutation({
    mutationFn: (data: CreateProfessionalProfileDTO) =>
      profilesAPI.createProfile(data, tokens?.accessToken || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profilesKeys.lists() });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { tokens } = useAuthStore();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProfessionalProfileDTO;
    }) => profilesAPI.updateProfile(id, data, tokens?.accessToken || ""),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: profilesKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: profilesKeys.lists() });
    },
  });
}

export function useDeleteProfile() {
  const queryClient = useQueryClient();
  const { tokens } = useAuthStore();

  return useMutation({
    mutationFn: (id: string) =>
      profilesAPI.deleteProfile(id, tokens?.accessToken || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profilesKeys.lists() });
    },
  });
}
