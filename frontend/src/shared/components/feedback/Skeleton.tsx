import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  count?: number;
}

export const Skeleton = ({ 
  width = '100%', 
  height = '20px',
  variant = 'text',
  count = 1
}: SkeletonProps) => {
  const skeletonClass = `${styles.skeleton} ${styles[variant]}`;
  
  if (count === 1) {
    return (
      <div 
        className={skeletonClass}
        style={{ width, height }}
      />
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className={skeletonClass}
          style={{ width, height, marginBottom: index < count - 1 ? '0.5rem' : 0 }}
        />
      ))}
    </>
  );
};
