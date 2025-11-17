import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { analyticsApi } from "../../../services/api";
import { EarningsTrendChart } from "../components/EarningsTrendChart";
import { JobDistributionChart } from "../components/JobDistributionChart";
import { WeeklyPatternChart } from "../components/WeeklyPatternChart";
import { SummaryCardWithTrend } from "../components/SummaryCardWithTrend";
import { AnalyticsSkeleton } from "../components/AnalyticsSkeleton";
import type { TrendData, JobDistribution, WeeklyPattern, SummaryData } from "../types/analytics.types";
import styles from "./Analytics.module.css";
import { useTranslation } from "react-i18next";

type Period = "day" | "week" | "month" | "year";

export const Analytics = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>("month");
  const [summaryPeriod, setSummaryPeriod] = useState<Period>("week");

  const { data: earningsTrend, isLoading: loadingTrend } = useQuery<TrendData[]>({
    queryKey: ["earningsTrend", period],
    queryFn: async () => {
      const { data } = await analyticsApi.getEarningsTrend(period);
      return data;
    },
  });

  const { data: jobDistribution, isLoading: loadingDistribution } = useQuery<JobDistribution[]>({
    queryKey: ["jobDistribution"],
    queryFn: async () => {
      const { data } = await analyticsApi.getJobDistribution();
      return data;
    },
  });

  const { data: weeklyPattern, isLoading: loadingPattern } = useQuery<WeeklyPattern[]>({
    queryKey: ["weeklyPattern"],
    queryFn: async () => {
      const { data } = await analyticsApi.getWeeklyPattern();
      return data;
    },
  });

  const { data: summary, isLoading: loadingSummary } = useQuery<SummaryData>({
    queryKey: ["analyticsSummary", summaryPeriod],
    queryFn: async () => {
      const { data } = await analyticsApi.getSummary(summaryPeriod);
      return data;
    },
  });

  const isLoadingAny = loadingTrend || loadingDistribution || loadingPattern || loadingSummary;

  return (
    <div className={styles.analyticsWrapper}>
      <div className={styles.analyticsContainer}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button 
            onClick={() => navigate('/dashboard')} 
            className={styles.backButton}
            title={t("backToDashboard", "Back to Dashboard")}
          >
            ← {t("dashboard", "Dashboard")}
          </button>
          <h1 className={styles.title}>{t("analytics.title", "Analytics & Insights")}</h1>
        </div>
        <div className={styles.periodSelector}>
          <label htmlFor="summary-period">{t("analytics.summaryPeriod", "Summary Period:")}</label>
          <select
            id="summary-period"
            value={summaryPeriod}
            onChange={(e) => setSummaryPeriod(e.target.value as Period)}
            className={styles.select}
          >
            <option value="day">{t("analytics.today", "Today")}</option>
            <option value="week">{t("analytics.thisWeek", "This Week")}</option>
            <option value="month">{t("analytics.thisMonth", "This Month")}</option>
            <option value="year">{t("analytics.thisYear", "This Year")}</option>
          </select>
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
                  icon="⏱️"
                />
                <SummaryCardWithTrend
                  title={t("analytics.totalEarnings", "Total Earnings")}
                  value={summary.current.totalEarnings.toFixed(2)}
                  trend={{
                    value: summary.trend.earnings,
                    isPositive: summary.trend.earnings >= 0,
                  }}
                  icon="💰"
                />
                <SummaryCardWithTrend
                  title={t("analytics.totalEntries", "Total Entries")}
                  value={summary.current.totalEntries.toString()}
                  trend={{
                    value: summary.trend.entries,
                    isPositive: summary.trend.entries >= 0,
                  }}
                  icon="📝"
                />
                <SummaryCardWithTrend
                  title={t("analytics.avgEarningsPerEntry", "Avg. Earnings/Entry")}
                  value={summary.current.averageEarningsPerEntry.toFixed(2)}
                  icon="📊"
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
                  <option value="day">{t("analytics.lastDay", "Last Day")}</option>
                  <option value="week">{t("analytics.lastWeek", "Last Week")}</option>
                  <option value="month">{t("analytics.lastMonth", "Last Month")}</option>
                  <option value="year">{t("analytics.lastYear", "Last Year")}</option>
                </select>
              </div>
              {earningsTrend && earningsTrend.length > 0 ? (
                <EarningsTrendChart data={earningsTrend} />
              ) : (
                <div className={styles.emptyState}>
                  <p>{t("analytics.noData", "No data available for this period")}</p>
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
                  <p>{t("analytics.noPattern", "No weekly pattern data available")}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
};
