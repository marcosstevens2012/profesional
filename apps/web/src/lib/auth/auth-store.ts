import { AuthTokens, AuthUser } from "@profesional/contracts";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: user =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setTokens: tokens =>
        set({
          tokens,
        }),

      setLoading: loading =>
        set({
          isLoading: loading,
        }),

      logout: () =>
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: state => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
