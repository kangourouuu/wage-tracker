import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import styles from "./WeeklyPatternChart.module.css";

interface WeeklyPatternChartProps {
  data: Array<{
    day: string;
    hours: number;
    earnings: number;
  }>;
}

// Custom tooltip for better visualization
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <p style={{ margin: "0 0 8px 0", fontWeight: "bold", color: "#333" }}>
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p
            key={index}
            style={{
              margin: "4px 0",
              color: entry.color,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: entry.color,
                borderRadius: "4px",
              }}
            />
            <span style={{ fontWeight: 600 }}>{entry.name}:</span>
            <span>{entry.value.toFixed(2)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Colors for gradient bars
const getEarningsColor = (value: number, maxValue: number) => {
  const ratio = value / maxValue;
  if (ratio > 0.7) return "#8b5cf6"; // Purple for high earnings
  if (ratio > 0.4) return "#a78bfa"; // Light purple for medium
  return "#c4b5fd"; // Very light purple for low
};

const getHoursColor = (value: number, maxValue: number) => {
  const ratio = value / maxValue;
  if (ratio > 0.7) return "#10b981"; // Green for high hours
  if (ratio > 0.4) return "#34d399"; // Light green for medium
  return "#6ee7b7"; // Very light green for low
};

export const WeeklyPatternChart = ({ data }: WeeklyPatternChartProps) => {
  const maxEarnings = Math.max(...data.map((d) => d.earnings));
  const maxHours = Math.max(...data.map((d) => d.hours));

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.title}>📅 Weekly Work Pattern</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} barGap={8}>
          <defs>
            <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
              <stop offset="100%" stopColor="#c4b5fd" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
              <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="day"
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
          <Bar
            yAxisId="left"
            dataKey="earnings"
            name="Earnings"
            radius={[8, 8, 0, 0]}
            animationDuration={1200}
            animationBegin={0}
          >
            {data.map((entry, index) => (
              <Cell
                key={`earnings-${index}`}
                fill={getEarningsColor(entry.earnings, maxEarnings)}
              />
            ))}
          </Bar>
          <Bar
            yAxisId="right"
            dataKey="hours"
            name="Hours"
            radius={[8, 8, 0, 0]}
            animationDuration={1200}
            animationBegin={200}
          >
            {data.map((entry, index) => (
              <Cell
                key={`hours-${index}`}
                fill={getHoursColor(entry.hours, maxHours)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
