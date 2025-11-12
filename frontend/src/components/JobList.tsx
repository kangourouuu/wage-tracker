import React from 'react';
import type { Job } from '../types/work-entry';
import styles from './JobList.module.css';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '../contexts/ResponsiveContext'; // Import useResponsive

interface JobListProps {
  jobs: Job[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const JobList: React.FC<JobListProps> = ({ jobs, onDelete, isDeleting }) => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive(); // Use the responsive hook

  const handleDelete = (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      onDelete(id);
    }
  };

  if (!jobs || jobs.length === 0) {
    return <p>{t('noJobsFound')}</p>;
  }

  if (isMobile) {
    return (
      <div className={styles.jobList}>
        <h2>{t('yourJobs')}</h2>
        <div className={styles.cardList}>
          {jobs.map((job) => (
            <div key={job.id} className={styles.card}>
              <div className={styles.cardRow}>
                <strong>{t('jobName')}:</strong> {job.name}
              </div>
              <div className={styles.cardRow}>
                <strong>{t('wagePerHour')}:</strong> {job.wagePerHour}
              </div>
              <div className={styles.cardActions}>
                <button
                  onClick={() => handleDelete(job.id)}
                  className={styles.deleteButton}
                  disabled={isDeleting}
                >
                  {t('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.jobList}>
      <h2>{t('yourJobs')}</h2>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>{t('jobName')}</th>
              <th>{t('wagePerHour')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.name}</td>
                <td>{job.wagePerHour}</td>
                <td>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className={styles.deleteButton}
                    disabled={isDeleting}
                  >
                    {t('delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobList;
