import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { analyticsApi } from "../services/api";
import type { WorkEntry, CreateWorkEntryDto } from "../types/work-entry";
import "react-calendar/dist/Calendar.css";
import "../styles/Calendar.css";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Calendar from "react-calendar";
import AddEntryModal from "../components/AddEntryModal";
import { SummaryCard } from "../shared/components/ui/SummaryCard";
import { GlassPanel } from "../shared/components/ui/GlassPanel";
import { RecentEntries } from "../components/RecentEntries";
import { useAiAssistantStore } from "../features/ai-assistant/store/aiAssistantStore";
import { AssistantPanel } from "../components/AssistantPanel";
import toast from "react-hot-toast";
import { useHeaderActions } from "../components/AppLayout";
import {
  CurrencyDollarIcon,
  ClockIcon,
  BriefcaseIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

const fetchWorkEntries = async (): Promise<WorkEntry[]> => {
  const { data } = await api.get("/work-entries");
  return data;
};

export const Dashboard = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  useAiAssistantStore();
  useHeaderActions();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Queries
  const { data: workEntries, isLoading: isLoadingEntries } = useQuery<
    WorkEntry[]
  >({
    queryKey: ["workEntries"],
    queryFn: fetchWorkEntries,
    refetchInterval: 30000,
  });

  const { data: summaryData } = useQuery({
    queryKey: ["analyticsSummary", "week"],
    queryFn: () => analyticsApi.getSummary("week").then((res) => res.data),
    refetchInterval: 30000,
  });

  // Mutations
  const deleteWorkEntryMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/work-entries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workEntries"] });
      queryClient.invalidateQueries({ queryKey: ["analyticsSummary"] });
      queryClient.invalidateQueries({ queryKey: ["earningsTrend"] });
      queryClient.invalidateQueries({ queryKey: ["jobDistribution"] });
      queryClient.invalidateQueries({ queryKey: ["weeklyPattern"] });
      toast.success(t("entryDeleted", "Entry deleted successfully"));
    },
    onError: () => toast.error(t("failedToDeleteWorkEntry")),
  });

  const duplicateEntryMutation = useMutation({
    mutationFn: (newEntry: CreateWorkEntryDto) =>
      api.post("/work-entries", newEntry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workEntries"] });
      queryClient.invalidateQueries({ queryKey: ["analyticsSummary"] });
      queryClient.invalidateQueries({ queryKey: ["earningsTrend"] });
      queryClient.invalidateQueries({ queryKey: ["jobDistribution"] });
      queryClient.invalidateQueries({ queryKey: ["weeklyPattern"] });
      toast.success(t("entryDuplicated", "Entry duplicated successfully"));
    },
    onError: () =>
      toast.error(t("failedToDuplicateEntry", "Failed to duplicate entry")),
  });

  const handleDeleteEntry = (id: string) => {
    if (window.confirm(t("confirmDelete"))) {
      deleteWorkEntryMutation.mutate(id);
    }
  };

  const handleEditEntry = (entry: WorkEntry) => {
    setSelectedDate(new Date(entry.startTime));
    setIsModalOpen(true);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleDuplicateEntry = (entry: WorkEntry) => {
    if (!selectedDate) return;
    const originalStart = new Date(entry.startTime);
    const originalEnd = new Date(entry.endTime);
    const newStart = new Date(selectedDate);
    newStart.setHours(
      originalStart.getHours(),
      originalStart.getMinutes(),
      0,
      0
    );
    const newEnd = new Date(selectedDate);
    newEnd.setHours(originalEnd.getHours(), originalEnd.getMinutes(), 0, 0);
    if (newEnd < newStart) newEnd.setDate(newEnd.getDate() + 1);

    duplicateEntryMutation.mutate({
      jobId: entry.job.id,
      startTime: newStart.toISOString(),
      endTime: newEnd.toISOString(),
      breakDuration: entry.breakDuration,
    });
  };

  return (
    <>
      <AssistantPanel isDropdown={true} />

      <div className="space-y-6 animate-fade-in">
        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            title={t("dashboard.summary.totalEarnings")}
            value={summaryData?.current.totalEarnings.toFixed(2) || "0.00"}
            icon={<CurrencyDollarIcon className="w-6 h-6" />}
            trend={{
              value: summaryData?.trend.earnings || 0,
              isPositive: (summaryData?.trend.earnings || 0) >= 0,
              label: t("dashboard.summary.vsLastWeek"),
            }}
            color="primary"
          />
          <SummaryCard
            title={t("dashboard.summary.totalHours")}
            value={`${summaryData?.current.totalHours.toFixed(2) || "0.00"}h`}
            icon={<ClockIcon className="w-6 h-6" />}
            trend={{
              value: summaryData?.trend.hours || 0,
              isPositive: (summaryData?.trend.hours || 0) >= 0,
              label: t("dashboard.summary.vsLastWeek"),
            }}
            color="success"
          />
          <SummaryCard
            title={t("dashboard.summary.totalEntries")}
            value={summaryData?.current.totalEntries || 0}
            icon={<BriefcaseIcon className="w-6 h-6" />}
            trend={{
              value: summaryData?.trend.entries || 0,
              isPositive: (summaryData?.trend.entries || 0) >= 0,
              label: t("dashboard.summary.vsLastWeek"),
            }}
            color="secondary"
          />
          <SummaryCard
            title={t("dashboard.summary.avgRate")}
            value={
              summaryData?.current.averageEarningsPerEntry.toFixed(2) || "0.00"
            }
            icon={<ChartBarIcon className="w-6 h-6" />}
            color="warning"
          />
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up"
          style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
        >
          {/* Calendar & Recent Entries */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassPanel className="p-6 min-h-[350px]">
              <h3 className="text-lg font-semibold mb-4">
                {t("dashboard.calendar")}
              </h3>
              <div className="calendar-wrapper-glass">
                <Calendar
                  onChange={(value) => handleDateClick(value as Date)}
                  value={selectedDate}
                  locale="en-US"
                  className="w-full bg-transparent border-none text-text-primary"
                  tileContent={({ date, view }) => {
                    if (view === "month" && workEntries) {
                      // Count entries for this specific date
                      const entriesForDate = workEntries.filter((e) => {
                        const d = new Date(e.startTime);
                        return (
                          d.getDate() === date.getDate() &&
                          d.getMonth() === date.getMonth() &&
                          d.getFullYear() === date.getFullYear()
                        );
                      });

                      // Only show dot if there are entries for this date
                      return entriesForDate.length > 0 ? (
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1" />
                      ) : null;
                    }
                    return null;
                  }}
                />
              </div>
            </GlassPanel>

            {/* Recent Activity - No background */}
            <div className="p-6 min-h-[350px] flex flex-col">
              <h3 className="text-lg font-semibold mb-4">
                {t("dashboard.recentActivity")}
              </h3>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <RecentEntries
                  entries={workEntries || []}
                  onEdit={handleEditEntry}
                  onDelete={handleDeleteEntry}
                  onDuplicate={handleDuplicateEntry}
                  isLoading={isLoadingEntries}
                />
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
