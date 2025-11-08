
import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { WageModule } from '../wage/wage.module';

@Module({
  imports: [WageModule],
  providers: [CalendarService],
  controllers: [CalendarController],
})
export class CalendarModule {}
