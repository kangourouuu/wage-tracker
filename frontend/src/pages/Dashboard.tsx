import { useAuthStore } from '../store/authStore';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { WorkEntry } from '../types/work-entry';
import styles from './Dashboard.module.css';
import AddEntryModal from '../components/AddEntryModal';
import { useState } from 'react';
import Calendar from 'react-calendar'; // Import Calendar component
import 'react-calendar/dist/Calendar.css'; // Import calendar CSS

const fetchWorkEntries = async (): Promise<WorkEntry[]> => {
  const { data } = await api.get('/work-entries');
  return data;
};

// Helper function to calculate total hours and earnings
const calculateSummary = (entries: WorkEntry[], wagePerHour: number) => {
  const totalHours = entries.reduce((acc, entry) => {
    const start = new Date(entry.startTime).getTime();
    const end = new Date(entry.endTime).getTime();
    const durationMs = end - start;
    const breakMs = entry.breakDuration * 60 * 1000;
    const hours = (durationMs - breakMs) / (1000 * 60 * 60);
    return acc + hours;
  }, 0);

  const totalEarnings = totalHours * wagePerHour;

  return {
    totalHours: totalHours.toFixed(2),
    totalEarnings: totalEarnings.toFixed(2),
  };
};


export const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); // State for selected date

  const { data: workEntries, isLoading, isError } = useQuery<WorkEntry[]>({
    queryKey: ['workEntries'],
    queryFn: fetchWorkEntries,
  });

  const summary = user && workEntries ? calculateSummary(workEntries, user.wagePerHour) : { totalHours: '0.00', totalEarnings: '0.00' };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.welcomeTitle}>Welcome, {user?.name}</h1>
        <button onClick={logout} className={styles.logoutButton}>
          Logout
        </button>
      </header>
      
      <section className={styles.summary}>
        <div className={styles.summaryCard}>
          <h3>Total Hours</h3>
          <p>{summary.totalHours}</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Total Entries</h3>
          <p>{workEntries?.length || 0}</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Estimated Earnings</h3>
          <p>${summary.totalEarnings}</p>
        </div>
      </section>

      <div className={styles.entriesHeader}>
        <h2 className={styles.entriesTitle}>Your Work Entries</h2>
        <button className={styles.addEntryButton} onClick={() => handleDateClick(new Date())}>+ Add Entry</button>
      </div>

      <div className={styles.calendarContainer}>
        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
          onClickDay={handleDateClick}
          locale="en-US"
        />
      </div>

      <div>
        {isLoading && <p className={styles.loadingText}>Loading entries...</p>}
        {isError && <p className={styles.errorText}>Error fetching entries.</p>}
        {workEntries && (
          <ul className={styles.entryList}>
            {workEntries.length > 0 ? (
              workEntries.map(entry => (
                <li key={entry.id} className={styles.entryItem}>
                  <div>
                    <p><strong>Date</strong></p>
                    <p>{new Date(entry.startTime).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p><strong>Start Time</strong></p>
                    <p>{new Date(entry.startTime).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p><strong>End Time</strong></p>
                    <p>{new Date(entry.endTime).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p><strong>Break</strong></p>
                    <p>{entry.breakDuration} min</p>
                  </div>
                </li>
              ))
            ) : (
              <p className={styles.noEntriesText}>No work entries found. Time to get to work! 💸</p>
            )}
          </ul>
        )}
      </div>

      <AddEntryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedDate={selectedDate} />
    </div>
  );
};
