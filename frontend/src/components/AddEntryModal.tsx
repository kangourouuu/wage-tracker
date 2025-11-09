import React, { useState, useEffect } from 'react';
import styles from './AddEntryModal.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type { CreateWorkEntryDto } from '../types/work-entry.ts'; // Assuming this DTO exists

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null; // Add selectedDate prop
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({ isOpen, onClose, selectedDate }) => {
  const queryClient = useQueryClient();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [breakDuration, setBreakDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && selectedDate) {
      // Format selectedDate to 'YYYY-MM-DDTHH:mm' for datetime-local input
      const year = selectedDate.getFullYear();
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const hours = new Date().getHours().toString().padStart(2, '0');
      const minutes = new Date().getMinutes().toString().padStart(2, '0');
      setStartTime(`${year}-${month}-${day}T${hours}:${minutes}`);
    } else if (!isOpen) {
      // Reset form fields when modal closes
      setStartTime('');
      setEndTime('');
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

    if (!startTime || !endTime) {
      setError('Start time and End time are required.');
      return;
    }

    const newEntry: CreateWorkEntryDto = {
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
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
            <label htmlFor="endTime">End Time:</label>
            <input
              type="datetime-local"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
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
