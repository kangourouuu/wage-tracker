import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { GetCurrentUserId } from "../../common/decorators/get-current-user-id.decorator";
import { AccessTokenGuard } from "../../common/guards/access-token.guard";
import { RefreshTokenGuard } from "../../common/guards/refresh-token.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  logout(@Body() body?: { userId?: string }) {
    // Make logout optional - frontend can clear local state even if this fails
    if (body?.userId) {
      return this.authService.logout(body.userId);
    }
    return { message: "Logged out successfully" };
  }

  @UseGuards(RefreshTokenGuard)
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  refresh(
    @GetCurrentUserId() userId: string,
    @Body() refreshTokenDto: RefreshTokenDto
  ) {
    return this.authService.refresh(userId, refreshTokenDto.refreshToken);
  }
}
