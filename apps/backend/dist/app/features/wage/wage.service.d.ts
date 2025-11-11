import { Repository } from 'typeorm';
import { WorkEntry } from './entities/work-entry.entity';
import { CreateWorkEntryDto } from './dto/create-work-entry.dto';
import { UpdateWorkEntryDto } from './dto/update-work-entry.dto';
import { UserService } from '../user/user.service';
import { JobService } from './job.service';
export declare class WageService {
    private readonly workEntryRepository;
    private readonly userService;
    private readonly jobService;
    constructor(workEntryRepository: Repository<WorkEntry>, userService: UserService, jobService: JobService);
    create(userId: string, createWorkEntryDto: CreateWorkEntryDto): Promise<WorkEntry>;
    findAll(userId: string, options?: {
        year?: number;
        month?: number;
    }): Promise<WorkEntry[]>;
    findOne(id: string, userId: string): Promise<WorkEntry>;
    update(id: string, userId: string, updateWorkEntryDto: UpdateWorkEntryDto): Promise<WorkEntry>;
    remove(id: string, userId: string): Promise<void>;
}
