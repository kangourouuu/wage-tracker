import {
  IsArray,
  ValidateNested,
  IsString,
  IsDateString,
  IsUUID,
  IsNumber,
  IsOptional,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

class WorkEntryImport {
  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsUUID()
  jobId: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  breakDuration?: number;
}

export class ConfirmImportDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkEntryImport)
  workEntries: WorkEntryImport[];
}
