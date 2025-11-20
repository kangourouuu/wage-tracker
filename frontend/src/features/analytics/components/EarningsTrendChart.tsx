import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import styles from "./EarningsTrendChart.module.css";

interface EarningsTrendChartProps {
  data: Array<{
    date: string;
    hours: number;
    earnings: number;
    entries: number;
  }>;
}

import tooltipStyles from "./ChartTooltip.module.css";

// Custom tooltip for better visualization
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={tooltipStyles.tooltipContainer}>
        <p className={tooltipStyles.label}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className={tooltipStyles.item}>
            <span
              className={tooltipStyles.colorDot}
              style={{ backgroundColor: entry.color }}
            />
            <span style={{ fontWeight: 600 }}>{entry.name}:</span>
            <span className={tooltipStyles.value}>
              {entry.value.toFixed(2)}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const EarningsTrendChart = ({ data }: EarningsTrendChartProps) => {
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.title}>💰 Earnings Trend Over Time</h3>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: "12px", fontWeight: 500 }}
          />
          <YAxis
            yAxisId="left"
            stroke="#8b5cf6"
            style={{ fontSize: "12px", fontWeight: 500 }}
            label={{
              value: "Earnings",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#8b5cf6", fontWeight: 600 },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#10b981"
            style={{ fontSize: "12px", fontWeight: 500 }}
            label={{
              value: "Hours",
              angle: 90,
              position: "insideRight",
              style: { fill: "#10b981", fontWeight: 600 },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="earnings"
            stroke="#8b5cf6"
            strokeWidth={3}
            fill="url(#colorEarnings)"
            name="Earnings"
            animationDuration={1500}
            animationBegin={0}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="hours"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#colorHours)"
            name="Hours"
            animationDuration={1500}
            animationBegin={200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
