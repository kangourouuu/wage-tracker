import { useAuthStore } from "../store/authStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { analyticsApi } from "../services/api";
import type { WorkEntry, CreateWorkEntryDto } from "../types/work-entry";
import "react-calendar/dist/Calendar.css";
import "../styles/Calendar.css";
import styles from "./Dashboard.module.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Calendar from "react-calendar";
import AddEntryModal from "../components/AddEntryModal";
import TimeOfDayIcon from "../components/TimeOfDayIcon";
import SummaryCard from "../components/SummaryCard";
import EmptyState from "../components/EmptyState";

import { useAiAssistantStore } from "../features/ai-assistant/store/aiAssistantStore";
import { AssistantPanel } from "../components/AssistantPanel";
import { DarkModeToggle } from "../shared/components/ui";
import { useKeyboardShortcut } from "../shared/hooks";
import { SummaryCardWithTrend } from "../features/analytics/components/SummaryCardWithTrend";
import type { SummaryData } from "../features/analytics/types/analytics.types";
import { exportToCSV } from "../utils/exportUtils";
import { Skeleton } from "../shared/components/feedback";
import { RecentEntries } from "../components/RecentEntries";
import toast from "react-hot-toast";
import { Sidebar } from "../components/Sidebar";

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

  const totalEntries = entries.length;
  const averageHoursPerEntry = totalEntries > 0 ? totalHours / totalEntries : 0;
  const averageEarningsPerEntry =
    totalEntries > 0 ? totalEarnings / totalEntries : 0;

  return {
    totalHours: totalHours.toFixed(2),
    totalEarnings: totalEarnings.toFixed(2),
    totalEntries,
    averageHoursPerEntry: averageHoursPerEntry.toFixed(2),
    averageEarningsPerEntry: averageEarningsPerEntry.toFixed(2),
  };
};

