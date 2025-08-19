import { AuthTokens, AuthUser } from "@profesional/contracts";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (_user: AuthUser | null) => void;
  setTokens: (_tokens: AuthTokens | null) => void;
  setLoading: (_loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: _user =>
        set({
          user: _user,
          isAuthenticated: !!_user,
        }),

      setTokens: _tokens =>
        set({
          tokens: _tokens,
        }),

      setLoading: _loading =>
        set({
          isLoading: _loading,
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
