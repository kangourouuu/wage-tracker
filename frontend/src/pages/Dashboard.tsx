import { useAuthStore } from '../store/authStore';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { WorkEntry } from '../types/work-entry';
import styles from './Dashboard.module.css';
import AddEntryModal from '../components/AddEntryModal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dashboard3D from '../components/Dashboard3D'; // Import Dashboard3D

const fetchWorkEntries = async (): Promise<WorkEntry[]> => {
  const { data } = await api.get('/work-entries');
  return data;
};

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
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const { data: workEntries, isLoading, isError } = useQuery<WorkEntry[]>({
    queryKey: ['workEntries'],
    queryFn: fetchWorkEntries,
  });

  const summary = user && workEntries ? calculateSummary(workEntries, user.wagePerHour) : { totalHours: '0.00', totalEarnings: '0.00' };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleAddEntryClick = () => {
    setSelectedDate(new Date()); // Set current date as default for new entry
    setIsModalOpen(true);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.welcomeTitle}>{t('welcome', { name: user?.name })}</h1>
        <div className={styles.headerActions}>
          <select onChange={(e) => changeLanguage(e.target.value)} value={i18n.language} className={styles.languageSwitcher}>
            <option value="en">English</option>
            <option value="vn">Tiếng Việt</option>
          </select>
          <button onClick={logout} className={styles.logoutButton}>
            {t('logout')}
          </button>
        </div>
      </header>

      <Dashboard3D
        summary={summary}
        workEntries={workEntries || []}
        selectedDate={selectedDate}
        onDateClick={handleDateClick}
        onAddEntryClick={handleAddEntryClick}
        t={t}
        i18n={i18n}
      />

      <AddEntryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedDate={selectedDate} />
    </div>
  );
};
