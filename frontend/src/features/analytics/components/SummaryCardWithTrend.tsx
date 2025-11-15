import styles from './SummaryCardWithTrend.module.css';

interface SummaryCardWithTrendProps {
  title: string;
  value: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: string;
}

export const SummaryCardWithTrend = ({ 
  title, 
  value, 
  trend, 
  icon 
}: SummaryCardWithTrendProps) => (
  <div className={styles.card}>
    <div className={styles.header}>
      <span className={styles.title}>{title}</span>
      {icon && <span className={styles.icon}>{icon}</span>}
    </div>
    <div className={styles.value}>{value}</div>
    {trend && (
      <div className={`${styles.trend} ${trend.isPositive ? styles.positive : styles.negative}`}>
        <span className={styles.arrow}>
          {trend.isPositive ? '↑' : '↓'}
        </span>
        <span className={styles.percentage}>{Math.abs(trend.value)}%</span>
        <span className={styles.label}>vs last period</span>
      </div>
    )}
  </div>
);
