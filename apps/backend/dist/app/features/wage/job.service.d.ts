import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { UserService } from '../user/user.service';
export declare class JobService {
    private readonly jobRepository;
    private readonly userService;
    constructor(jobRepository: Repository<Job>, userService: UserService);
    create(userId: string, createJobDto: CreateJobDto): Promise<Job>;
    findAll(userId: string): Promise<Job[]>;
    findOne(id: string, userId: string): Promise<Job>;
    update(id: string, userId: string, updateJobDto: UpdateJobDto): Promise<Job>;
    remove(id: string, userId: string): Promise<void>;
}
