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

const COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899"];

export const JobDistributionChart = ({ data }: JobDistributionChartProps) => {
  const chartData = data.map((item) => ({
    name: item.jobName,
    value: item.earnings,
    hours: item.hours,
  }));

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.title}>Earnings by Job</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
