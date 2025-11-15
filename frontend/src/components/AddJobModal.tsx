import React, { useState, useEffect } from 'react';
import styles from './AddJobModal.module.css';
import { useTranslation } from 'react-i18next';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; wagePerHour: number }) => void;
  isLoading: boolean;
}

const AddJobModal: React.FC<AddJobModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [wagePerHour, setWagePerHour] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setWagePerHour('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const wage = parseFloat(wagePerHour);
    if (!name.trim()) {
      setError(t('invalidJobData') || 'Please enter a job name');
      return;
    }
    if (isNaN(wage) || wage <= 0) {
      setError(t('invalidJobData') || 'Please enter a valid wage');
      return;
    }

    onSubmit({ name: name.trim(), wagePerHour: wage });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{t('addJob')}</h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.formGroup}>
            <label htmlFor="jobName">{t('jobName')}</label>
            <input
              id="jobName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('jobName')}
              className={styles.input}
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="wagePerHour">{t('wagePerHour')}</label>
            <div className={styles.inputWithUnit}>
              <input
                id="wagePerHour"
                type="number"
                step="0.01"
                value={wagePerHour}
                onChange={(e) => setWagePerHour(e.target.value)}
                placeholder="0.00"
                className={styles.input}
              />
              <span className={styles.unit}>{t('currency')}</span>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? t('submitting') : t('addJob')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;
