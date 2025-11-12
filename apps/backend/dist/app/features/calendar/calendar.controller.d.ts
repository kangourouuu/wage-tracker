import { CalendarService } from './calendar.service';
export declare class CalendarController {
    private readonly calendarService;
    constructor(calendarService: CalendarService);
    getWorkEntriesForMonth(userId: string, year: string, month: string): Promise<import("../wage/entities/work-entry.entity").WorkEntry[]>;
}
