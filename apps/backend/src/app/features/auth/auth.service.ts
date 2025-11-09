import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { User } from "../user/entities/user.entity";
import { LoginDto } from "./dto/login.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const userExists = await this.userService.findByEmail(registerDto.email);
    if (userExists) {
      throw new UnauthorizedException("User with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const { password: _password, ...userWithoutPassword } = user;
    const { accessToken, refreshToken } =
      await this.generateTokens(userWithoutPassword);

    await this.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user || !user.password) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const { password: _password, ...userWithoutPassword } = user;
    const { accessToken, refreshToken } =
      await this.generateTokens(userWithoutPassword);

    await this.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  async logout(userId: string) {
    return this.userService.update(userId, { hashedRefreshToken: null });
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException("Access Denied");
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );
    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException("Access Denied");
    }

    const { password: _password, ...userWithoutPassword } = user;
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(userWithoutPassword);

    await this.updateRefreshToken(user.id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: userWithoutPassword,
    };
  }

  private async generateTokens(user: Omit<User, "password">) {
    const payload = { sub: user.id, email: user.email };

    const accessExp = this.configService.getOrThrow<string>("jwt.accessExp");
    const refreshExp = this.configService.getOrThrow<string>("jwt.refreshExp");

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: accessExp as any,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: refreshExp as any,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.update(userId, {
      hashedRefreshToken,
    });
  }
}
