import {
  IsDateString,
  IsUUID,
  IsNumber,
  IsOptional,
  Min,
} from "class-validator";

export class CreateWorkEntryDto {
  @IsDateString()
  startTime: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsUUID()
  jobId: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  breakDuration?: number; // in minutes
}
