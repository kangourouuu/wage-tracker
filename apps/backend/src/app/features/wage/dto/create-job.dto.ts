import { IsString, IsNumber, IsNotEmpty, IsPositive } from "class-validator";

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  wagePerHour: number;
}
