import { useAuthStore } from '../store/authStore';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { WorkEntry } from '../types/work-entry';
import 'react-calendar/dist/Calendar.css';
import '../styles/Calendar.css';
import styles from './Dashboard.module.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Calendar from 'react-calendar';
import AddEntryModal from '../components/AddEntryModal';

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

  const { data: workEntries } = useQuery<WorkEntry[]>({
    queryKey: ['workEntries'],
    queryFn: fetchWorkEntries,
  });

  const summary = user && workEntries ? calculateSummary(workEntries, user.wagePerHour) : { totalHours: '0.00', totalEarnings: '0.00' };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
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

      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <div className={styles.calendarWrapper}>
            <Calendar
              onChange={(value) => {
                if (Array.isArray(value)) {
                  setSelectedDate(value[0]);
                } else {
                  setSelectedDate(value);
                }
              }}
              value={selectedDate}
              onClickDay={handleDateClick}
              locale={i18n.language === 'vn' ? 'vi' : 'en-US'}
            />
          </div>
          <button className={styles.addEntryButton} onClick={() => setIsModalOpen(true)}>
            {t('addEntry')}
          </button>
        </div>
        <div className={styles.rightPanel}>
          <section className={styles.summary}>
            <div className={styles.summaryCard}>
              <h3>{t('totalHours')}</h3>
              <p className={styles.totalHours}>{summary.totalHours}</p>
            </div>
            <div className={styles.summaryCard}>
              <h3>{t('totalEntries')}</h3>
              <p className={styles.totalEntries}>{workEntries?.length || 0}</p>
            </div>
            <div className={styles.summaryCard}>
              <h3>{t('estimatedEarnings')}</h3>
              <p className={styles.estimatedEarnings}>${summary.totalEarnings}</p>
            </div>
          </section>
        </div>
      </div>

      <AddEntryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedDate={selectedDate} />
    </div>
  );
};

