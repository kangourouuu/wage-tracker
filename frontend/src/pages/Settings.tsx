import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { useTranslation } from "react-i18next";
import api, { deleteJob } from "../services/api";
import type { Job } from "../types/work-entry";
import JobList from "../components/JobList";
import AddJobModal from "../components/AddJobModal";
import { GlassPanel } from "../shared/components/ui/GlassPanel";

export const Settings = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState<
    "profile" | "preferences" | "jobs"
  >("profile");
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: jobs } = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: () => api.get("/jobs").then((res) => res.data),
  });

  const { mutate: deleteJobMutation, isPending: isDeletingJob } = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["workEntries"] });
    },
  });

  const { mutate: updateJobMutation, isPending: isUpdatingJob } = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name: string; wagePerHour: number };
    }) => api.patch(`/jobs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["workEntries"] });
    },
  });

  const { mutate: addJobMutation, isPending: isAddingJob } = useMutation({
    mutationFn: (data: { name: string; wagePerHour: number }) =>
      api.post("/jobs", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setIsAddJobModalOpen(false);
    },
  });

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "preferences", label: "Preferences" },
    { id: "jobs", label: "Manage Jobs" },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-text-primary"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-text-primary">
          {t("settings", "Settings")}
        </h1>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-300 font-medium ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-neon"
                : "bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <GlassPanel className="p-6 min-h-[400px]">
        {activeTab === "profile" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Profile Information
            </h2>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                Name
              </label>
              <input
                type="text"
                value={user?.name || ""}
                readOnly
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-text-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-text-primary"
              />
            </div>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Preferences
            </h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                Theme
              </label>
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-text-primary hover:bg-white/10 transition-colors"
              >
                <span>{isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
                <span className="text-xs text-text-secondary">
                  Tap to toggle
                </span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                Language
              </label>
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary"
              >
                <option value="en" className="bg-surface text-text-primary">
                  English
                </option>
                <option value="vi" className="bg-surface text-text-primary">
                  Tiếng Việt
                </option>
              </select>
            </div>
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-text-primary">
                Manage Jobs
              </h2>
              <button
                onClick={() => setIsAddJobModalOpen(true)}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors shadow-lg hover:shadow-neon"
              >
                + Add Job
              </button>
            </div>
            {jobs && (
              <JobList
                jobs={jobs}
                onDelete={deleteJobMutation}
                onUpdate={(id, data) => updateJobMutation({ id, data })}
                isDeleting={isDeletingJob}
                isUpdating={isUpdatingJob}
              />
            )}
          </div>
        )}
      </GlassPanel>

      <AddJobModal
        isOpen={isAddJobModalOpen}
        onClose={() => setIsAddJobModalOpen(false)}
        onSubmit={(data) => addJobMutation(data)}
        isLoading={isAddingJob}
      />
    </div>
  );
};
