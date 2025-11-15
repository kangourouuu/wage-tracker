import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import styles from "./JobDistributionChart.module.css";

interface JobDistributionChartProps {
  data: Array<{
    jobId: string;
    jobName: string;
    hours: number;
    earnings: number;
    entries: number;
  }>;
}

const COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899", "#14b8a6", "#f97316"];

// Custom tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
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
        <p style={{ margin: "0 0 8px 0", fontWeight: "bold", color: "#333", fontSize: "14px" }}>
          {data.name}
        </p>
        <p style={{ margin: "4px 0", color: "#666", fontSize: "13px" }}>
          💰 Earnings: <strong>{data.value.toFixed(2)}</strong>
        </p>
        <p style={{ margin: "4px 0", color: "#666", fontSize: "13px" }}>
          ⏱️ Hours: <strong>{data.hours.toFixed(1)}</strong>
        </p>
      </div>
    );
  }
  return null;
};

export const JobDistributionChart = ({ data }: JobDistributionChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const chartData = data.map((item) => ({
    name: item.jobName,
    value: item.earnings,
    hours: item.hours,
  }));

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.title}>📊 Earnings Distribution by Job</h3>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
            outerRadius={activeIndex !== undefined ? 90 : 100}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            animationBegin={0}
            animationDuration={1200}
            animationEasing="ease-out"
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                style={{ cursor: "pointer", filter: activeIndex === index ? "brightness(1.1)" : "none" }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              fontSize: "13px",
              fontWeight: 600,
            }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
