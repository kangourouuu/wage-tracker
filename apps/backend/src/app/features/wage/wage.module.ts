
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkEntry } from './entities/work-entry.entity';
import { Job } from './entities/job.entity'; // Import Job entity
import { WageService } from './wage.service';
import { WageController } from './wage.controller';
import { JobService } from './job.service'; // Import JobService
import { JobController } from './job.controller'; // Import JobController
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkEntry, Job]), UserModule],
  providers: [WageService, JobService],
  controllers: [WageController, JobController],
  exports: [WageService, JobService],
})
export class WageModule {}
