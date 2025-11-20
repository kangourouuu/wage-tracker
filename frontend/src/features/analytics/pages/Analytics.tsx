import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { analyticsApi } from "../../../services/api";
import { EarningsTrendChart } from "../components/EarningsTrendChart";
import { JobDistributionChart } from "../components/JobDistributionChart";
import { WeeklyPatternChart } from "../components/WeeklyPatternChart";
import { SummaryCardWithTrend } from "../components/SummaryCardWithTrend";
import { AnalyticsSkeleton } from "../components/AnalyticsSkeleton";
import type {
  TrendData,
  JobDistribution,
  WeeklyPattern,
  SummaryData,
} from "../types/analytics.types";
import styles from "./Analytics.module.css";
import { useTranslation } from "react-i18next";

type Period = "day" | "week" | "month" | "year" | "custom-day" | "custom-month";

export const Analytics = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>("month");
  const [summaryPeriod, setSummaryPeriod] = useState<Period>("week");

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  const { data: earningsTrend, isLoading: loadingTrend } = useQuery<
    TrendData[]
  >({
    queryKey: ["earningsTrend", period],
    queryFn: async () => {
      const { data } = await analyticsApi.getEarningsTrend(period);
      return data;
    },
  });

  const { data: jobDistribution, isLoading: loadingDistribution } = useQuery<
    JobDistribution[]
  >({
    queryKey: ["jobDistribution", summaryPeriod, selectedDate, selectedMonth],
    queryFn: async () => {
      let startDate: string | undefined;
      let endDate: string | undefined;

      if (summaryPeriod === "custom-day") {
        startDate = new Date(selectedDate).toISOString();
        endDate = new Date(
          new Date(selectedDate).setHours(23, 59, 59, 999)
        ).toISOString();
      } else if (summaryPeriod === "custom-month") {
        const [year, month] = selectedMonth.split("-").map(Number);
        startDate = new Date(year, month - 1, 1).toISOString();
        endDate = new Date(year, month, 0, 23, 59, 59, 999).toISOString();
      } else {
        // For standard periods (day, week, month, year), let backend calculate the range
        // We won't pass startDate/endDate, but we need to ensure the period is used
        // For now, pass undefined to get all data for these periods
        // The backend getJobDistribution doesn't accept a period parameter, only startDate/endDate
        const now = new Date();
        switch (summaryPeriod) {
          case "day":
            startDate = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate()
            ).toISOString();
            endDate = now.toISOString();
            break;
          case "week":
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - 7);
            startDate = weekStart.toISOString();
            endDate = now.toISOString();
            break;
          case "month":
            startDate = new Date(
              now.getFullYear(),
              now.getMonth(),
              1
            ).toISOString();
            endDate = now.toISOString();
            break;
          case "year":
            startDate = new Date(now.getFullYear(), 0, 1).toISOString();
            endDate = now.toISOString();
            break;
        }
      }

      const { data } = await analyticsApi.getJobDistribution(
        startDate,
        endDate
      );
      return data;
    },
  });

  const { data: weeklyPattern, isLoading: loadingPattern } = useQuery<
    WeeklyPattern[]
  >({
    queryKey: ["weeklyPattern", summaryPeriod, selectedDate, selectedMonth],
    queryFn: async () => {
      let startDate: string | undefined;
      let endDate: string | undefined;

      if (summaryPeriod === "custom-day") {
        startDate = new Date(selectedDate).toISOString();
        endDate = new Date(
          new Date(selectedDate).setHours(23, 59, 59, 999)
        ).toISOString();
      } else if (summaryPeriod === "custom-month") {
        const [year, month] = selectedMonth.split("-").map(Number);
        startDate = new Date(year, month - 1, 1).toISOString();
        endDate = new Date(year, month, 0, 23, 59, 59, 999).toISOString();
      } else {
        const now = new Date();
        switch (summaryPeriod) {
          case "day":
            startDate = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate()
            ).toISOString();
            endDate = now.toISOString();
            break;
          case "week":
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - 7);
            startDate = weekStart.toISOString();
            endDate = now.toISOString();
            break;
          case "month":
            startDate = new Date(
              now.getFullYear(),
              now.getMonth(),
              1
            ).toISOString();
            endDate = now.toISOString();
            break;
          case "year":
            startDate = new Date(now.getFullYear(), 0, 1).toISOString();
            endDate = now.toISOString();
            break;
        }
      }

      const { data } = await analyticsApi.getWeeklyPattern(startDate, endDate);
      return data;
    },
  });

  const { data: summary, isLoading: loadingSummary } = useQuery<SummaryData>({
    queryKey: ["analyticsSummary", summaryPeriod, selectedDate, selectedMonth],
    queryFn: async () => {
      let startDate: string | undefined;
      let endDate: string | undefined;

      if (summaryPeriod === "custom-day") {
        startDate = new Date(selectedDate).toISOString();
        endDate = new Date(
          new Date(selectedDate).setHours(23, 59, 59, 999)
        ).toISOString();
      } else if (summaryPeriod === "custom-month") {
        const [year, month] = selectedMonth.split("-").map(Number);
        startDate = new Date(year, month - 1, 1).toISOString();
        endDate = new Date(year, month, 0, 23, 59, 59, 999).toISOString();
      }

      const { data } = await analyticsApi.getSummary(
        summaryPeriod,
        startDate,
        endDate
      );
      return data;
    },
  });

  const isLoadingAny =
    loadingTrend || loadingDistribution || loadingPattern || loadingSummary;

  return (
    <div className={styles.pageWrapper}>
      {/* Analytics Content */}
      <div className={styles.analyticsWrapper}>
        <div className={styles.analyticsContainer}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <button
                onClick={() => navigate("/dashboard")}
                className={styles.backButton}
                title={t("backToDashboard", "Back to Dashboard")}
              >
                ← {t("dashboard", "Dashboard")}
              </button>
              <h1 className={styles.title}>
                {t("analytics.title", "Analytics & Insights")}
              </h1>
            </div>
            <div className={styles.periodSelector}>
              <label htmlFor="summary-period">
                {t("analytics.summaryPeriod", "Summary Period:")}
              </label>
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <select
                  id="summary-period"
                  value={summaryPeriod}
                  onChange={(e) => setSummaryPeriod(e.target.value as any)}
                  className={styles.select}
                >
                  <option value="day">{t("analytics.today", "Today")}</option>
                  <option value="week">
                    {t("analytics.thisWeek", "This Week")}
                  </option>
                  <option value="month">
                    {t("analytics.thisMonth", "This Month")}
                  </option>
                  <option value="year">
                    {t("analytics.thisYear", "This Year")}
                  </option>
                  <option value="custom-day">
                    {t("analytics.customDay", "Custom Day")}
                  </option>
                  <option value="custom-month">
                    {t("analytics.customMonth", "Custom Month")}
                  </option>
                </select>

                {summaryPeriod === "custom-day" && (
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={styles.select}
                    style={{ padding: "0.5rem" }}
                  />
                )}

                {summaryPeriod === "custom-month" && (
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className={styles.select}
                    style={{ padding: "0.5rem" }}
                  />
                )}
              </div>
            </div>
          </header>

          {isLoadingAny ? (
            <AnalyticsSkeleton />
          ) : (
            <>
              {/* Summary Cards */}
              <div className={styles.summarySection}>
                {summary ? (
                  <>
                    <SummaryCardWithTrend
                      title={t("analytics.totalHours", "Total Hours")}
                      value={summary.current.totalHours.toFixed(2)}
                      trend={{
                        value: summary.trend.hours,
                        isPositive: summary.trend.hours >= 0,
                      }}
                    />
                    <SummaryCardWithTrend
                      title={t("analytics.totalEarnings", "Total Earnings")}
                      value={summary.current.totalEarnings.toFixed(2)}
                      trend={{
                        value: summary.trend.earnings,
                        isPositive: summary.trend.earnings >= 0,
                      }}
                    />
                    <SummaryCardWithTrend
                      title={t("analytics.totalEntries", "Total Entries")}
                      value={summary.current.totalEntries.toString()}
                      trend={{
                        value: summary.trend.entries,
                        isPositive: summary.trend.entries >= 0,
                      }}
                    />
                    <SummaryCardWithTrend
                      title={t(
                        "analytics.avgEarningsPerEntry",
                        "Avg. Earnings/Entry"
                      )}
                      value={summary.current.averageEarningsPerEntry.toFixed(2)}
                    />
                  </>
                ) : null}
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
                      <option value="day">
                        {t("analytics.lastDay", "Last Day")}
                      </option>
                      <option value="week">
                        {t("analytics.lastWeek", "Last Week")}
                      </option>
                      <option value="month">
                        {t("analytics.lastMonth", "Last Month")}
                      </option>
                      <option value="year">
                        {t("analytics.lastYear", "Last Year")}
                      </option>
                    </select>
                  </div>
                  {earningsTrend && earningsTrend.length > 0 ? (
                    <EarningsTrendChart data={earningsTrend} />
                  ) : (
                    <div className={styles.emptyState}>
                      <p>
                        {t(
                          "analytics.noData",
                          "No data available for this period"
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <div className={styles.chartCard}>
                  {jobDistribution && jobDistribution.length > 0 ? (
                    <JobDistributionChart data={jobDistribution} />
                  ) : (
                    <div className={styles.emptyState}>
                      <p>{t("analytics.noJobs", "No job data available")}</p>
                    </div>
                  )}
                </div>

                <div className={styles.chartCard}>
                  {weeklyPattern && weeklyPattern.length > 0 ? (
                    <WeeklyPatternChart data={weeklyPattern} />
                  ) : (
                    <div className={styles.emptyState}>
                      <p>
                        {t(
                          "analytics.noPattern",
                          "No weekly pattern data available"
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
