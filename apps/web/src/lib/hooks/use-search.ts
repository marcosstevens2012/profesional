import { PaginatedResponse, SearchFilters } from "@marcosstevens2012/contracts";
import { useQuery } from "@tanstack/react-query";
import { FrontendProfessional } from "../adapters/professional-adapter";
import { searchAPI, SearchSuggestion } from "../api/search";

// Query keys
export const searchKeys = {
  all: ["search"] as const,
  professionals: (filters: SearchFilters) =>
    [...searchKeys.all, "professionals", filters] as const,
  suggestions: (query: string) =>
    [...searchKeys.all, "suggestions", query] as const,
};

// Hooks
export function useSearchProfessionals(
  filters: SearchFilters,
  enabled: boolean = true
) {
  return useQuery<PaginatedResponse<FrontendProfessional>>({
    queryKey: searchKeys.professionals(filters),
    queryFn: () => searchAPI.searchProfessionals(filters),
    enabled,
  });
}

export function useSearchSuggestions(query: string, enabled: boolean = true) {
  return useQuery<SearchSuggestion[]>({
    queryKey: searchKeys.suggestions(query),
    queryFn: () => searchAPI.getSuggestions(query),
    enabled: enabled && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
