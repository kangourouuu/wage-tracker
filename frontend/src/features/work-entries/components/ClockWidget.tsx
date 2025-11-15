import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Job } from '../../../types/work-entry';
import api from '../../../services/api';
import styles from './ClockWidget.module.css';
import { useTranslation } from 'react-i18next';
import { showSuccessToast, showErrorToast } from '../../../shared/utils';

interface OngoingEntry {
  id: string;
  jobId: string;
  job: Job;
  startTime: Date;
  breakDuration: number;
}

export const ClockWidget = () => {
  const { t } = useTranslation();
  const [ongoingEntry, setOngoingEntry] = useState<OngoingEntry | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedJobId, setSelectedJobId] = useState<string>('');

  const { data: jobs } = useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data } = await api.get('/jobs');
      return data;
    },
  });

  // Check for ongoing entry on mount
  useEffect(() => {
    const checkOngoingEntry = async () => {
      try {
        const { data } = await api.get('/work-entries/ongoing');
        if (data) {
          setOngoingEntry(data);
        }
      } catch (error) {
        // No ongoing entry
      }
    };
    checkOngoingEntry();
  }, []);

  // Update elapsed time
  useEffect(() => {
    if (!ongoingEntry) return;

    const interval = setInterval(() => {
      const start = new Date(ongoingEntry.startTime).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [ongoingEntry]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClockIn = async () => {
    if (!selectedJobId) {
      showErrorToast({ message: t('pleaseSelectJob') });
      return;
    }

    try {
      const { data } = await api.post('/work-entries/clock-in', {
        jobId: selectedJobId,
        startTime: new Date().toISOString(),
      });
      setOngoingEntry(data);
      showSuccessToast('Clocked in successfully!');
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleClockOut = async () => {
    if (!ongoingEntry) return;

    try {
      await api.post(`/work-entries/${ongoingEntry.id}/clock-out`, {
        endTime: new Date().toISOString(),
        breakDuration: ongoingEntry.breakDuration || 0,
      });
      setOngoingEntry(null);
      setElapsedTime(0);
      showSuccessToast('Clocked out successfully!');
      
      // Invalidate work entries query
      window.location.reload(); // Temporary - should use queryClient.invalidateQueries
    } catch (error) {
      showErrorToast(error);
    }
  };

  if (ongoingEntry) {
    return (
      <div className={`${styles.widget} ${styles.active}`}>
        <div className={styles.header}>
          <span className={styles.status}>
            <span className={styles.pulse}></span>
            Currently Working
          </span>
          <span className={styles.jobName}>{ongoingEntry.job.name}</span>
        </div>
        <div className={styles.timer}>{formatTime(elapsedTime)}</div>
        <button className={styles.clockOutBtn} onClick={handleClockOut}>
          Clock Out
        </button>
      </div>
    );
  }

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <span className={styles.title}>Quick Clock In</span>
      </div>
      <select
        value={selectedJobId}
        onChange={(e) => setSelectedJobId(e.target.value)}
        className={styles.select}
      >
        <option value="">{t('pleaseSelectJob')}</option>
        {jobs?.map((job) => (
          <option key={job.id} value={job.id}>
            {job.name}
          </option>
        ))}
      </select>
      <button 
        className={styles.clockInBtn} 
        onClick={handleClockIn}
        disabled={!selectedJobId}
      >
        Clock In
      </button>
    </div>
  );
};
