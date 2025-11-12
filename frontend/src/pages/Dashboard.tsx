import { useAuthStore } from '../store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { deleteWorkEntry, deleteJob } from '../services/api';
import type { WorkEntry, Job } from '../types/work-entry';
import 'react-calendar/dist/Calendar.css';
import '../styles/Calendar.css';
import styles from './Dashboard.module.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Calendar from 'react-calendar';
import AddEntryModal from '../components/AddEntryModal';
import TimeOfDayIcon from '../components/TimeOfDayIcon';
import SummaryCard from '../components/SummaryCard';
import WorkEntryList from '../components/WorkEntryList';
import JobList from '../components/JobList';

const fetchWorkEntries = async (): Promise<WorkEntry[]> => {
  const { data } = await api.get('/work-entries');
  return data;
};

const fetchJobs = async (): Promise<Job[]> => {
  const { data } = await api.get('/jobs');
  return data;
};

const calculateSummary = (entries: WorkEntry[]) => {
  const totalHours = entries.reduce((acc, entry) => {
    const start = new Date(entry.startTime).getTime();
    const end = new Date(entry.endTime).getTime();
    const durationMs = end - start;
    const breakMs = entry.breakDuration * 60 * 1000;
    const hours = (durationMs - breakMs) / (1000 * 60 * 60);
    return acc + hours;
  }, 0);

  const totalEarnings = entries.reduce((acc, entry) => {
    const start = new Date(entry.startTime).getTime();
    const end = new Date(entry.endTime).getTime();
    const durationMs = end - start;
    const breakMs = entry.breakDuration * 60 * 1000;
    const hours = (durationMs - breakMs) / (1000 * 60 * 60);
    return acc + (hours * entry.job.wagePerHour);
  }, 0);

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
  const queryClient = useQueryClient();

  const { data: workEntries } = useQuery<WorkEntry[]>({
    queryKey: ['workEntries'],
    queryFn: fetchWorkEntries,
  });

  const { data: jobs } = useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  const { mutate: deleteWorkEntryMutation, isPending: isDeletingWorkEntry } = useMutation({
    mutationFn: deleteWorkEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workEntries'] });
    },
  });

  const { mutate: deleteJobMutation, isPending: isDeletingJob } = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['workEntries'] }); // Invalidate work entries as well
    },
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
    <>
      <div className={styles.dashboardContainer}>
        <header className={styles.header}>
          <div className={styles.welcomeSection}>
            <TimeOfDayIcon />
            <h1 className={styles.welcomeTitle}>{t('welcome', { name: user?.name })}</h1>
          </div>
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
          <div className={styles.calendarWrapper}>
            <Calendar
              onChange={(value) => {
                if (Array.isArray(value)) {
                  handleDateClick(value[0] as Date);
                } else {
                  handleDateClick(value as Date);
                }
              }}
              value={selectedDate}
              onClickDay={handleDateClick}
              locale={i18n.language === 'vn' ? 'vi' : 'en-US'}
            />
          </div>

          <div className={styles.summaryCardsContainer}>
            <SummaryCard title={t('totalHours')} value={summary.totalHours} />
            <SummaryCard title={t('estimatedEarnings')} value={summary.totalEarnings} />
          </div>
        </div>
        <div className={styles.listsContainer}>
          {workEntries && (
            <WorkEntryList
              workEntries={workEntries}
              onDelete={deleteWorkEntryMutation}
              isDeleting={isDeletingWorkEntry}
            />
          )}
          {jobs && (
            <JobList
              jobs={jobs}
              onDelete={deleteJobMutation}
              isDeleting={isDeletingJob}
            />
          )}
        </div>
      </div>
      <AddEntryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedDate={selectedDate} />
    </>
  );
};