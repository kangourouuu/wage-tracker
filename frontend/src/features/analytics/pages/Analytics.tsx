import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../../../services/api";
import { SummaryCardWithTrend } from "../components/SummaryCardWithTrend";
import { EarningsTrendChart } from "../components/EarningsTrendChart";
import { JobDistributionChart } from "../components/JobDistributionChart";
import { WeeklyPatternChart } from "../components/WeeklyPatternChart";
import { AnalyticsSkeleton } from "../components/AnalyticsSkeleton";
import { SegmentedControl } from "../../../components/ui/SegmentedControl";

import type { Period } from "../types/analytics.types";

export const Analytics = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<Period>("week");
  const [customDateRange, setCustomDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: new Date().toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  const getQueryParams = () => {
    if (period === "custom") {
      return {
        startDate: customDateRange.start,
        endDate: customDateRange.end,
      };
    }
    return {};
  };

  const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["analyticsSummary", period, customDateRange],
    queryFn: async () => {
      const params = getQueryParams();
      const { data } = await analyticsApi.getSummary(
        period,
        params.startDate,
        params.endDate
      );
      return data;
    },
  });

  const { data: trendData, isLoading: isLoadingTrend } = useQuery({
    queryKey: ["earningsTrend", period, customDateRange],
    queryFn: async () => {
      const params = getQueryParams();
      const { data } = await analyticsApi.getEarningsTrend(
        period,
        params.startDate,
        params.endDate
      );
      return data;
    },
  });

  const { data: distributionData, isLoading: isLoadingDistribution } = useQuery(
    {
      queryKey: ["jobDistribution", period, customDateRange],
      queryFn: async () => {
        const params = getQueryParams();
        const { data } = await analyticsApi.getJobDistribution(
          params.startDate,
          params.endDate
        );
        return data;
      },
    }
  );

  const { data: patternData, isLoading: isLoadingPattern } = useQuery({
    queryKey: ["weeklyPattern", period, customDateRange],
    queryFn: async () => {
      const params = getQueryParams();
      const { data } = await analyticsApi.getWeeklyPattern(
        params.startDate,
        params.endDate
      );
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
    { value: "custom", label: t("analytics.custom", "Custom") },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-text-primary">
          {t("analytics", "Analytics")}
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-end sm:items-center">
          {period === "custom" && (
            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg backdrop-blur-sm border border-white/10">
              <input
                type="date"
                value={customDateRange.start}
                onChange={(e) =>
                  setCustomDateRange((prev) => ({
                    ...prev,
                    start: e.target.value,
                  }))
                }
                className="bg-transparent border-none text-sm text-text-primary focus:ring-0 px-2 py-1"
              />
              <span className="text-text-secondary">-</span>
              <input
                type="date"
                value={customDateRange.end}
                onChange={(e) =>
                  setCustomDateRange((prev) => ({
                    ...prev,
                    end: e.target.value,
                  }))
                }
                className="bg-transparent border-none text-sm text-text-primary focus:ring-0 px-2 py-1"
              />
            </div>
          )}
          <div className="w-full md:w-auto">
            <SegmentedControl
              options={periodOptions}
              value={period}
              onChange={(val) => setPeriod(val as Period)}
            />
          </div>
        </div>
      </header>

      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                value={(summaryData.current.averageHourlyRate ?? 0).toFixed(2)}
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
        <div className="space-y-6">
          <div className="w-full">
            {trendData && <EarningsTrendChart data={trendData} />}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="w-full min-w-0">
              {distributionData && (
                <JobDistributionChart data={distributionData} />
              )}
            </div>
            <div className="w-full min-w-0">
              {patternData && <WeeklyPatternChart data={patternData} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
