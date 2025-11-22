import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../../../services/api";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import styles from "./MiniAnalytics.module.css";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../../../shared/components/feedback";

export const MiniAnalytics = () => {
  const { t } = useTranslation();
  const { data: trendData, isLoading } = useQuery({
    queryKey: ["earningsTrend", "week"],
    queryFn: async () => {
      const { data } = await analyticsApi.getEarningsTrend("week");
      return data;
    },
  });

  if (isLoading) {
    return (
      <Skeleton
        height="200px"
        width="100%"
        borderRadius="var(--border-radius-md)"
      />
    );
  }

  if (!trendData || trendData.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t("weeklyEarnings", "Weekly Earnings")}</h3>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="miniEarnings" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary-color)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--primary-color)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              itemStyle={{ color: "var(--primary-color)", fontWeight: 600 }}
              formatter={(value: number) => [value.toFixed(2), "Earnings"]}
              labelStyle={{ color: "#666", marginBottom: "0.25rem" }}
            />
            <Area
              type="monotone"
              dataKey="earnings"
              stroke="var(--primary-color)"
              strokeWidth={2}
              fill="url(#miniEarnings)"
            />
            <XAxis dataKey="date" hide={true} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
