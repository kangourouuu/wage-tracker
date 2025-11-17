import React, { useState, useEffect } from 'react';
import styles from './AddEntryModal.module.css';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { CreateWorkEntryDto, Job, WorkEntry } from '../types/work-entry.ts';
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
  const [jobHours, setJobHours] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: jobs, isLoading: isLoadingJobs, isError: isErrorJobs } = useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: () => api.get('/jobs').then(res => res.data),
  });

  const { data: workEntries } = useQuery<WorkEntry[]>({
    queryKey: ['workEntries'],
    queryFn: () => api.get('/work-entries').then(res => res.data),
  });

  // Filter work entries for the selected date
  const entriesForSelectedDate = workEntries?.filter(entry => {
    if (!selectedDate) return false;
    const entryDate = new Date(entry.startTime);
    return (
      entryDate.getFullYear() === selectedDate.getFullYear() &&
      entryDate.getMonth() === selectedDate.getMonth() &&
      entryDate.getDate() === selectedDate.getDate()
    );
  }) || [];

  useEffect(() => {
    if (isOpen && selectedDate) {
      const year = selectedDate.getFullYear();
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const hours = new Date().getHours().toString().padStart(2, '0');
      const minutes = new Date().getMinutes().toString().padStart(2, '0');
      setStartTime(`${year}-${month}-${day}T${hours}:${minutes}`);
      setShowAddForm(false);
    } else if (!isOpen) {
      setStartTime('');
      setSelectedJobIds([]);
      setJobHours({});
      setError(null);
      setShowAddForm(false);
    }
  }, [isOpen, selectedDate]);

  const deleteWorkEntryMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/work-entries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workEntries'] });
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || t('failedToDeleteWorkEntry'));
    },
  });

  const addWorkEntryMutation = useMutation({
    mutationFn: (newEntry: CreateWorkEntryDto) => api.post('/work-entries', newEntry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workEntries'] });
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || t('failedToAddWorkEntry'));
    },
  });

  const handleJobSelection = (jobId: string) => {
    setSelectedJobIds(prev => {
      const newSelectedJobIds = prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId];

      setJobHours(currentHours => {
        const newHours = { ...currentHours };
        if (!newSelectedJobIds.includes(jobId)) {
          delete newHours[jobId];
        } else if (!(jobId in newHours)) {
          newHours[jobId] = '8'; // Default hours
        }
        return newHours;
      });

      return newSelectedJobIds;
    });
  };

  const handleHoursChange = (jobId: string, value: string) => {
    setJobHours(prev => ({ ...prev, [jobId]: value }));
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      deleteWorkEntryMutation.mutate(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedJobIds.length === 0) {
      setError(t('pleaseSelectJob'));
      return;
    }

    if (!startTime || selectedJobIds.some(id => !jobHours[id] || Number(jobHours[id]) <= 0)) {
      setError(t('startTimeAndHoursRequired'));
      return;
    }

    const startDateTime = new Date(startTime);

    const entries: CreateWorkEntryDto[] = selectedJobIds.map(jobId => {
      const hoursWorked = Number(jobHours[jobId]);
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
      const hoursWorked = Number(jobHours[jobId]) || 0;
      if (job) {
        acc.totalHours += hoursWorked;
        acc.totalEarnings += hoursWorked * job.wagePerHour;
      }
      return acc;
    },
    { totalHours: 0, totalEarnings: 0 }
  );

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const calculateHours = (entry: WorkEntry) => {
    const start = new Date(entry.startTime).getTime();
    const end = new Date(entry.endTime).getTime();
    const durationMs = end - start;
    const breakMs = entry.breakDuration * 60 * 1000;
    return ((durationMs - breakMs) / (1000 * 60 * 60)).toFixed(2);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>
          {selectedDate ? `${t('workEntriesFor')} ${selectedDate.toLocaleDateString()}` : t('workEntries')}
        </h2>
        
        {error && <p className={styles.error}>{error}</p>}

        {/* Show existing work entries for the selected date */}
        {entriesForSelectedDate.length > 0 && (
          <div className={styles.existingEntriesSection}>
            <h3 className={styles.sectionTitle}>{t('existingEntries')}</h3>
            <div className={styles.entriesList}>
              {entriesForSelectedDate.map((entry) => (
                <div key={entry.id} className={styles.entryCard}>
                  <div className={styles.entryHeader}>
                    <span className={styles.jobName}>{entry.job.name}</span>
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(entry.id)}
                      disabled={deleteWorkEntryMutation.isPending}
                    >
                      🗑️
                    </button>
                  </div>
                  <div className={styles.entryDetails}>
                    <div className={styles.entryRow}>
                      <span>{t('hours')}:</span>
                      <span>{calculateHours(entry)} hrs</span>
                    </div>
                    <div className={styles.entryRow}>
                      <span>{t('earnings')}:</span>
                      <span>${(parseFloat(calculateHours(entry)) * entry.job.wagePerHour).toFixed(2)}</span>
                    </div>
                    <div className={styles.entryRow}>
                      <span>{t('startTime')}:</span>
                      <span>{formatDate(entry.startTime)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Toggle button to show/hide add form */}
        {!showAddForm && (
          <button
            type="button"
            className={styles.addButton}
            onClick={() => setShowAddForm(true)}
          >
            ➕ {t('addNewEntry')}
          </button>
        )}

        {/* Add new entry form */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <h3 className={styles.sectionTitle}>{t('addWorkEntry')}</h3>
          <div className={styles.formGroup}>
            <label>{t('existedJobs')}:</label>
            {isLoadingJobs && <p>{t('loadingJobs')}</p>}
            {isErrorJobs && <p>{t('errorLoadingJobs')}</p>}
            {jobs && jobs.length > 0 && (
              <div className={styles.jobList}>
                {jobs.map((job) => (
                  <div key={job.id} className={`${styles.jobItemWrapper} ${selectedJobIds.includes(job.id) ? styles.selected : ''}`}>
                    <div
                      className={styles.jobItem}
                      onClick={() => handleJobSelection(job.id)}
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
                    {selectedJobIds.includes(job.id) && (
                      <div className={styles.hourInputContainer}>
                        <label htmlFor={`hours-${job.id}`}>{t('hoursWorked')}:</label>
                        <input
                          id={`hours-${job.id}`}
                          type="number"
                          value={jobHours[job.id] || ''}
                          onChange={(e) => handleHoursChange(job.id, e.target.value)}
                          min="0.1"
                          step="0.1"
                          required
                          className={styles.hourInput}
                          onClick={(e) => e.stopPropagation()} // Prevent job deselection
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {jobs && jobs.length === 0 && <p>{t('noJobsFound')}</p>}
          </div>

          {selectedJobIds.length > 0 && (
            <>
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
            <button type="button" className={styles.cancelButton} onClick={() => setShowAddForm(false)}>
              {t('cancel')}
            </button>
            <button type="submit" className={styles.submitButton} disabled={addWorkEntryMutation.isPending}>
              {addWorkEntryMutation.isPending ? t('submitting') : t('addEntryButton')}
            </button>
          </div>
        </form>
        )}

        {/* Close button */}
        <div className={styles.closeButtonContainer}>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEntryModal;
