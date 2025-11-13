import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Job } from "./entities/job.entity";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { UserService } from "../user/user.service";

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, createJobDto: CreateJobDto): Promise<Job> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const job = this.jobRepository.create({ ...createJobDto, user });
    return this.jobRepository.save(job);
  }

  async findAll(userId: string): Promise<Job[]> {
    return this.jobRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: string, userId: string): Promise<Job> {
    const job = await this.jobRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!job) {
      throw new NotFoundException("Job not found");
    }
    return job;
  }

  async update(
    id: string,
    userId: string,
    updateJobDto: UpdateJobDto,
  ): Promise<Job> {
    const job = await this.findOne(id, userId); // Ensures job belongs to user
    Object.assign(job, updateJobDto);
    return this.jobRepository.save(job);
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.jobRepository.delete({
      id,
      user: { id: userId },
    });
    if (result.affected === 0) {
      throw new NotFoundException("Job not found");
    }
  }
}
