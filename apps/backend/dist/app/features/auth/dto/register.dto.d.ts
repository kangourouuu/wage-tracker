declare class JobDto {
    name: string;
    wagePerHour: number;
}
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    jobs: JobDto[];
}
export {};
