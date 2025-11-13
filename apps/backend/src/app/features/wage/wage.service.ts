import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { WorkEntry } from "./entities/work-entry.entity";
import { CreateWorkEntryDto } from "./dto/create-work-entry.dto";
import { UpdateWorkEntryDto } from "./dto/update-work-entry.dto";
import { UserService } from "../user/user.service";
import { JobService } from "./job.service"; // Import JobService

@Injectable()
export class WageService {
  constructor(
    @InjectRepository(WorkEntry)
    private readonly workEntryRepository: Repository<WorkEntry>,
    private readonly userService: UserService,
    private readonly jobService: JobService, // Inject JobService
  ) {}

  async create(
    userId: string,
    createWorkEntryDto: CreateWorkEntryDto,
  ): Promise<WorkEntry> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const job = await this.jobService.findOne(createWorkEntryDto.jobId, userId); // Find the job
    if (!job) {
      throw new NotFoundException("Job not found");
    }

    const startTime = new Date(createWorkEntryDto.startTime);
    const endTime = new Date(createWorkEntryDto.endTime);

    const workEntry = this.workEntryRepository.create({
      ...createWorkEntryDto,
      startTime,
      endTime,
      job, // Assign the job entity
      user,
      breakDuration: createWorkEntryDto.breakDuration || 0, // Add breakDuration with a default of 0
    });

    return this.workEntryRepository.save(workEntry);
  }

  async findAll(
    userId: string,
    options?: { year?: number; month?: number },
  ): Promise<WorkEntry[]> {
    const where: any = { user: { id: userId } };

    if (options?.year && options?.month) {
      const startDate = new Date(options.year, options.month - 1, 1);
      const endDate = new Date(options.year, options.month, 0);
      where.startTime = Between(startDate, endDate);
    }

    return this.workEntryRepository.find({ where, relations: ["job"] }); // Load job relation
  }

  async findOne(id: string, userId: string): Promise<WorkEntry> {
    const workEntry = await this.workEntryRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ["job"], // Load job relation
    });
    if (!workEntry) {
      throw new NotFoundException("Work entry not found");
    }
    return workEntry;
  }

  async update(
    id: string,
    userId: string,
    updateWorkEntryDto: UpdateWorkEntryDto,
  ): Promise<WorkEntry> {
    const workEntry = await this.findOne(id, userId); // This already loads job
    const user = await this.userService.findById(userId);

    const updatedWorkEntry = { ...workEntry, ...updateWorkEntryDto };

    let job = workEntry.job;
    if (updateWorkEntryDto.jobId) {
      job = await this.jobService.findOne(updateWorkEntryDto.jobId, userId);
      if (!job) {
        throw new NotFoundException("Job not found");
      }
      updatedWorkEntry.job = job;
    }

    const startTime = new Date(updatedWorkEntry.startTime);
    const endTime = new Date(updatedWorkEntry.endTime);

    // Recalculate wage based on the (potentially new) job's wagePerHour
    // This part needs to be updated to consider breakDuration
    // For now, I'll just update the workEntryRepository.update call
    await this.workEntryRepository.update(id, {
      ...updatedWorkEntry,
      breakDuration: updateWorkEntryDto.breakDuration,
    });

    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.workEntryRepository.delete({
      id,
      user: { id: userId },
    });
    if (result.affected === 0) {
      throw new NotFoundException("Work entry not found");
    }
  }
}
