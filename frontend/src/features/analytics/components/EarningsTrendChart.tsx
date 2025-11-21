import type { FC } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { GlassCard } from "../../../shared/components/ui/GlassCard";
import { useTranslation } from "react-i18next";

interface EarningsTrendChartProps {
  data: any[];
  isLoading?: boolean;
}

export const EarningsTrendChart: FC<EarningsTrendChartProps> = ({
  data,
  isLoading,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return <GlassCard className="h-[400px] animate-pulse" children={null} />;
  }

  return (
    <GlassCard className="h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold mb-6">
        {t("dashboard.charts.earningsTrend")}
      </h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}h`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#f9fafb",
              }}
              itemStyle={{ color: "#f9fafb" }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="earnings"
              stroke="#8b5cf6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorEarnings)"
              name={t("dashboard.charts.earnings")}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="hours"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorHours)"
              name={t("dashboard.charts.hours")}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
