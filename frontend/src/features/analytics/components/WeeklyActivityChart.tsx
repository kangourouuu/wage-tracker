import type { FC } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { GlassCard } from "../../../shared/components/ui/GlassCard";
import { useTranslation } from "react-i18next";

interface WeeklyActivityChartProps {
  data: any[];
  isLoading?: boolean;
}

export const WeeklyActivityChart: FC<WeeklyActivityChartProps> = ({
  data,
  isLoading,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return <GlassCard className="h-[350px] animate-pulse" children={null} />;
  }

  return (
    <GlassCard className="h-[350px] flex flex-col">
      <h3 className="text-lg font-semibold mb-4">
        {t("dashboard.charts.weeklyActivity")}
      </h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => val.slice(0, 3)}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#f9fafb",
              }}
            />
            <Bar
              dataKey="earnings"
              fill="#8b5cf6"
              name={t("dashboard.charts.earnings")}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="hours"
              fill="#10b981"
              name={t("dashboard.charts.hours")}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
