import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type { WorkEntry } from '../types/work-entry';
import styles from './WorkEntryList.module.css';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '../contexts/ResponsiveContext';

interface WorkEntryListProps {
  workEntries: WorkEntry[];
}

const WorkEntryList: React.FC<WorkEntryListProps> = ({ workEntries }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { isMobile } = useResponsive();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/work-entries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workEntries'] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      deleteMutation.mutate(id);
    }
  };

  if (!workEntries || workEntries.length === 0) {
    return <p>{t('noEntriesFound')}</p>;
  }

  if (isMobile) {
    return (
      <div className={styles.workEntryList}>
        <h2>{t('yourWorkEntries')}</h2>
        <div className={styles.cardList}>
          {workEntries.map((entry) => {
            const start = new Date(entry.startTime);
            const end = new Date(entry.endTime);
            const durationMs = end.getTime() - start.getTime();
            const breakMs = entry.breakDuration * 60 * 1000;
            const hours = (durationMs - breakMs) / (1000 * 60 * 60);

            return (
              <div key={entry.id} className={styles.card}>
                <div className={styles.cardRow}>
                  <strong>{t('date')}:</strong> {start.toLocaleDateString()}
                </div>
                <div className={styles.cardRow}>
                  <strong>{t('startTime')}:</strong> {start.toLocaleTimeString()}
                </div>
                <div className={styles.cardRow}>
                  <strong>{t('endTime')}:</strong> {end.toLocaleTimeString()}
                </div>
                <div className={styles.cardRow}>
                  <strong>{t('break')}:</strong> {entry.breakDuration}
                </div>
                <div className={styles.cardRow}>
                  <strong>{t('hoursWorked')}:</strong> {hours.toFixed(2)}
                </div>
                <div className={styles.cardActions}>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className={styles.deleteButton}
                    disabled={deleteMutation.isPending}
                  >
                    {t('delete')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.workEntryList}>
      <h2>{t('yourWorkEntries')}</h2>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>{t('date')}</th>
              <th>{t('startTime')}</th>
              <th>{t('endTime')}</th>
              <th>{t('break')}</th>
              <th>{t('hoursWorked')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {workEntries.map((entry) => {
              const start = new Date(entry.startTime);
              const end = new Date(entry.endTime);
              const durationMs = end.getTime() - start.getTime();
              const breakMs = entry.breakDuration * 60 * 1000;
              const hours = (durationMs - breakMs) / (1000 * 60 * 60);

              return (
                <tr key={entry.id}>
                  <td>{start.toLocaleDateString()}</td>
                  <td>{start.toLocaleTimeString()}</td>
                  <td>{end.toLocaleTimeString()}</td>
                  <td>{entry.breakDuration}</td>
                  <td>{hours.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className={styles.deleteButton}
                      disabled={deleteMutation.isPending}
                    >
                      {t('delete')}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkEntryList;
