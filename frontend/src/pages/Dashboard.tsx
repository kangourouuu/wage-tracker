import { useAuthStore } from '../store/authStore';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { WorkEntry } from '../types/work-entry';
import 'react-calendar/dist/Calendar.css';
import '../styles/Calendar.css';
import styles from './Dashboard.module.css';
import { useState, Suspense, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ThreeScene from './ThreeScene';
import SummaryCard3D from '../components/SummaryCard3D';
import HeroCard3D from '../components/HeroCard3D'; // Import HeroCard3D
import Calendar3DPanel from '../components/Calendar3DPanel'; // Import Calendar3DPanel
import WorkEntryList3D from '../components/WorkEntryList3D'; // Import WorkEntryList3D
import AddEntryModal3D from '../components/AddEntryModal3D'; // Import AddEntryModal3D
import CTAButton3D from '../components/CTAButton3D'; // Import CTAButton3D
import Coin3D from '../components/Coin3D'; // Import Coin3D
import MainDashboardPanel3D from '../components/MainDashboardPanel3D'; // Import MainDashboardPanel3D
import { Canvas, useFrame } from '@react-three/fiber'; // Ensure Canvas and useFrame are imported
import { OrbitControls } from '@react-three/drei'; // Import OrbitControls
import * as THREE from 'three';

// This comment is added to trigger a re-compilation and potentially resolve MIME type issues.

const fetchWorkEntries = async (): Promise<WorkEntry[]> => {
  const { data } = await api.get('/work-entries');
  return data;
};

const calculateSummary = (entries: WorkEntry[]) => { // Removed wagePerHour argument
  const totalHours = entries.reduce((acc, entry) => {
    const start = new Date(entry.startTime).getTime();
    const end = new Date(entry.endTime).getTime();
    const durationMs = end - start;
    const breakMs = entry.breakDuration * 60 * 1000;
    const hours = (durationMs - breakMs) / (1000 * 60 * 60);
    return acc + hours;
  }, 0);

  // Calculate total earnings by summing earnings from each entry based on its specific job's wagePerHour
  const totalEarnings = entries.reduce((acc, entry) => {
    const start = new Date(entry.startTime).getTime();
    const end = new Date(entry.endTime).getTime();
    const durationMs = end - start;
    const breakMs = entry.breakDuration * 60 * 1000;
    const hours = (durationMs - breakMs) / (1000 * 60 * 60);
    return acc + (hours * entry.job.wagePerHour); // Use wagePerHour from the job associated with the entry
  }, 0);

  return {
    totalHours: totalHours.toFixed(2),
    totalEarnings: totalEarnings.toFixed(2),
  };
};

interface DashboardContentProps {
  workEntries: WorkEntry[] | undefined;
  summary: { totalHours: string; totalEarnings: string };
  user: { name: string } | null;
  logout: () => void;
  i18n: any;
  changeLanguage: (lng: string) => void;
  t: (key: string, options?: any) => string;
  selectedDate: Date | null;
  handleDateClick: (date: Date) => void;
  isModalOpen: boolean; // Added isModalOpen prop
  setIsModalOpen: (isOpen: boolean) => void;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  workEntries,
  summary,
  user,
  logout,
  i18n,
  changeLanguage,
  t,
  selectedDate,
  handleDateClick,
  isModalOpen, // Added isModalOpen to destructuring
  setIsModalOpen,
  mouse,
}) => {
  const heroCardRef = useRef<THREE.Mesh>(null!);
  const calendarPanelRef = useRef<THREE.Mesh>(null!);
  const mainDashboardPanelRef = useRef<THREE.Mesh>(null!);
  const ctaButtonRef = useRef<THREE.Group>(null!);
  const coinRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    const parallaxX = mouse.current.x * 0.5; // Adjust sensitivity
    const parallaxY = mouse.current.y * 0.5; // Adjust sensitivity

    // Apply parallax to HeroCard3D
    if (heroCardRef.current) {
      heroCardRef.current.position.x = THREE.MathUtils.lerp(heroCardRef.current.position.x, parallaxX * 0.5, 0.1);
      heroCardRef.current.position.y = THREE.MathUtils.lerp(heroCardRef.current.position.y, 6 + parallaxY * 0.5, 0.1);
    }

    // Apply parallax to Calendar3DPanel
    if (calendarPanelRef.current) {
      calendarPanelRef.current.position.x = THREE.MathUtils.lerp(calendarPanelRef.current.position.x, -5 + parallaxX * 0.3, 0.1);
      calendarPanelRef.current.position.y = THREE.MathUtils.lerp(calendarPanelRef.current.position.y, -1 + parallaxY * 0.3, 0.1);
    }

    // Apply parallax to MainDashboardPanel3D
    if (mainDashboardPanelRef.current) {
      mainDashboardPanelRef.current.position.x = THREE.MathUtils.lerp(mainDashboardPanelRef.current.position.x, parallaxX * 0.2, 0.1);
      mainDashboardPanelRef.current.position.y = THREE.MathUtils.lerp(mainDashboardPanelRef.current.position.y, -1 + parallaxY * 0.2, 0.1);
    }

    // Apply parallax to CTAButton3D
    if (ctaButtonRef.current) {
      ctaButtonRef.current.position.x = THREE.MathUtils.lerp(ctaButtonRef.current.position.x, parallaxX * 0.4, 0.1);
      ctaButtonRef.current.position.y = THREE.MathUtils.lerp(ctaButtonRef.current.position.y, -7 + parallaxY * 0.4, 0.1);
    }

    // Apply parallax to Coin3D
    if (coinRef.current) {
      coinRef.current.position.x = THREE.MathUtils.lerp(coinRef.current.position.x, 7 + parallaxX * 0.6, 0.1);
      coinRef.current.position.y = THREE.MathUtils.lerp(coinRef.current.position.y, 5 + parallaxY * 0.6, 0.1);
    }
  });

  return (
    <Suspense fallback={null}>
      <OrbitControls /> {/* Add OrbitControls for camera interaction */}
      <HeroCard3D ref={heroCardRef} user={user} logout={logout} i18n={i18n} changeLanguage={changeLanguage} t={t} position={[0, 6, 0]} /> {/* Adjusted position */}
      <Calendar3DPanel
        ref={calendarPanelRef}
        selectedDate={selectedDate}
        onDateChange={(value) => {
          if (Array.isArray(value)) {
            handleDateClick(value[0] as Date);
          } else {
            handleDateClick(value as Date);
          }
        }}
        onClickDay={handleDateClick}
        locale={i18n.language === 'vn' ? 'vi' : 'en-US'}
        position={[-5, -1, 0]} // Adjusted position
      />
      <MainDashboardPanel3D ref={mainDashboardPanelRef} position={[0, -1, 0]} scale={1}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', gap: '20px' }}>
            <SummaryCard3D title={t('totalHours')} value={summary.totalHours} position={[0, 0, 0]} color="#C3E4FB" />
            <SummaryCard3D title={t('totalEntries')} value={String(workEntries?.length || 0)} position={[0, 0, 0]} color="#94CEF7" />
            <SummaryCard3D title={t('estimatedEarnings')} value={summary.totalEarnings} position={[0, 0, 0]} color="#82C6F6" />
          </div>
          {workEntries && <WorkEntryList3D workEntries={workEntries} position={[0, 0, 0]} />}
        </div>
      </MainDashboardPanel3D>
      <CTAButton3D ref={ctaButtonRef} onClick={() => setIsModalOpen(true)} label={t('addEntry')} position={[0, -7, 0]} /> {/* Adjusted position */}
      <Coin3D ref={coinRef} position={[7, 5, 0]} scale={0.5} /> {/* Adjusted position */}
      <AddEntryModal3D isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedDate={selectedDate} />
    </Suspense>
  );
};

export const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const { data: workEntries } = useQuery<WorkEntry[]>({
    queryKey: ['workEntries'],
    queryFn: fetchWorkEntries,
  });

  const summary = workEntries ? calculateSummary(workEntries) : { totalHours: '0.00', totalEarnings: '0.00' };

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
        <DashboardContent
          workEntries={workEntries}
          summary={summary}
          user={user}
          logout={logout}
          i18n={i18n}
          changeLanguage={changeLanguage}
          t={t}
          selectedDate={selectedDate}
          handleDateClick={handleDateClick}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          mouse={mouse}
        />
      </Canvas>
    </div>
  );
};
