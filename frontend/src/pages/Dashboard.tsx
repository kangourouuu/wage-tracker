import { useAuthStore } from '../store/authStore';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { WorkEntry } from '../types/work-entry';
import styles from './Dashboard.module.css';

const fetchWorkEntries = async (): Promise<WorkEntry[]> => {
  const { data } = await api.get('/wage');
  return data;
};

export const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const { data: workEntries, isLoading, isError } = useQuery<WorkEntry[]>({
    queryKey: ['workEntries'],
    queryFn: fetchWorkEntries,
  });

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1 className={styles.welcomeTitle}>Welcome, {user?.name}</h1>
        <button onClick={logout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
      
      <p className={styles.introText}>This is your dashboard. Track your hours and see your earnings.</p>

      <div style={{ marginTop: '2rem' }}>
        <h2 className={styles.entriesTitle}>Your Work Entries</h2>
        {isLoading && <p className={styles.loadingText}>Loading entries...</p>}
        {isError && <p className={styles.errorText}>Error fetching entries.</p>}
        {workEntries && (
          <ul className={styles.entryList}>
            {workEntries.length > 0 ? (
              workEntries.map(entry => (
                <li key={entry.id} className={styles.entryItem}>
                  <p><strong>From:</strong> {new Date(entry.startTime).toLocaleString()}</p>
                  <p><strong>To:</strong> {new Date(entry.endTime).toLocaleString()}</p>
                  <p><strong>Break:</strong> {entry.breakDuration} minutes</p>
                </li>
              ))
            ) : (
              <p className={styles.noEntriesText}>No work entries found. Time to get to work! 💸</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
