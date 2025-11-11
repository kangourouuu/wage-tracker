import { UserService } from "../user/user.service";
import { RegisterDto } from "./dto/register.dto";
import { JwtService } from "@nestjs/jwt";
import { User } from "../user/entities/user.entity";
import { LoginDto } from "./dto/login.dto";
import { ConfigService } from "@nestjs/config";
import { JobService } from "../wage/job.service";
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly configService;
    private readonly jobService;
    constructor(userService: UserService, jwtService: JwtService, configService: ConfigService, jobService: JobService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            workEntries: import("../wage/entities/work-entry.entity").WorkEntry[];
            jobs: import("../wage/entities/job.entity").Job[];
            hashedRefreshToken?: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            workEntries: import("../wage/entities/work-entry.entity").WorkEntry[];
            jobs: import("../wage/entities/job.entity").Job[];
            hashedRefreshToken?: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    logout(userId: string): Promise<User>;
    refresh(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            workEntries: import("../wage/entities/work-entry.entity").WorkEntry[];
            jobs: import("../wage/entities/job.entity").Job[];
            hashedRefreshToken?: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    private generateTokens;
    private updateRefreshToken;
}
