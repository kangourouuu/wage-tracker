import { useAuthStore } from '../store/authStore';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { WorkEntry } from '../types/work-entry';
import 'react-calendar/dist/Calendar.css';
import '../styles/Calendar.css';
import styles from './Dashboard.module.css';
import { useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import ThreeScene from './ThreeScene';
import SummaryCard3D from '../components/SummaryCard3D';
import HeroCard3D from '../components/HeroCard3D'; // Import HeroCard3D
import Calendar3DPanel from '../components/Calendar3DPanel'; // Import Calendar3DPanel
import WorkEntryList3D from '../components/WorkEntryList3D'; // Import WorkEntryList3D
import AddEntryModal3D from '../components/AddEntryModal3D'; // Import AddEntryModal3D
import CTAButton3D from '../components/CTAButton3D'; // Import CTAButton3D
import Coin3D from '../components/Coin3D'; // Import Coin3D
import { Canvas } from '@react-three/fiber'; // Ensure Canvas is imported
import { OrbitControls } from '@react-three/drei'; // Import OrbitControls

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
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <OrbitControls /> {/* Add OrbitControls for camera interaction */}
          <HeroCard3D user={user} logout={logout} i18n={i18n} changeLanguage={changeLanguage} t={t} position={[0, 6, 0]} /> {/* Adjusted position */}
          <Calendar3DPanel
            selectedDate={selectedDate}
            onDateChange={(value) => {
              if (Array.isArray(value)) {
                setSelectedDate(value[0]);
              } else {
                setSelectedDate(value);
              }
            }}
            onClickDay={handleDateClick}
            locale={i18n.language === 'vn' ? 'vi' : 'en-US'}
            position={[-5, -1, 0]} // Adjusted position
          />
          <SummaryCard3D title={t('totalHours')} value={summary.totalHours} position={[5, 3, 0]} color="#C3E4FB" /> {/* Adjusted position */}
          <SummaryCard3D title={t('totalEntries')} value={String(workEntries?.length || 0)} position={[5, 0, 0]} color="#94CEF7" /> {/* Adjusted position */}
          <SummaryCard3D title={t('estimatedEarnings')} value={summary.totalEarnings} position={[5, -3, 0]} color="#82C6F6" /> {/* Adjusted position */}
          {workEntries && <WorkEntryList3D workEntries={workEntries} position={[-5, -6, 0]} />} {/* Adjusted position */}
          <CTAButton3D onClick={() => setIsModalOpen(true)} label={t('addEntry')} position={[0, -7, 0]} /> {/* Adjusted position */}
          <Coin3D position={[7, 5, 0]} scale={0.5} /> {/* Adjusted position */}
          <AddEntryModal3D isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedDate={selectedDate} />
        </Suspense>
      </Canvas>

      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          {/* All content is now in 3D */}
        </div>
        <div className={styles.rightPanel}>
          {/* All content is now in 3D */}
        </div>
      </div>
    </div>
  );
};