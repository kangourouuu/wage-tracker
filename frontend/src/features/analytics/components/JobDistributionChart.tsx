import type { FC } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { GlassCard } from "../../../shared/components/ui/GlassCard";
import { useTranslation } from "react-i18next";

interface JobDistributionChartProps {
  data: any[];
  isLoading?: boolean;
}

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#10b981",
  "#f59e0b",
  "#3b82f6",
];

export const JobDistributionChart: FC<JobDistributionChartProps> = ({
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
        {t("dashboard.charts.jobDistribution")}
      </h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="earnings"
              nameKey="jobName"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#f9fafb",
              }}
              formatter={(value: number) => [
                `$${value.toFixed(2)}`,
                "Earnings",
              ]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-text-secondary text-sm ml-1">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
