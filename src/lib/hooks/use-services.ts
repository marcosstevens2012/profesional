import { useQuery } from "@tanstack/react-query";
import { servicesAPI } from "../api/services";
import { ServiceCategory } from "../contracts";

// Query keys
export const servicesKeys = {
  all: ["services"] as const,
  categories: () => [...servicesKeys.all, "categories"] as const,
};

// Hooks
export function useServiceCategories() {
  return useQuery<ServiceCategory[]>({
    queryKey: servicesKeys.categories(),
    queryFn: servicesAPI.getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
