import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { GetCurrentUserId } from '../../common/decorators/get-current-user-id.decorator';

@Controller('jobs')
@UseGuards(AccessTokenGuard)
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  create(@GetCurrentUserId() userId: string, @Body() createJobDto: CreateJobDto) {
    return this.jobService.create(userId, createJobDto);
  }

  @Get()
  findAll(@GetCurrentUserId() userId: string) {
    return this.jobService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetCurrentUserId() userId: string) {
    return this.jobService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetCurrentUserId() userId: string,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobService.update(id, userId, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetCurrentUserId() userId: string) {
    return this.jobService.remove(id, userId);
  }
}
