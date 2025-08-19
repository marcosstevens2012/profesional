import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";
import { Public } from "../common";
import { AuthService } from "./auth.service";

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post("login")
  @Public()
  @ApiOperation({ summary: "User login" })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    const user = await this._authService.validateUser(
      loginDto.email,
      loginDto.password
    );

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this._authService.login(user);
  }
}
