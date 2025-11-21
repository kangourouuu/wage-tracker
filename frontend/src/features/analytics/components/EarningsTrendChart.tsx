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

import { useChartTheme } from "../hooks/useChartTheme";

export const EarningsTrendChart = ({ data }: EarningsTrendChartProps) => {
  const theme = useChartTheme();

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.title}>💰 Earnings Trend Over Time</h3>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={theme.earnings.fill}
                stopOpacity={theme.earnings.gradientStart}
              />
              <stop
                offset="95%"
                stopColor={theme.earnings.fill}
                stopOpacity={theme.earnings.gradientEnd}
              />
            </linearGradient>
            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={theme.hours.fill}
                stopOpacity={theme.hours.gradientStart}
              />
              <stop
                offset="95%"
                stopColor={theme.hours.fill}
                stopOpacity={theme.hours.gradientEnd}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis
            dataKey="date"
            stroke={theme.text}
            style={{ fontSize: "12px", fontWeight: 500 }}
          />
          <YAxis
            yAxisId="left"
            stroke={theme.earnings.stroke}
            style={{ fontSize: "12px", fontWeight: 500 }}
            label={{
              value: "Earnings",
              angle: -90,
              position: "insideLeft",
              style: { fill: theme.earnings.stroke, fontWeight: 600 },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={theme.hours.stroke}
            style={{ fontSize: "12px", fontWeight: 500 }}
            label={{
              value: "Hours",
              angle: 90,
              position: "insideRight",
              style: { fill: theme.hours.stroke, fontWeight: 600 },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              fontSize: "14px",
              fontWeight: 600,
              color: theme.text,
            }}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="earnings"
            stroke={theme.earnings.stroke}
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
            stroke={theme.hours.stroke}
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
