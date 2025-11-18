import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useTranslation } from 'react-i18next';
import api, { deleteJob } from '../services/api';
import type { Job } from '../types/work-entry';
import JobList from '../components/JobList';
import AddJobModal from '../components/AddJobModal';
import styles from './Settings.module.css';

export const Settings = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'jobs' | 'data'>('profile');
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: jobs } = useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: () => api.get('/jobs').then(res => res.data),
  });

  const { mutate: deleteJobMutation, isPending: isDeletingJob } = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['workEntries'] });
    },
  });

  const { mutate: updateJobMutation, isPending: isUpdatingJob } = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name: string; wagePerHour: number };
    }) => api.patch(`/jobs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['workEntries'] });
    },
  });

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <button onClick={() => navigate('/dashboard')} className={styles.backButton}>
            ← {t('dashboard', 'Dashboard')}
          </button>
          <h1>{t('settings', 'Settings')}</h1>
        </header>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'preferences' ? styles.active : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'jobs' ? styles.active : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            Manage Jobs
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'data' ? styles.active : ''}`}
            onClick={() => setActiveTab('data')}
          >
            Data
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'profile' && (
            <div className={styles.section}>
              <h2>Profile Information</h2>
              <div className={styles.field}>
                <label>Name</label>
                <input type="text" value={user?.name || ''} readOnly />
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <input type="email" value={user?.email || ''} readOnly />
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className={styles.section}>
              <h2>Preferences</h2>

              <div className={styles.field}>
                <label>Theme</label>
                <button onClick={toggleTheme} className={styles.themeToggle}>
                  {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </button>
              </div>

              <div className={styles.field}>
                <label>Language</label>
                <select value={i18n.language} onChange={(e) => changeLanguage(e.target.value)}>
                  <option value="en">English</option>
                  <option value="vn">Tiếng Việt</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Manage Jobs</h2>
                <button onClick={() => setIsAddJobModalOpen(true)} className={styles.addButton}>
                  + Add Job
                </button>
              </div>
              {jobs && (
                <JobList
                  jobs={jobs}
                  onDelete={deleteJobMutation}
                  onUpdate={updateJobMutation}
                  isDeleting={isDeletingJob}
                  isUpdating={isUpdatingJob}
                />
              )}
            </div>
          )}

          {activeTab === 'data' && (
            <div className={styles.section}>
              <h2>Data Management</h2>
              <button className={styles.dangerButton} onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <AddJobModal isOpen={isAddJobModalOpen} onClose={() => setIsAddJobModalOpen(false)} />
    </div>
  );
};
