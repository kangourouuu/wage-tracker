
import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkEntryDto } from './create-work-entry.dto';

export class UpdateWorkEntryDto extends PartialType(CreateWorkEntryDto) {}
