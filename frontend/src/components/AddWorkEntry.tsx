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
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const [hours, setHours] = useState('8');
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

    if (!startTime || !hours || Number(hours) <= 0) {
      setError(t('startTimeAndHoursRequired'));
      return;
    }
    if (selectedJobIds.length === 0) {
      setError(t('jobRequired'));
      return;
    }

    const startDateTime = new Date(startTime);
    const hoursWorked = Number(hours);
    
    const entries: CreateWorkEntryDto[] = selectedJobIds.map(jobId => {
      const endDateTime = new Date(startDateTime.getTime() + hoursWorked * 60 * 60 * 1000);
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
  
  const { totalHours, totalEarnings } = selectedJobIds.reduce(
    (acc, jobId) => {
      const job = jobs?.find((j) => j.id === jobId);
      const hoursWorked = Number(hours) || 0;
      if (job) {
        acc.totalHours += hoursWorked;
        acc.totalEarnings += hoursWorked * job.wagePerHour;
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
                  checked={selectedJobIds.includes(job.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedJobIds([...selectedJobIds, job.id]);
                    } else {
                      setSelectedJobIds(selectedJobIds.filter(id => id !== job.id));
                    }
                  }}
                />
                {job.name} (${job.wagePerHour}/hr)
              </label>
            </div>
          ))}
        </div>

        {selectedJobIds.length > 0 && (
          <>
            <div className={styles.formGroup}>
              <label>{t('hoursWorked')}:</label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                min="0.1"
                step="0.1"
                required
                className={styles.hourInput}
              />
            </div>
            <div>
              <p>Total Hours: {totalHours.toFixed(2)}</p>
              <p>Estimated Earnings: {totalEarnings.toFixed(2)}</p>
            </div>
          </>
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
