
import { Injectable } from '@nestjs/common';
import { WageService } from '../wage/wage.service';

@Injectable()
export class CalendarService {
  constructor(private readonly wageService: WageService) {}

  async getWorkEntriesForMonth(
    userId: string,
    year: number,
    month: number,
  ) {
    return this.wageService.findAll(userId, { year, month });
  }
}
