
import { IsDateString, IsUUID, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateWorkEntryDto {
  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsUUID()
  jobId: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  breakDuration?: number; // in minutes
}
