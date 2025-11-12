import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    logout(userId: string): Promise<import("../user/entities/user.entity").User>;
    refresh(userId: string, refreshTokenDto: RefreshTokenDto): Promise<{
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
}
