import { useAuthStore } from "../store/authStore";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api, { analyticsApi } from "../services/api";
import type { WorkEntry } from "../types/work-entry";
import "react-calendar/dist/Calendar.css";
import "../styles/Calendar.css";
import styles from "./Dashboard.module.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Calendar from "react-calendar";
import AddEntryModal from "../components/AddEntryModal";
import TimeOfDayIcon from "../components/TimeOfDayIcon";
import SummaryCard from "../components/SummaryCard";

import { useAiAssistantStore } from "../features/ai-assistant/store/aiAssistantStore";
import { AssistantPanel } from "../components/AssistantPanel";
import { DarkModeToggle } from "../shared/components/ui";
import { useKeyboardShortcut } from "../shared/hooks";
import { SummaryCardWithTrend } from "../features/analytics/components/SummaryCardWithTrend";
import type { SummaryData } from "../features/analytics/types/analytics.types";
import { exportToCSV } from "../utils/exportUtils";
import { Skeleton } from "../shared/components/feedback";

const fetchWorkEntries = async (): Promise<WorkEntry[]> => {
  const { data } = await api.get("/work-entries");
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
    return acc + hours * entry.job.wagePerHour;
  }, 0);

  return {
    totalHours: totalHours.toFixed(2),
    totalEarnings: totalEarnings.toFixed(2),
  };
};

export const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const { toggle: toggleAssistant } = useAiAssistantStore();

  const { data: workEntries } = useQuery<WorkEntry[]>({
    queryKey: ["workEntries"],
    queryFn: fetchWorkEntries,
  });

  const { data: analyticsSummary, isLoading: isLoadingSummary } = useQuery<SummaryData>({
    queryKey: ["analyticsSummary", "week"],
    queryFn: async () => {
      const { data } = await analyticsApi.getSummary("week");
      return data;
    },
  });

  useKeyboardShortcut('n', () => setIsModalOpen(true));
  useKeyboardShortcut('/', () => toggleAssistant());

  const summary = workEntries
    ? calculateSummary(workEntries)
    : { totalHours: "0.00", totalEarnings: "0.00" };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <div className={styles.pageWrapper}>
        {/* Main Content */}
        <div className={styles.contentWrapper}>
          <div className={styles.dashboardContainer}>
            <header className={styles.header}>
              <div className={styles.welcomeSection}>
                <div className={styles.assistantToggleContainer}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAssistant();
                    }}
                    style={{ cursor: "pointer", display: "inline-flex" }}
                  >
                    <TimeOfDayIcon />
                  </div>
                  <AssistantPanel isDropdown={true} />
                </div>
                <h1 className={styles.welcomeTitle}>
                  {t("welcome", { name: user?.name })}
                </h1>
              </div>
              <div className={styles.headerActions}>
                <button
                  onClick={() => exportToCSV(workEntries || [], 'work-entries.csv')}
                  className={styles.exportButton}
                  title="Export to CSV"
                >
                  📥
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className={styles.settingsButton}
                  title="Settings"
                >
                  ⚙️
                </button>
                <DarkModeToggle />
                <select
                  onChange={(e) => changeLanguage(e.target.value)}
                  value={i18n.language}
                  className={styles.languageSwitcher}
                >
                  <option value="en">English</option>
                  <option value="vn">Tiếng Việt</option>
                </select>
                <button onClick={logout} className={styles.logoutButton}>
                  {t("logout")}
                </button>
              </div>
            </header>

            <div className={styles.mainContent}>
              <div className={styles.centerColumn}>
                {/* Analytics Button */}
                <button
                  className={styles.analyticsButton}
                  onClick={() => navigate('/analytics')}
                >
                  <span className={styles.analyticsIcon}>📈</span>
                  <span>{t("analytics", "Analytics")}</span>
                </button>

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
                    locale="en-US"
                    calendarType="gregory"
                    showNeighboringMonth={true}
                    formatShortWeekday={(_locale, date) => {
                      const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
                      return weekdays[date.getDay()];
                    }}
                    tileContent={({ date, view }) => {
                      if (view === 'month' && workEntries) {
                        const hasEntry = workEntries.some((entry) => {
                          const entryDate = new Date(entry.startTime);
                          return (
                            entryDate.getFullYear() === date.getFullYear() &&
                            entryDate.getMonth() === date.getMonth() &&
                            entryDate.getDate() === date.getDate()
                          );
                        });
                        return hasEntry ? <div className={styles.entryDot}></div> : null;
                      }
                      return null;
                    }}
                  />
                </div>

                <div className={styles.summaryCardsContainer}>
                  {isLoadingSummary ? (
                    <>
                      <Skeleton height="120px" width="200px" borderRadius="var(--border-radius-md)" />
                      <Skeleton height="120px" width="200px" borderRadius="var(--border-radius-md)" />
                      <Skeleton height="120px" width="200px" borderRadius="var(--border-radius-md)" />
                    </>
                  ) : analyticsSummary ? (
                    <>
                      <SummaryCardWithTrend
                        title={t("totalHours")}
                        value={analyticsSummary.current.totalHours.toFixed(2)}
                        trend={{
                          value: analyticsSummary.trend.hours,
                          isPositive: analyticsSummary.trend.hours >= 0,
                        }}
                        icon="⏱️"
                      />
                      <SummaryCardWithTrend
                        title={t("estimatedEarnings")}
                        value={analyticsSummary.current.totalEarnings.toFixed(2)}
                        trend={{
                          value: analyticsSummary.trend.earnings,
                          isPositive: analyticsSummary.trend.earnings >= 0,
                        }}
                        icon="💰"
                      />
                      <SummaryCardWithTrend
                        title={t("analytics.totalEntries", "Total Entries")}
                        value={analyticsSummary.current.totalEntries.toString()}
                        trend={{
                          value: analyticsSummary.trend.entries,
                          isPositive: analyticsSummary.trend.entries >= 0,
                        }}
                        icon="📋"
                      />
                    </>
                  ) : (
                    <>
                      <SummaryCard title={t("totalHours")} value={summary.totalHours} />
                      <SummaryCard
                        title={t("estimatedEarnings")}
                        value={summary.totalEarnings}
                      />
                      <SummaryCard
                        title={t("analytics.totalEntries", "Total Entries")}
                        value={workEntries?.length.toString() || "0"}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <AddEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
      />
    </>
  );
};
