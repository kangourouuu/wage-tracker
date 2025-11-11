"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const job_service_1 = require("../wage/job.service");
let AuthService = class AuthService {
    constructor(userService, jwtService, configService, jobService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.jobService = jobService;
    }
    async register(registerDto) {
        const userExists = await this.userService.findByEmail(registerDto.email);
        if (userExists) {
            throw new common_1.UnauthorizedException("User with this email already exists.");
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.userService.create({
            name: registerDto.name,
            email: registerDto.email,
            password: hashedPassword,
        });
        if (registerDto.jobs && registerDto.jobs.length > 0) {
            for (const jobDto of registerDto.jobs) {
                await this.jobService.create(user.id, jobDto);
            }
        }
        const { password: _password, ...userWithoutPassword } = user;
        const { accessToken, refreshToken } = await this.generateTokens(userWithoutPassword);
        await this.updateRefreshToken(user.id, refreshToken);
        return {
            accessToken,
            refreshToken,
            user: userWithoutPassword,
        };
    }
    async login(loginDto) {
        const user = await this.userService.findByEmail(loginDto.email);
        if (!user || !user.password) {
            throw new common_1.UnauthorizedException("Invalid credentials.");
        }
        const isPasswordMatching = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordMatching) {
            throw new common_1.UnauthorizedException("Invalid credentials.");
        }
        const { password: _password, ...userWithoutPassword } = user;
        const { accessToken, refreshToken } = await this.generateTokens(userWithoutPassword);
        await this.updateRefreshToken(user.id, refreshToken);
        return {
            accessToken,
            refreshToken,
            user: userWithoutPassword,
        };
    }
    async logout(userId) {
        return this.userService.update(userId, { hashedRefreshToken: null });
    }
    async refresh(userId, refreshToken) {
        const user = await this.userService.findById(userId);
        if (!user || !user.hashedRefreshToken) {
            throw new common_1.UnauthorizedException("Access Denied");
        }
        const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
        if (!isRefreshTokenMatching) {
            throw new common_1.UnauthorizedException("Access Denied");
        }
        const { password: _password, ...userWithoutPassword } = user;
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await this.generateTokens(userWithoutPassword);
        await this.updateRefreshToken(user.id, newRefreshToken);
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user: userWithoutPassword,
        };
    }
    async generateTokens(user) {
        const payload = { sub: user.id, email: user.email };
        const accessExp = this.configService.getOrThrow("jwt.accessExp");
        const refreshExp = this.configService.getOrThrow("jwt.refreshExp");
        const refreshSecret = this.configService.getOrThrow("jwt.refreshSecret");
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                expiresIn: accessExp,
            }),
            this.jwtService.signAsync(payload, {
                secret: refreshSecret,
                expiresIn: refreshExp,
            }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userService.update(userId, {
            hashedRefreshToken,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        config_1.ConfigService,
        job_service_1.JobService])
], AuthService);
//# sourceMappingURL=auth.service.js.map