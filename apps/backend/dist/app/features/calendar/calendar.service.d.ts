import { WageService } from '../wage/wage.service';
export declare class CalendarService {
    private readonly wageService;
    constructor(wageService: WageService);
    getWorkEntriesForMonth(userId: string, year: number, month: number): Promise<import("../wage/entities/work-entry.entity").WorkEntry[]>;
}
