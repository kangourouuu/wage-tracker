import React, { useState, useRef, useCallback } from 'react';
import type { WorkEntry } from '../types/work-entry';
import styles from './WorkEntryList.module.css';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '../contexts/ResponsiveContext';
import { EmptyState } from '../shared/components/feedback';

interface WorkEntryListProps {
  workEntries: WorkEntry[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const WorkEntryList: React.FC<WorkEntryListProps> = ({
  workEntries,
  onDelete,
  isDeleting,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const longPressTimer = useRef<number | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      onDelete(id);
    }
  };

  const handleLongPressStart = useCallback((id: string) => {
    longPressTimer.current = window.setTimeout(() => {
      setSelectedId(id);
    }, 500); // 500ms long press
  }, []);

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleClickOutside = useCallback(() => {
    setSelectedId(null);
  }, []);

  if (!workEntries || workEntries.length === 0) {
    return (
      <div className={styles.workEntryList}>
        <h2>{t('yourWorkEntries')}</h2>
        <EmptyState
          icon="📝"
          title={t('noEntriesFound')}
          description="Start tracking your work by adding your first entry!"
        />
      </div>
    );
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
                  <strong>{t('hoursWorked')}:</strong> {hours.toFixed(2)}
                </div>
                <div className={styles.cardActions}>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className={styles.deleteButton}
                    disabled={isDeleting}
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
    <div className={styles.workEntryList} onClick={handleClickOutside}>
      <h2>{t('yourWorkEntries')}</h2>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>{t('date')}</th>
              <th>{t('hoursWorked')}</th>
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
                <tr 
                  key={entry.id}
                  onMouseDown={() => handleLongPressStart(entry.id)}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  onTouchStart={() => handleLongPressStart(entry.id)}
                  onTouchEnd={handleLongPressEnd}
                  className={selectedId === entry.id ? styles.selectedRow : ''}
                >
                  <td>{start.toLocaleDateString()}</td>
                  <td>{hours.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {/* Action buttons shown on long press */}
        {selectedId && (
          <div className={styles.actionPopup}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(selectedId);
                setSelectedId(null);
              }}
              className={styles.deleteButton}
              disabled={isDeleting}
            >
              🗑️ {t('delete')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkEntryList;
