
import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateWorkEntryDto {
  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsNumber()
  @IsOptional()
  breakDuration?: number;
}
