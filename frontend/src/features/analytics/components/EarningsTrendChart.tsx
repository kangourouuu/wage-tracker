import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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

export const EarningsTrendChart = ({ data }: EarningsTrendChartProps) => {
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.title}>Earnings Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="earnings"
            stroke="#8b5cf6"
            strokeWidth={2}
            name="Earnings ($)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="hours"
            stroke="#10b981"
            strokeWidth={2}
            name="Hours"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
