import { useAuthStore } from '../store/authStore';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { WorkEntry } from '../types/work-entry';
import styles from './Dashboard.module.css';
import AddEntryModal from '../components/AddEntryModal';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useTranslation } from 'react-i18next'; // Import useTranslation

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
  const { t, i18n } = useTranslation(); // Initialize useTranslation
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
              onChange={(value) => setSelectedDate(value as Date)}
              value={selectedDate}
              onClickDay={handleDateClick}
              locale={i18n.language === 'vn' ? 'vi' : 'en-US'} // Adjust locale for calendar
            />
          </div>

          <section className={styles.summary}>
            <div className={styles.summaryCard}>
              <h3>{t('totalHours')}</h3>
              <p>{summary.totalHours}</p>
            </div>
            <div className={styles.summaryCard}>
              <h3>{t('totalEntries')}</h3>
              <p>{workEntries?.length || 0}</p>
            </div>
            <div className={styles.summaryCard}>
              <h3>{t('estimatedEarnings')}</h3>
              <p>${summary.totalEarnings}</p>
            </div>
          </section>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.entriesHeader}>
            <h2 className={styles.entriesTitle}>{t('yourWorkEntries')}</h2>
            <button className={styles.addEntryButton} onClick={() => handleDateClick(new Date())}>{t('addEntry')}</button>
          </div>

          <div className={styles.entryListContainer}>
            {isLoading && <p className={styles.loadingText}>{t('loadingEntries')}</p>}
            {isError && <p className={styles.errorText}>{t('errorFetchingEntries')}</p>}
            {workEntries && (
              <ul className={styles.entryList}>
                {workEntries.length > 0 ? (
                  workEntries.map(entry => (
                    <li key={entry.id} className={styles.entryItem}>
                      <div>
                        <p><strong>{t('date')}</strong></p>
                        <p>{new Date(entry.startTime).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p><strong>{t('startTime')}</strong></p>
                        <p>{new Date(entry.startTime).toLocaleTimeString()}</p>
                      </div>
                      <div>
                        <p><strong>{t('endTime')}</strong></p>
                        <p>{new Date(entry.endTime).toLocaleTimeString()}</p>
                      </div>
                      <div>
                        <p><strong>{t('break')}</strong></p>
                        <p>{entry.breakDuration} min</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className={styles.noEntriesText}>{t('noEntriesFound')}</p>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>

      <AddEntryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedDate={selectedDate} />
    </div>
  );
};
