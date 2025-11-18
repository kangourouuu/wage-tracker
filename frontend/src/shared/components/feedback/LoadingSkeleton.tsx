import styles from './LoadingSkeleton.module.css';

interface LoadingSkeletonProps {
  variant?: 'text' | 'card' | 'circle' | 'rect';
  width?: string;
  height?: string;
  count?: number;
}

export const LoadingSkeleton = ({
  variant = 'text',
  width,
  height,
  count = 1
}: LoadingSkeletonProps) => {
  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`${styles.skeleton} ${styles[variant]}`}
      style={{ width, height }}
    />
  ));

  return <>{skeletons}</>;
};
