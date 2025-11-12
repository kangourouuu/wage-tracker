import React, { useState, useEffect } from 'react';
import styles from './AddEntryModal.module.css';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { CreateWorkEntryDto, Job } from '../types/work-entry.ts';
import { useTranslation } from 'react-i18next';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({ isOpen, onClose, selectedDate }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [startTime, setStartTime] = useState('');
  const [selectedJobs, setSelectedJobs] = useState<Record<string, { hours: number }>>({});
  const [error, setError] = useState<string | null>(null);

  const { data: jobs, isLoading: isLoadingJobs, isError: isErrorJobs } = useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: () => api.get('/jobs').then(res => res.data),
  });

  useEffect(() => {
    if (isOpen && selectedDate) {
      const year = selectedDate.getFullYear();
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const hours = new Date().getHours().toString().padStart(2, '0');
      const minutes = new Date().getMinutes().toString().padStart(2, '0');
      setStartTime(`${year}-${month}-${day}T${hours}:${minutes}`);
    } else if (!isOpen) {
      setStartTime('');
      setSelectedJobs({});
      setError(null);
    }
  }, [isOpen, selectedDate]);

  const addWorkEntryMutation = useMutation({
    mutationFn: (newEntry: CreateWorkEntryDto) => api.post('/work-entries', newEntry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workEntries'] });
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || t('failedToAddWorkEntry'));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!startTime) {
      setError(t('startTimeAndHoursRequired')); // Consider a more specific message
      return;
    }

    if (Object.keys(selectedJobs).length === 0) {
      setError(t('pleaseSelectJob'));
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

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>{t('addWorkEntry')}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.formGroup}>
            <label>{t('job')}:</label>
            {isLoadingJobs && <p>Loading jobs...</p>}
            {isErrorJobs && <p>Error loading jobs.</p>}
            {jobs && jobs.length > 0 && (
              <div>
                {jobs.map((job) => (
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
                      {job.name} ({job.wagePerHour} / hr)
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
            )}
            {jobs && jobs.length === 0 && <p>{t('noJobsFound')}</p>}
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
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={addWorkEntryMutation.isPending}>
              {t('cancelButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEntryModal;
