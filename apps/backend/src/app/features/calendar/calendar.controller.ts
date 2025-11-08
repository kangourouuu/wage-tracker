
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { GetCurrentUserId } from '../../common/decorators/get-current-user-id.decorator';

@Controller('calendar')
@UseGuards(AccessTokenGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get(':year/:month')
  getWorkEntriesForMonth(
    @GetCurrentUserId() userId: string,
    @Param('year') year: string,
    @Param('month') month: string,
  ) {
    return this.calendarService.getWorkEntriesForMonth(
      userId,
      +year,
      +month,
    );
  }
}
