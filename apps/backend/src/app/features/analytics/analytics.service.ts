import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { WorkEntry } from "../wage/entities/work-entry.entity";

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(WorkEntry)
    private readonly workEntryRepository: Repository<WorkEntry>,
  ) {}

  async getEarningsTrend(
    userId: string,
    period: string = "month",
    startDate?: string,
    endDate?: string,
  ) {
    const { start, end } = this.getDateRange(period, startDate, endDate);

    const entries = await this.workEntryRepository.find({
      where: {
        user: { id: userId },
        startTime: Between(start, end),
      },
      relations: ["job"],
      order: { startTime: "ASC" },
    });

    // Group by date
    const trendData = this.groupByDate(entries, period);
    return trendData;
  }

  async getJobDistribution(
    userId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const { start, end } = this.getDateRange("all", startDate, endDate);

    const entries = await this.workEntryRepository.find({
      where: {
        user: { id: userId },
        ...(startDate && endDate ? { startTime: Between(start, end) } : {}),
      },
      relations: ["job"],
    });

    // Calculate hours and earnings per job
    const jobStats = new Map<
      string,
      {
        jobId: string;
        jobName: string;
        hours: number;
        earnings: number;
        entries: number;
      }
    >();

    entries.forEach((entry) => {
      const hours = this.calculateHours(entry);
      const earnings = hours * entry.job.wagePerHour;

      if (!jobStats.has(entry.job.id)) {
        jobStats.set(entry.job.id, {
          jobId: entry.job.id,
          jobName: entry.job.name,
          hours: 0,
          earnings: 0,
          entries: 0,
        });
      }

      const stats = jobStats.get(entry.job.id)!;
      stats.hours += hours;
      stats.earnings += earnings;
      stats.entries += 1;
    });

    return Array.from(jobStats.values());
  }

  async getWeeklyPattern(userId: string, startDate?: string, endDate?: string) {
    const { start, end } = this.getDateRange("week", startDate, endDate);

    const entries = await this.workEntryRepository.find({
      where: {
        user: { id: userId },
        startTime: Between(start, end),
      },
      relations: ["job"],
      order: { startTime: "ASC" },
    });

    // Group by day of week
    const weekPattern = Array(7)
      .fill(0)
      .map((_, i) => ({
        day: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ][i],
        hours: 0,
        earnings: 0,
      }));

    entries.forEach((entry) => {
      const dayOfWeek = new Date(entry.startTime).getDay();
      const hours = this.calculateHours(entry);
      const earnings = hours * entry.job.wagePerHour;

      weekPattern[dayOfWeek].hours += hours;
      weekPattern[dayOfWeek].earnings += earnings;
    });

    return weekPattern;
  }

  async getSummary(userId: string, period: string = "week", startDate?: string, endDate?: string) {
    const { start, end } = this.getDateRange(period, startDate, endDate);
    const { start: prevStart, end: prevEnd } =
      this.getPreviousPeriodRange(period);

    const currentEntries = await this.workEntryRepository.find({
      where: {
        user: { id: userId },
        startTime: Between(start, end),
      },
      relations: ["job"],
    });

    const previousEntries = await this.workEntryRepository.find({
      where: {
        user: { id: userId },
        startTime: Between(prevStart, prevEnd),
      },
      relations: ["job"],
    });

    const currentStats = this.calculateStats(currentEntries);
    const previousStats = this.calculateStats(previousEntries);

    return {
      current: currentStats,
      previous: previousStats,
      trend: {
        hours: this.calculateTrend(
          currentStats.totalHours,
          previousStats.totalHours,
        ),
        earnings: this.calculateTrend(
          currentStats.totalEarnings,
          previousStats.totalEarnings,
        ),
        entries: this.calculateTrend(
          currentStats.totalEntries,
          previousStats.totalEntries,
        ),
      },
    };
  }

  async getComparison(
    userId: string,
    currentStart: string,
    currentEnd: string,
    previousStart: string,
    previousEnd: string,
  ) {
    const currentEntries = await this.workEntryRepository.find({
      where: {
        user: { id: userId },
        startTime: Between(new Date(currentStart), new Date(currentEnd)),
      },
      relations: ["job"],
    });

    const previousEntries = await this.workEntryRepository.find({
      where: {
        user: { id: userId },
        startTime: Between(new Date(previousStart), new Date(previousEnd)),
      },
      relations: ["job"],
    });

    return {
      current: this.calculateStats(currentEntries),
      previous: this.calculateStats(previousEntries),
    };
  }

  private calculateHours(entry: WorkEntry): number {
    const start = new Date(entry.startTime).getTime();
    const end = new Date(entry.endTime).getTime();
    const durationMs = end - start;
    const breakMs = entry.breakDuration * 60 * 1000;
    return (durationMs - breakMs) / (1000 * 60 * 60);
  }

  private calculateStats(entries: WorkEntry[]) {
    let totalHours = 0;
    let totalEarnings = 0;

    entries.forEach((entry) => {
      const hours = this.calculateHours(entry);
      const earnings = hours * entry.job.wagePerHour;
      totalHours += hours;
      totalEarnings += earnings;
    });

    return {
      totalHours: parseFloat(totalHours.toFixed(2)),
      totalEarnings: parseFloat(totalEarnings.toFixed(2)),
      totalEntries: entries.length,
      averageHoursPerEntry:
        entries.length > 0
          ? parseFloat((totalHours / entries.length).toFixed(2))
          : 0,
      averageEarningsPerEntry:
        entries.length > 0
          ? parseFloat((totalEarnings / entries.length).toFixed(2))
          : 0,
    };
  }

  private calculateTrend(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return parseFloat((((current - previous) / previous) * 100).toFixed(2));
  }

  private getDateRange(
    period: string,
    startDate?: string,
    endDate?: string,
  ): { start: Date; end: Date } {
    if (startDate && endDate) {
      return {
        start: new Date(startDate),
        end: new Date(endDate),
      };
    }

    const now = new Date();
    let start: Date;

    switch (period) {
      case "day":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        break;
      case "month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        start = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        start = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return { start, end: now };
  }

  private getPreviousPeriodRange(period: string): { start: Date; end: Date } {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (period) {
      case "day":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        start = new Date(now);
        start.setDate(now.getDate() - 14);
        end = new Date(now);
        end.setDate(now.getDate() - 7);
        break;
      case "month":
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        start = new Date(now.getFullYear() - 1, 0, 1);
        end = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return { start, end };
  }

  private groupByDate(entries: WorkEntry[], period: string) {
    const grouped = new Map<
      string,
      { date: string; hours: number; earnings: number; entries: number }
    >();

    entries.forEach((entry) => {
      const date = new Date(entry.startTime);
      let key: string;

      if (period === "day") {
        key = date.toISOString().split("T")[0];
      } else if (period === "week") {
        key = date.toISOString().split("T")[0];
      } else if (period === "month") {
        key = date.toISOString().split("T")[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      }

      if (!grouped.has(key)) {
        grouped.set(key, { date: key, hours: 0, earnings: 0, entries: 0 });
      }

      const stats = grouped.get(key)!;
      const hours = this.calculateHours(entry);
      const earnings = hours * entry.job.wagePerHour;

      stats.hours += hours;
      stats.earnings += earnings;
      stats.entries += 1;
    });

    return Array.from(grouped.values()).sort((a, b) =>
      a.date.localeCompare(b.date),
    );
  }
}
