import React from 'react';
import styles from './TimeOfDayIcon.module.css'; // Assuming a new CSS module for styling

const TimeOfDayIcon: React.FC = () => {
  const [isDay, setIsDay] = React.useState(true); // Default to day

  React.useEffect(() => {
    const updateIcon = () => {
      const hour = new Date().getHours();
      // Consider day from 6 AM to 6 PM (18:00)
      setIsDay(hour >= 6 && hour < 18);
    };

    updateIcon(); // Set initial icon
    const intervalId = setInterval(updateIcon, 60 * 60 * 1000); // Update every hour

    return () => clearInterval(intervalId); // Cleanup
  }, []);

  return (
    <div className={styles.iconContainer}>
      {isDay ? (
        <svg className={styles.sunIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      ) : (
        <svg className={styles.moonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      )}
    </div>
  );
};

export default TimeOfDayIcon;