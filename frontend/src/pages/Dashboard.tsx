import { Canvas } from '@react-three/fiber';
import { useAuthStore } from '../store/authStore';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { WorkEntry } from '../types/work-entry';
import 'react-calendar/dist/Calendar.css';
import '../styles/Calendar.css';
import styles from './Dashboard.module.css';
import { useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Calendar from 'react-calendar';
import AddEntryModal from '../components/AddEntryModal';
import ThreeScene from './ThreeScene';
import WorkEntryList from '../components/WorkEntryList';
import Dashboard3D from '../components/Dashboard3D';
import SummaryCard3D from '../components/SummaryCard3D';

// This comment is added to trigger a re-compilation and potentially resolve MIME type issues.

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
      <ThreeScene />
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
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.threeDContainer}>
            <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <Suspense fallback={null}>
                <Dashboard3D workEntries={workEntries || []} selectedDate={selectedDate} onDateClick={handleDateClick} t={t} />
                <SummaryCard3D title={t('totalHours')} value={summary.totalHours} position={[-5, 2, 0]} color="#C3E4FB" />
                <SummaryCard3D title={t('totalEntries')} value={String(workEntries?.length || 0)} position={[0, 2, 0]} color="#94CEF7" />
                <SummaryCard3D title={t('estimatedEarnings')} value={summary.totalEarnings} position={[5, 2, 0]} color="#82C6F6" />
              </Suspense>
            </Canvas>
          </div>
          {workEntries && <WorkEntryList workEntries={workEntries} />}
        </div>
      </div>
      <AddEntryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedDate={selectedDate} />
    </div>
  );
};

