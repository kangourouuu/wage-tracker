import { User } from '../../user/entities/user.entity';
export declare class Job {
    id: string;
    name: string;
    wagePerHour: number;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
