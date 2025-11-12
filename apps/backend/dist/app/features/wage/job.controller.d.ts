import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
export declare class JobController {
    private readonly jobService;
    constructor(jobService: JobService);
    create(userId: string, createJobDto: CreateJobDto): Promise<import("./entities/job.entity").Job>;
    findAll(userId: string): Promise<import("./entities/job.entity").Job[]>;
    findOne(id: string, userId: string): Promise<import("./entities/job.entity").Job>;
    update(id: string, userId: string, updateJobDto: UpdateJobDto): Promise<import("./entities/job.entity").Job>;
    remove(id: string, userId: string): Promise<void>;
}
