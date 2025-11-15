import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EarningsTrendChart } from "../features/analytics/components/EarningsTrendChart";
import { JobDistributionChart } from "../features/analytics/components/JobDistributionChart";
import { WeeklyPatternChart } from "../features/analytics/components/WeeklyPatternChart";
import { SummaryCardWithTrend } from "../features/analytics/components/SummaryCardWithTrend";
import styles from "../features/analytics/pages/Analytics.module.css";

type Period = "day" | "week" | "month" | "year";

// Mock data for demonstration
const mockEarningsTrend = [
  { date: "Mon", hours: 8, earnings: 400, entries: 1 },
  { date: "Tue", hours: 7.5, earnings: 375, entries: 1 },
  { date: "Wed", hours: 9, earnings: 450, entries: 1 },
  { date: "Thu", hours: 8.5, earnings: 425, entries: 1 },
  { date: "Fri", hours: 7, earnings: 350, entries: 1 },
  { date: "Sat", hours: 4, earnings: 200, entries: 1 },
  { date: "Sun", hours: 0, earnings: 0, entries: 0 },
];

const mockJobDistribution = [
  { jobId: "1", jobName: "Software Development", hours: 35, earnings: 1750, entries: 5 },
  { jobId: "2", jobName: "Consulting", hours: 8, earnings: 600, entries: 2 },
  { jobId: "3", jobName: "Code Review", hours: 5, earnings: 250, entries: 1 },
];

const mockWeeklyPattern = [
  { day: "Monday", hours: 8, earnings: 400 },
  { day: "Tuesday", hours: 7.5, earnings: 375 },
  { day: "Wednesday", hours: 9, earnings: 450 },
  { day: "Thursday", hours: 8.5, earnings: 425 },
  { day: "Friday", hours: 7, earnings: 350 },
  { day: "Saturday", hours: 4, earnings: 200 },
  { day: "Sunday", hours: 0, earnings: 0 },
];

const mockSummary = {
  current: {
    totalHours: 44,
    totalEarnings: 2200,
    totalEntries: 10,
    averageEarningsPerEntry: 220,
  },
  trend: {
    hours: 12.5,
    earnings: 15.8,
    entries: 25,
  },
};

export const AnalyticsDemo = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>("month");
  const [summaryPeriod, setSummaryPeriod] = useState<Period>("week");

  return (
    <div className={styles.analyticsContainer}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button 
            onClick={() => navigate('/login')} 
            className={styles.backButton}
            title="Back to Login"
          >
            ← Login
          </button>
          <h1 className={styles.title}>Analytics & Insights (Demo)</h1>
        </div>
        <div className={styles.periodSelector}>
          <label htmlFor="summary-period">Summary Period:</label>
          <select
            id="summary-period"
            value={summaryPeriod}
            onChange={(e) => setSummaryPeriod(e.target.value as Period)}
            className={styles.select}
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </header>

      <>
        {/* Summary Cards */}
        <div className={styles.summarySection}>
          <SummaryCardWithTrend
            title="Total Hours"
            value={mockSummary.current.totalHours.toFixed(2)}
            trend={{
              value: mockSummary.trend.hours,
              isPositive: mockSummary.trend.hours >= 0,
            }}
            icon="⏱️"
          />
          <SummaryCardWithTrend
            title="Total Earnings"
            value={`$${mockSummary.current.totalEarnings.toFixed(2)}`}
            trend={{
              value: mockSummary.trend.earnings,
              isPositive: mockSummary.trend.earnings >= 0,
            }}
            icon="💰"
          />
          <SummaryCardWithTrend
            title="Total Entries"
            value={mockSummary.current.totalEntries.toString()}
            trend={{
              value: mockSummary.trend.entries,
              isPositive: mockSummary.trend.entries >= 0,
            }}
            icon="📝"
          />
          <SummaryCardWithTrend
            title="Avg. Earnings/Entry"
            value={`$${mockSummary.current.averageEarningsPerEntry.toFixed(2)}`}
            icon="📊"
          />
        </div>

        {/* Charts Section */}
        <div className={styles.chartsSection}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
                className={styles.select}
              >
                <option value="day">Last Day</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <EarningsTrendChart data={mockEarningsTrend} />
          </div>

          <div className={styles.chartCard}>
            <JobDistributionChart data={mockJobDistribution} />
          </div>

          <div className={styles.chartCard}>
            <WeeklyPatternChart data={mockWeeklyPattern} />
          </div>
        </div>
      </>
    </div>
  );
};
