import React, { useState, useEffect } from 'react';
import styles from './AddEntryModal.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type { CreateWorkEntryDto } from '../types/work-entry.ts';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({ isOpen, onClose, selectedDate }) => {
  const queryClient = useQueryClient();
  const [startTime, setStartTime] = useState('');
  const [hoursWorked, setHoursWorked] = useState(8); // Default to 8 hours
  const [breakDuration, setBreakDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

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
      setHoursWorked(8);
      setBreakDuration(0);
      setError(null);
    }
  }, [isOpen, selectedDate]);

  const addWorkEntryMutation = useMutation({
    mutationFn: (newEntry: CreateWorkEntryDto) => api.post('/work-entries', newEntry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workEntries'] });
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to add work entry.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!startTime || hoursWorked <= 0) {
      setError('Start time and hours worked are required and must be positive.');
      return;
    }

    const startDateTime = new Date(startTime);
    const endDateTime = new Date(startDateTime.getTime() + (hoursWorked * 60 * 60 * 1000) + (breakDuration * 60 * 1000));

    const newEntry: CreateWorkEntryDto = {
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      breakDuration: breakDuration,
    };

    addWorkEntryMutation.mutate(newEntry);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Add New Work Entry</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.formGroup}>
            <label htmlFor="startTime">Start Time:</label>
            <input
              type="datetime-local"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="hoursWorked">Hours Worked:</label>
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
          <div className={styles.formGroup}>
            <label htmlFor="breakDuration">Break Duration (minutes):</label>
            <input
              type="number"
              id="breakDuration"
              value={breakDuration}
              onChange={(e) => setBreakDuration(Number(e.target.value))}
              min="0"
            />
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton} disabled={addWorkEntryMutation.isPending}>
              {addWorkEntryMutation.isPending ? 'Adding...' : 'Add Entry'}
            </button>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={addWorkEntryMutation.isPending}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEntryModal;
