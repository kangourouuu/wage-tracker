
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { WorkEntry } from './entities/work-entry.entity';
import { CreateWorkEntryDto } from './dto/create-work-entry.dto';
import { UpdateWorkEntryDto } from './dto/update-work-entry.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class WageService {
  constructor(
    @InjectRepository(WorkEntry)
    private readonly workEntryRepository: Repository<WorkEntry>,
    private readonly userService: UserService,
  ) {}

  async create(
    userId: string,
    createWorkEntryDto: CreateWorkEntryDto,
  ): Promise<WorkEntry> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const startTime = new Date(createWorkEntryDto.startTime);
    const endTime = new Date(createWorkEntryDto.endTime);
    const breakDuration = createWorkEntryDto.breakDuration || 0;

    const durationInHours =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60) -
      breakDuration / 60;

    const wage = durationInHours * user.wagePerHour;

    const workEntry = this.workEntryRepository.create({
      ...createWorkEntryDto,
      startTime,
      endTime,
      breakDuration,
      wage,
      user,
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

    return this.workEntryRepository.find({ where });
  }

  async findOne(id: string, userId: string): Promise<WorkEntry> {
    const workEntry = await this.workEntryRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!workEntry) {
      throw new NotFoundException('Work entry not found');
    }
    return workEntry;
  }

  async update(
    id: string,
    userId: string,
    updateWorkEntryDto: UpdateWorkEntryDto,
  ): Promise<WorkEntry> {
    const workEntry = await this.findOne(id, userId);
    const user = await this.userService.findById(userId);

    const updatedWorkEntry = { ...workEntry, ...updateWorkEntryDto };

    const startTime = new Date(updatedWorkEntry.startTime);
    const endTime = new Date(updatedWorkEntry.endTime);
    const breakDuration = updatedWorkEntry.breakDuration;

    const durationInHours =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60) -
      breakDuration / 60;

    updatedWorkEntry.wage = durationInHours * user.wagePerHour;

    await this.workEntryRepository.update(id, updatedWorkEntry);

    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.workEntryRepository.delete({
      id,
      user: { id: userId },
    });
    if (result.affected === 0) {
      throw new NotFoundException('Work entry not found');
    }
  }
}
