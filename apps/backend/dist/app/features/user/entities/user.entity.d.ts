import { WorkEntry } from '../../wage/entities/work-entry.entity';
import { Job } from '../../wage/entities/job.entity';
export declare class User {
    id: string;
    name: string;
    email: string;
    password?: string;
    workEntries: WorkEntry[];
    jobs: Job[];
    hashedRefreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
}
