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
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const [hours, setHours] = useState('8');
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
      setSelectedJobIds([]);
      setHours('8');
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

    if (!startTime || !hours || Number(hours) <= 0) {
      setError(t('startTimeAndHoursRequired'));
      return;
    }

    if (selectedJobIds.length === 0) {
      setError(t('pleaseSelectJob'));
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

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>{t('addWorkEntry')}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.formGroup}>
            <label>{t('existedJobs')}:</label>
            {isLoadingJobs && <p>Loading jobs...</p>}
            {isErrorJobs && <p>Error loading jobs.</p>}
            {jobs && jobs.length > 0 && (
              <div className={styles.jobList}>
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className={`${styles.jobItem} ${selectedJobIds.includes(job.id) ? styles.selected : ''}`}
                    onClick={() => {
                      if (selectedJobIds.includes(job.id)) {
                        setSelectedJobIds(selectedJobIds.filter(id => id !== job.id));
                      } else {
                        setSelectedJobIds([...selectedJobIds, job.id]);
                      }
                    }}
                  >
                    <label>
                      <input
                        type="checkbox"
                        className={styles.customCheckbox}
                        checked={selectedJobIds.includes(job.id)}
                        readOnly
                      />
                      <span />
                      {job.name} ({job.wagePerHour} / hr)
                    </label>
                  </div>
                ))}
              </div>
            )}
            {jobs && jobs.length === 0 && <p>{t('noJobsFound')}</p>}
          </div>

          {selectedJobIds.length > 0 && (
            <>
              <div className={`${styles.formGroup} ${styles.hourInputContainer}`}>
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
              <div className={styles.summarySection}>
                <div className={styles.summaryItem}>
                  <h4>{t('totalHours')}</h4>
                  <p>{totalHours.toFixed(2)}</p>
                </div>
                <div className={styles.summaryItem}>
                  <h4>{t('estimatedEarnings')}</h4>
                  <p>{totalEarnings.toFixed(2)}</p>
                </div>
              </div>
            </>
          )}

          <div className={styles.buttonGroup}>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={addWorkEntryMutation.isPending}>
              {t('cancelButton')}
            </button>
            <button type="submit" className={styles.submitButton} disabled={addWorkEntryMutation.isPending}>
              {addWorkEntryMutation.isPending ? t('submitting') : t('addEntryButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEntryModal;