export const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const { toggle: toggleAssistant } = useAiAssistantStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: workEntries, isLoading: isLoadingEntries } = useQuery<
    WorkEntry[]
  >({
    queryKey: ["workEntries"],
    queryFn: fetchWorkEntries,
    refetchInterval: 30000, // Poll every 30 seconds
    refetchOnWindowFocus: true,
  });

  const { data: analyticsSummary, isLoading: isLoadingSummary } =
    useQuery<SummaryData>({
      queryKey: ["analyticsSummary", "week"],
      queryFn: async () => {
        const { data } = await analyticsApi.getSummary("week");
        return data;
      },
      refetchInterval: 30000, // Poll every 30 seconds
      refetchOnWindowFocus: true,
    });

  const deleteWorkEntryMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/work-entries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workEntries"] });
      queryClient.invalidateQueries({ queryKey: ["analyticsSummary"] });
      toast.success(t("entryDeleted", "Entry deleted successfully"));
    },
    onError: () => {
      toast.error(t("failedToDeleteWorkEntry"));
    },
  });

  const duplicateEntryMutation = useMutation({
    mutationFn: (newEntry: CreateWorkEntryDto) =>
      api.post("/work-entries", newEntry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workEntries"] });
      queryClient.invalidateQueries({ queryKey: ["analyticsSummary"] });
      toast.success(t("entryDuplicated", "Entry duplicated successfully"));
    },
    onError: () => {
      toast.error(t("failedToDuplicateEntry", "Failed to duplicate entry"));
    },
  });

  useKeyboardShortcut("n", () => setIsModalOpen(true));
  useKeyboardShortcut("/", () => toggleAssistant());

  const summary = workEntries
    ? calculateSummary(workEntries)
    : { totalHours: "0.00", totalEarnings: "0.00" };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm(t("confirmDelete"))) {
      deleteWorkEntryMutation.mutate(id);
    }
  };

  const handleEditEntry = (entry: WorkEntry) => {
    setSelectedDate(new Date(entry.startTime));
    setIsModalOpen(true);
  };

  const handleDuplicateEntry = (entry: WorkEntry) => {
    if (!selectedDate) return;

    const originalStart = new Date(entry.startTime);
    const originalEnd = new Date(entry.endTime);

    // Create new dates based on selectedDate but keeping the original time
    const newStart = new Date(selectedDate);
    newStart.setHours(
      originalStart.getHours(),
      originalStart.getMinutes(),
      0,
      0
    );

    const newEnd = new Date(selectedDate);
    newEnd.setHours(originalEnd.getHours(), originalEnd.getMinutes(), 0, 0);

    // Handle overnight shifts if necessary (if end < start, add 1 day)
    if (newEnd < newStart) {
      newEnd.setDate(newEnd.getDate() + 1);
    }

    const newEntry: CreateWorkEntryDto = {
      jobId: entry.job.id,
      startTime: newStart.toISOString(),
      endTime: newEnd.toISOString(),
      breakDuration: entry.breakDuration,
    };

    duplicateEntryMutation.mutate(newEntry);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.pageWrapper}>
        {/* Main Content */}
        <div
          className={`${styles.contentWrapper} ${
            sidebarOpen ? styles.contentShifted : ""
          }`}
        >
          <div className={styles.dashboardContainer}>
            <header className={styles.header}>
              <div className={styles.welcomeSection}>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={styles.menuButton}
                  aria-label="Toggle menu"
                >
                  ☰
                </button>
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

                <h1 className={styles.welcomeTitle} style={{ margin: 0 }}>
                  {t("welcome", { name: user?.name })}
                </h1>
              </div>
              <div className={styles.headerActions}>
                <button
                  onClick={() =>
                    exportToCSV(workEntries || [], "work-entries.csv")
                  }
                  className={styles.exportButton}
                  title="Export to CSV"
                >
                  📥
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
              {!workEntries || workEntries.length === 0 ? (
                <EmptyState onAction={() => setIsModalOpen(true)} />
              ) : (
                <div className={styles.dashboardGrid}>
                  {/* Left Column: Calendar */}
                  <div className={styles.leftColumn}>
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
                          const weekdays = [
                            "SUN",
                            "MON",
                            "TUE",
                            "WED",
                            "THU",
                            "FRI",
                            "SAT",
                          ];
                          return weekdays[date.getDay()];
                        }}
                        tileContent={({ date, view }) => {
                          if (view === "month" && workEntries) {
                            const entriesForDay = workEntries.filter(
                              (entry) => {
                                const entryDate = new Date(entry.startTime);
                                return (
                                  entryDate.getFullYear() ===
                                    date.getFullYear() &&
                                  entryDate.getMonth() === date.getMonth() &&
                                  entryDate.getDate() === date.getDate()
                                );
                              }
                            );

                            if (entriesForDay.length > 0) {
                              // Check if multiple jobs or high hours
                              const isHighWorkload =
                                entriesForDay.length > 1 ||
                                entriesForDay.some((e) => {
                                  const duration =
                                    new Date(e.endTime).getTime() -
                                    new Date(e.startTime).getTime();
                                  return duration > 8 * 60 * 60 * 1000;
                                });

                              return (
                                <div
                                  className={`${styles.entryDot} ${
                                    isHighWorkload ? styles.entryDotHigh : ""
                                  }`}
                                ></div>
                              );
                            }
                            return null;
                          }
                          return null;
                        }}
                      />
                    </div>
                  </div>

                  {/* Right Column: Summary & Recent Activity */}
                  <div className={styles.rightColumn}>
                    <div className={styles.summaryCardsContainer}>
                      {isLoadingSummary ? (
                        <>
                          <Skeleton
                            height="100px"
                            width="100%"
                            borderRadius="var(--border-radius-md)"
                          />
                          <Skeleton
                            height="100px"
                            width="100%"
                            borderRadius="var(--border-radius-md)"
                          />
                        </>
                      ) : analyticsSummary ? (
                        <>
                          <SummaryCardWithTrend
                            title={t("totalHours")}
                            value={analyticsSummary.current.totalHours.toFixed(
                              2
                            )}
                            trend={{
                              value: analyticsSummary.trend.hours,
                              isPositive: analyticsSummary.trend.hours >= 0,
                            }}
                            icon="⏱️"
                          />
                          <SummaryCardWithTrend
                            title={t("estimatedEarnings")}
                            value={analyticsSummary.current.totalEarnings.toFixed(
                              2
                            )}
                            trend={{
                              value: analyticsSummary.trend.earnings,
                              isPositive: analyticsSummary.trend.earnings >= 0,
                            }}
                            icon="💰"
                          />
                        </>
                      ) : (
                        <>
                          <SummaryCard
                            title={t("totalHours")}
                            value={summary.totalHours}
                          />
                          <SummaryCard
                            title={t("estimatedEarnings")}
                            value={summary.totalEarnings}
                          />
                        </>
                      )}
                    </div>

                    <div className={styles.recentActivityWrapper}>
                      <RecentEntries
                        entries={workEntries}
                        onEdit={handleEditEntry}
                        onDelete={handleDeleteEntry}
                        onDuplicate={handleDuplicateEntry}
                        isLoading={isLoadingEntries}
                      />
                    </div>
                  </div>
                </div>
              )}
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
