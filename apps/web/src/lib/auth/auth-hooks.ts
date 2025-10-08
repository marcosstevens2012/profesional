import {
  ForgotPasswordRequest,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from "@marcosstevens2012/contracts";
import { useCallback, useEffect } from "react";
import { authAPI } from "./auth-api";
import { useAuthStore } from "./auth-store";

export function useAuth() {
  const {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    setUser,
    setTokens,
    setLoading,
    logout: logoutStore,
  } = useAuthStore();

  const register = useCallback(
    async (data: RegisterRequest) => {
      setLoading(true);
      try {
        const response = await authAPI.register(data);
        setUser(response.user);
        setTokens(response.tokens);
        return response;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setTokens, setLoading]
  );

  const login = useCallback(
    async (data: LoginRequest) => {
      setLoading(true);
      try {
        const response = await authAPI.login(data);
        setUser(response.user);
        setTokens(response.tokens);
        return response;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setTokens, setLoading]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      if (tokens?.accessToken) {
        await authAPI.logout(tokens.accessToken);
      }
    } catch (error) {
      // Even if logout API fails, clear local storage
      console.error("Logout API error:", error);
    } finally {
      logoutStore();
      setLoading(false);
    }
  }, [tokens?.accessToken, logoutStore, setLoading]);

  const refreshToken = useCallback(async () => {
    if (!tokens?.refreshToken) return null;

    try {
      const newTokens = await authAPI.refreshToken({
        refreshToken: tokens.refreshToken,
      });
      setTokens(newTokens);
      return newTokens;
    } catch (error) {
      logoutStore();
      throw error;
    }
  }, [tokens?.refreshToken, setTokens, logoutStore]);

  const verifyEmail = useCallback(
    async (data: VerifyEmailRequest): Promise<MessageResponse> => {
      setLoading(true);
      try {
        return await authAPI.verifyEmail(data);
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  const forgotPassword = useCallback(
    async (data: ForgotPasswordRequest): Promise<MessageResponse> => {
      setLoading(true);
      try {
        return await authAPI.forgotPassword(data);
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  const resetPassword = useCallback(
    async (data: ResetPasswordRequest): Promise<MessageResponse> => {
      setLoading(true);
      try {
        return await authAPI.resetPassword(data);
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  const getProfile = useCallback(async () => {
    if (!tokens?.accessToken) return null;

    try {
      return await authAPI.getProfile(tokens.accessToken);
    } catch (error) {
      // If token is invalid, logout
      logoutStore();
      throw error;
    }
  }, [tokens?.accessToken, logoutStore]);

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!tokens?.accessToken || !tokens?.refreshToken) return;

    const checkTokenExpiry = () => {
      try {
        const parts = tokens.accessToken.split(".");
        if (parts.length !== 3 || !parts[1]) return;

        const payload = JSON.parse(atob(parts[1]));
        const expiry = payload.exp * 1000; // Convert to milliseconds
        const timeToExpiry = expiry - Date.now();

        // Refresh if token expires in less than 5 minutes
        if (timeToExpiry < 5 * 60 * 1000 && timeToExpiry > 0) {
          refreshToken().catch(() => {
            // If refresh fails, logout
            logoutStore();
          });
        }
      } catch (error) {
        console.error("Error checking token expiry:", error);
      }
    };

    checkTokenExpiry();
    const interval = setInterval(checkTokenExpiry, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, [tokens?.accessToken, tokens?.refreshToken, refreshToken, logoutStore]);

  return {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
    refreshToken,
    verifyEmail,
    forgotPassword,
    resetPassword,
    getProfile,
  };
}
