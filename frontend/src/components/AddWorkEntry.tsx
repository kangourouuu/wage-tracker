import React, { useState, useEffect } from 'react';
import styles from './AddWorkEntry.module.css';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { CreateWorkEntryDto, Job } from '../types/work-entry.ts';
import { useTranslation } from 'react-i18next';

interface AddWorkEntryProps {
  selectedDate: Date;
  onClose: () => void;
}

const fetchJobs = async (): Promise<Job[]> => {
  const { data } = await api.get('/jobs');
  return data;
};

const AddWorkEntry: React.FC<AddWorkEntryProps> = ({ selectedDate, onClose }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [startTime, setStartTime] = useState('');
  const [selectedJobs, setSelectedJobs] = useState<Record<string, { hours: number }>>({});
  const [error, setError] = useState<string | null>(null);

  const { data: jobs, isLoading: isLoadingJobs, isError: isErrorJobs } = useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  useEffect(() => {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const hours = new Date().getHours().toString().padStart(2, '0');
      const minutes = new Date().getMinutes().toString().padStart(2, '0');
      setStartTime(`${year}-${month}-${day}T${hours}:${minutes}`);
    }
  }, [selectedDate]);

  const addWorkEntryMutation = useMutation({
    mutationFn: (newEntry: CreateWorkEntryDto) => api.post('/work-entries', newEntry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workEntries'] });
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || t('failedToAddWorkEntry'));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!startTime) {
      setError(t('startTimeAndHoursRequired'));
      return;
    }
    if (Object.keys(selectedJobs).length === 0) {
      setError(t('jobRequired'));
      return;
    }

    const startDateTime = new Date(startTime);
    
    const entries: CreateWorkEntryDto[] = Object.entries(selectedJobs).map(([jobId, { hours }]) => {
      const endDateTime = new Date(startDateTime.getTime() + hours * 60 * 60 * 1000);
      return {
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        jobId: jobId,
      };
    });

    try {
      await Promise.all(entries.map(entry => addWorkEntryMutation.mutateAsync(entry)));
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || t('failedToAddWorkEntry'));
    }
  };
  
  const { totalHours, totalEarnings } = Object.entries(selectedJobs).reduce(
    (acc, [jobId, { hours }]) => {
      const job = jobs?.find((j) => j.id === jobId);
      if (job) {
        acc.totalHours += hours;
        acc.totalEarnings += hours * job.wagePerHour;
      }
      return acc;
    },
    { totalHours: 0, totalEarnings: 0 }
  );

  if (isLoadingJobs) return <div>{t('loadingJobs')}</div>;
  if (isErrorJobs) return <div>{t('errorLoadingJobs')}</div>;

  return (
    <div className={styles.addEntryContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('addWorkEntry')}</h2>
        <button onClick={onClose} className={styles.closeButton}>&times;</button>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.formGroup}>
          <label>{t('selectJob')}:</label>
          {jobs?.map((job) => (
            <div key={job.id}>
              <label>
                <input
                  type="checkbox"
                  checked={!!selectedJobs[job.id]}
                  onChange={(e) => {
                    const newSelectedJobs = { ...selectedJobs };
                    if (e.target.checked) {
                      newSelectedJobs[job.id] = { hours: 8 }; // Default hours
                    } else {
                      delete newSelectedJobs[job.id];
                    }
                    setSelectedJobs(newSelectedJobs);
                  }}
                />
                {job.name} (${job.wagePerHour}/hr)
              </label>
              {selectedJobs[job.id] && (
                <input
                  type="number"
                  value={selectedJobs[job.id].hours}
                  onChange={(e) => {
                    const newSelectedJobs = { ...selectedJobs };
                    newSelectedJobs[job.id].hours = Number(e.target.value);
                    setSelectedJobs(newSelectedJobs);
                  }}
                  min="0.1"
                  step="0.1"
                  required
                  className={styles.hourInput}
                />
              )}
            </div>
          ))}
        </div>

        {Object.keys(selectedJobs).length > 0 && (
          <div>
            <p>Total Hours: {totalHours.toFixed(2)}</p>
            <p>Estimated Earnings: {totalEarnings.toFixed(2)}</p>
          </div>
        )}
        
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton} disabled={addWorkEntryMutation.isPending}>
            {addWorkEntryMutation.isPending ? t('submitting') : t('addEntryButton')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWorkEntry;
