import React from 'react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  onAction: () => void;
  title?: string;
  description?: string;
  actionLabel?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  onAction,
  title = "No work entries yet",
  description = "Track your first work day to start seeing analytics and earnings.",
  actionLabel = "Add First Entry"
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.illustration}>
        🚀
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <button onClick={onAction} className={styles.button}>
        {actionLabel}
      </button>
    </div>
  );
};

export default EmptyState;
