import React from 'react';
import styles from '../pages/Dashboard.module.css'; // Re-use dashboard styles

interface SummaryCardProps {
  title: string;
  value: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value }) => {
  return (
    <div className={styles.summaryCard}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default SummaryCard;
