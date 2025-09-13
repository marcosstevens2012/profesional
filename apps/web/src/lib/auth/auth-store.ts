import { AuthTokens, AuthUser } from "@profesional/contracts";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

// Custom storage implementation that syncs with cookies
const cookieStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null;

    // Get from localStorage first
    const value = localStorage.getItem(name);
    if (value) {
      // Also sync to cookie for middleware access
      document.cookie = `${name}=${value}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
    }
    return value;
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === "undefined") return;

    // Set in both localStorage and cookie
    localStorage.setItem(name, value);
    document.cookie = `${name}=${value}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
  },
  removeItem: (name: string): void => {
    if (typeof window === "undefined") return;

    // Remove from both localStorage and cookie
    localStorage.removeItem(name);
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
};

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
      storage: createJSONStorage(() => cookieStorage),
      partialize: state => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
