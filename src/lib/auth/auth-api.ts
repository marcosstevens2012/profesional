import {
  AuthResponse,
  AuthTokens,
  ForgotPasswordRequest,
  LoginRequest,
  MessageResponse,
  RefreshTokenRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from "../contracts";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

class AuthAPI {
  private baseUrl = `${API_BASE_URL}/auth`;

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error en el registro");
    }

    return response.json();
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error en el inicio de sesión");
    }

    return response.json();
  }

  async refreshToken(data: RefreshTokenRequest): Promise<AuthTokens> {
    const response = await fetch(`${this.baseUrl}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al renovar token");
    }

    return response.json();
  }

  async verifyEmail(data: VerifyEmailRequest): Promise<MessageResponse> {
    const response = await fetch(`${this.baseUrl}/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al verificar email");
    }

    return response.json();
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<MessageResponse> {
    const response = await fetch(`${this.baseUrl}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Error al soliconsultar restablecimiento"
      );
    }

    return response.json();
  }

  async resetPassword(data: ResetPasswordRequest): Promise<MessageResponse> {
    const response = await fetch(`${this.baseUrl}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al restablecer contraseña");
    }

    return response.json();
  }

  async logout(accessToken: string): Promise<MessageResponse> {
    const response = await fetch(`${this.baseUrl}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al cerrar sesión");
    }

    return response.json();
  }

  async getProfile(accessToken: string) {
    const response = await fetch(`${this.baseUrl}/me`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener perfil");
    }

    return response.json();
  }
}

export const authAPI = new AuthAPI();
