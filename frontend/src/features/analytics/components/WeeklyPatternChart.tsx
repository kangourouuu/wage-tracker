import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./WeeklyPatternChart.module.css";

interface WeeklyPatternChartProps {
  data: Array<{
    day: string;
    hours: number;
    earnings: number;
  }>;
}

export const WeeklyPatternChart = ({ data }: WeeklyPatternChartProps) => {
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.title}>Weekly Pattern</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="earnings" fill="#8b5cf6" name="Earnings" />
          <Bar yAxisId="right" dataKey="hours" fill="#10b981" name="Hours" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
