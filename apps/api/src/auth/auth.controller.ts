import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
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
} from "@profesional/contracts";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Public } from "../common/decorators/public.decorator";
import { JwtAuthGuard, JwtPayload } from "../common/guards/jwt-auth.guard";
import { AuthService } from "./auth.service";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  async register(@Body() dto: RegisterRequest): Promise<AuthResponse> {
    return this.authService.register(dto);
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginRequest): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  @Public()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() dto: RefreshTokenRequest): Promise<AuthTokens> {
    return this.authService.refreshToken(dto);
  }

  @Public()
  @Post("verify-email")
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() dto: VerifyEmailRequest): Promise<MessageResponse> {
    return this.authService.verifyEmail(dto);
  }

  @Public()
  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() dto: ForgotPasswordRequest
  ): Promise<MessageResponse> {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() dto: ResetPasswordRequest
  ): Promise<MessageResponse> {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: JwtPayload): Promise<MessageResponse> {
    return this.authService.logout(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post("me")
  @HttpCode(HttpStatus.OK)
  async getProfile(@CurrentUser() user: JwtPayload) {
    return {
      user: {
        id: user.sub,
        email: user.email,
        role: user.role,
      },
    };
  }
}
