import React from "react";
import { useTranslation } from "react-i18next";
import type { WorkEntry } from "../types/work-entry";
import styles from "./RecentEntries.module.css";

interface RecentEntriesProps {
  entries: WorkEntry[];
  onEdit: (entry: WorkEntry) => void;
  onDelete: (id: string) => void;
  onDuplicate: (entry: WorkEntry) => void;
  isLoading?: boolean;
}

export const RecentEntries: React.FC<RecentEntriesProps> = ({
  entries,
  onEdit,
  onDelete,
  onDuplicate,
  isLoading,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return <div className={styles.loading}>{t("loadingEntries")}</div>;
  }

  if (!entries || entries.length === 0) {
    return null; // Or an empty state if preferred, but Dashboard handles empty state globally
  }

  // Take only the last 5 entries
  const recentEntries = [...entries]
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    )
    .slice(0, 5);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t("recentActivity", "Recent Activity")}</h3>
      <div className={styles.list}>
        {recentEntries.map((entry) => {
          const start = new Date(entry.startTime);
          const end = new Date(entry.endTime);
          const durationMs = end.getTime() - start.getTime();
          const breakMs = entry.breakDuration * 60 * 1000;
          const hours = (durationMs - breakMs) / (1000 * 60 * 60);

          return (
            <div key={entry.id} className={styles.entryItem}>
              <div className={styles.entryInfo}>
                <div className={styles.jobName}>{entry.job.name}</div>
                <div className={styles.entryDate}>
                  {start.toLocaleDateString()} • {hours.toFixed(2)}h
                </div>
              </div>
              <div className={styles.actions}>
                <button
                  onClick={() => onDuplicate(entry)}
                  className={styles.actionButton}
                  title={t("duplicate", "Duplicate")}
                >
                  📋
                </button>
                <button
                  onClick={() => onEdit(entry)}
                  className={styles.actionButton}
                  title={t("edit")}
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  title={t("delete")}
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
