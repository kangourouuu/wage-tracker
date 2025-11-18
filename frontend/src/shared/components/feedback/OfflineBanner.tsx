import styles from './OfflineBanner.module.css';

export const OfflineBanner = () => {
  return (
    <div className={styles.banner} role="alert" aria-live="polite">
      <span className={styles.icon}>📡</span>
      <span className={styles.message}>You're offline. Changes will sync when you reconnect.</span>
    </div>
  );
};
