import { WageService } from './wage.service';
import { CreateWorkEntryDto } from './dto/create-work-entry.dto';
import { UpdateWorkEntryDto } from './dto/update-work-entry.dto';
export declare class WageController {
    private readonly wageService;
    constructor(wageService: WageService);
    create(userId: string, createWorkEntryDto: CreateWorkEntryDto): Promise<import("./entities/work-entry.entity").WorkEntry>;
    findAll(userId: string): Promise<import("./entities/work-entry.entity").WorkEntry[]>;
    findOne(id: string, userId: string): Promise<import("./entities/work-entry.entity").WorkEntry>;
    update(id: string, userId: string, updateWorkEntryDto: UpdateWorkEntryDto): Promise<import("./entities/work-entry.entity").WorkEntry>;
    remove(id: string, userId: string): Promise<void>;
}
