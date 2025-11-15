export interface TrendData {
  date: string;
  hours: number;
  earnings: number;
  entries: number;
}

export interface JobDistribution {
  jobId: string;
  jobName: string;
  hours: number;
  earnings: number;
  entries: number;
}

export interface WeeklyPattern {
  day: string;
  hours: number;
  earnings: number;
}

export interface Stats {
  totalHours: number;
  totalEarnings: number;
  totalEntries: number;
  averageHoursPerEntry: number;
  averageEarningsPerEntry: number;
}

export interface SummaryData {
  current: Stats;
  previous: Stats;
  trend: {
    hours: number;
    earnings: number;
    entries: number;
  };
}

export interface ComparisonData {
  current: Stats;
  previous: Stats;
}
