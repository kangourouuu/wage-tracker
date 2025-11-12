import React from 'react';
import type { Job } from '../types/work-entry';
import styles from './JobList.module.css';
import { useTranslation } from 'react-i18next';

interface JobListProps {
  jobs: Job[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const JobList: React.FC<JobListProps> = ({ jobs, onDelete, isDeleting }) => {
  const { t } = useTranslation();

  const handleDelete = (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      onDelete(id);
    }
  };

  if (!jobs || jobs.length === 0) {
    return <p>{t('noJobsFound')}</p>;
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
