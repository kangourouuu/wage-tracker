import { User } from '../../user/entities/user.entity';
import { Job } from './job.entity';
export declare class WorkEntry {
    id: string;
    startTime: Date;
    endTime: Date;
    breakDuration: number;
    job: Job;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
