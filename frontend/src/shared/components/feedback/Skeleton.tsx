import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export const Skeleton = ({
  width = '100%',
  height = '20px',
  borderRadius = '4px',
  className = ''
}: SkeletonProps) => {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{ width, height, borderRadius }}
      aria-busy="true"
      aria-live="polite"
    />
  );
};

export const SkeletonCard = () => (
  <div className={styles.card}>
    <Skeleton height="120px" borderRadius="12px" />
    <div className={styles.content}>
      <Skeleton height="24px" width="70%" />
      <Skeleton height="16px" width="90%" />
      <Skeleton height="16px" width="60%" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div className={styles.table}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className={styles.row}>
        <Skeleton height="16px" width="30%" />
        <Skeleton height="16px" width="20%" />
        <Skeleton height="16px" width="25%" />
        <Skeleton height="16px" width="15%" />
      </div>
    ))}
  </div>
);
