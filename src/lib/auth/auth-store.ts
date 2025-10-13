import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AuthTokens, AuthUser } from "../contracts";
import {
  accessToken,
  clearAllTokens,
  refreshToken,
  setTokens,
} from "../utils/token-utils";

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

// Storage implementation que solo guarda el user en localStorage
// Los tokens se manejan de forma separada y más segura
const userStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(name, value);
  },
  removeItem: (name: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (_user) =>
        set({
          user: _user,
          isAuthenticated: !!_user,
        }),

      setTokens: (_tokens) => {
        // Guardar tokens de forma segura
        if (_tokens) {
          setTokens({
            accessToken: _tokens.accessToken,
            refreshToken: _tokens.refreshToken,
          });
        } else {
          clearAllTokens();
        }

        set({
          tokens: _tokens,
        });
      },

      setLoading: (_loading) =>
        set({
          isLoading: _loading,
        }),

      logout: () => {
        clearAllTokens();
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => userStorage),
      // Solo persistir el usuario, no los tokens
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Al hidratar, recuperar los tokens del storage seguro
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== "undefined") {
          const storedAccessToken = accessToken.get();
          const storedRefreshToken = refreshToken.get();

          if (storedAccessToken && storedRefreshToken) {
            state.tokens = {
              accessToken: storedAccessToken,
              refreshToken: storedRefreshToken,
              expiresIn: 900, // 15 minutos
            };
          }
        }
      },
    }
  )
);
