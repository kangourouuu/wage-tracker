import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../../../services/api";
import { SummaryCardWithTrend } from "../components/SummaryCardWithTrend";
import { EarningsTrendChart } from "../components/EarningsTrendChart";
import { JobDistributionChart } from "../components/JobDistributionChart";
import { WeeklyPatternChart } from "../components/WeeklyPatternChart";
import { AnalyticsSkeleton } from "../components/AnalyticsSkeleton";
import { SegmentedControl } from "../../../components/ui/SegmentedControl";
import styles from "./Analytics.module.css";
import type { Period } from "../types/analytics.types";

export const Analytics = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>("week");

  const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["analyticsSummary", period],
    queryFn: async () => {
      const { data } = await analyticsApi.getSummary(period);
      return data;
    },
  });

  const { data: trendData, isLoading: isLoadingTrend } = useQuery({
    queryKey: ["earningsTrend", period],
    queryFn: async () => {
      const { data } = await analyticsApi.getEarningsTrend(period);
      return data;
    },
  });

  const { data: distributionData, isLoading: isLoadingDistribution } = useQuery(
    {
      queryKey: ["jobDistribution", period],
      queryFn: async () => {
        const { data } = await analyticsApi.getJobDistribution(period);
        return data;
      },
    }
  );

  const { data: patternData, isLoading: isLoadingPattern } = useQuery({
    queryKey: ["weeklyPattern", period],
    queryFn: async () => {
      const { data } = await analyticsApi.getWeeklyPattern(period);
      return data;
    },
  });

  const isLoading =
    isLoadingSummary ||
    isLoadingTrend ||
    isLoadingDistribution ||
    isLoadingPattern;

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  const periodOptions = [
    { value: "day", label: t("day", "Day") },
    { value: "week", label: t("week", "Week") },
    { value: "month", label: t("month", "Month") },
    { value: "year", label: t("year", "Year") },
  ];

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button
              onClick={() => navigate("/dashboard")}
              className={styles.backButton}
              aria-label={t("backToDashboard")}
            >
              ←
            </button>
            <h1 className={styles.title}>{t("analytics", "Analytics")}</h1>
          </div>

          <div className={styles.controls}>
            <SegmentedControl
              options={periodOptions}
              value={period}
              onChange={(val) => setPeriod(val as Period)}
            />
          </div>
        </header>

        <div className={styles.content}>
          {/* Summary Cards */}
          <div className={styles.summaryGrid}>
            {summaryData && (
              <>
                <SummaryCardWithTrend
                  title={t("totalHours")}
                  value={summaryData.current.totalHours.toFixed(2)}
                  trend={{
                    value: summaryData.trend.hours,
                    isPositive: summaryData.trend.hours >= 0,
                  }}
                  icon="⏱️"
                />
                <SummaryCardWithTrend
                  title={t("totalEarnings")}
                  value={summaryData.current.totalEarnings.toFixed(2)}
                  trend={{
                    value: summaryData.trend.earnings,
                    isPositive: summaryData.trend.earnings >= 0,
                  }}
                  icon="💰"
                />
                <SummaryCardWithTrend
                  title={t("totalEntries")}
                  value={summaryData.current.totalEntries.toString()}
                  trend={{
                    value: summaryData.trend.entries,
                    isPositive: summaryData.trend.entries >= 0,
                  }}
                  icon="📝"
                />
                <SummaryCardWithTrend
                  title={t("avgHourlyRate")}
                  value={summaryData.current.averageHourlyRate.toFixed(2)}
                  trend={{
                    value: summaryData.trend.rate,
                    isPositive: summaryData.trend.rate >= 0,
                  }}
                  icon="⚡"
                />
              </>
            )}
          </div>

          {/* Charts Grid */}
          <div className={styles.chartsGrid}>
            <div className={styles.trendChart}>
              {trendData && <EarningsTrendChart data={trendData} />}
            </div>

            <div className={styles.secondaryCharts}>
              <div className={styles.chartCard}>
                {distributionData && (
                  <JobDistributionChart data={distributionData} />
                )}
              </div>
              <div className={styles.chartCard}>
                {patternData && <WeeklyPatternChart data={patternData} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
