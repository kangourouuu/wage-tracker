import React, { useState, useEffect } from 'react';
import styles from './AddWorkEntry.module.css';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'; // Import useQuery
import api from '../services/api';
import type { CreateWorkEntryDto, Job } from '../types/work-entry.ts'; // Import Job type
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
  const [hoursWorked, setHoursWorked] = useState(8);
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>(undefined); // New state for selected job
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

  useEffect(() => {
    if (jobs && jobs.length > 0 && !selectedJobId) {
      setSelectedJobId(jobs[0].id); // Select the first job by default
    }
  }, [jobs, selectedJobId]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!startTime || hoursWorked <= 0) {
      setError(t('startTimeAndHoursRequired'));
      return;
    }
    if (!selectedJobId) {
      setError(t('jobRequired')); // New error message
      return;
    }

    const startDateTime = new Date(startTime);
    const endDateTime = new Date(startDateTime.getTime() + (hoursWorked * 60 * 60 * 1000));

    const newEntry: CreateWorkEntryDto = {
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      jobId: selectedJobId, // Include selected jobId
    };

    addWorkEntryMutation.mutate(newEntry);
  };

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
          <label htmlFor="jobSelect">{t('selectJob')}:</label>
          <select
            id="jobSelect"
            value={selectedJobId || ''}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className={styles.selectInput} // Add a class for styling
            required
          >
            {jobs?.map((job) => (
              <option key={job.id} value={job.id}>
                {job.name} (${job.wagePerHour}/hr)
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="hoursWorked">{t('hoursWorked')}:</label>
          <input
            type="number"
            id="hoursWorked"
            value={hoursWorked}
            onChange={(e) => setHoursWorked(Number(e.target.value))}
            min="0.1"
            step="0.1"
            required
          />
        </div>
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
