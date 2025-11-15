import styles from "./AnalyticsSkeleton.module.css";

export const AnalyticsSkeleton = () => {
  return (
    <>
      <div className={styles.summarySkeleton}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`${styles.skeleton} ${styles.cardSkeleton}`} />
        ))}
      </div>
      <div className={styles.chartsSkeleton}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={`${styles.skeleton} ${styles.chartSkeleton}`} />
        ))}
      </div>
    </>
  );
};
