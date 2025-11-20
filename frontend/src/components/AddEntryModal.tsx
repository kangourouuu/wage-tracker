import React, { useState, useEffect } from "react";
import styles from "./AddEntryModal.module.css";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "../services/api";
import type {
  CreateWorkEntryDto,
  Job,
  WorkEntry,
  UpdateWorkEntryDto,
} from "../types/work-entry.ts";
import { useTranslation } from "react-i18next";

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [startTime, setStartTime] = useState("");
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const [jobHours, setJobHours] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<{
    jobId: string;
    hours: string;
  } | null>(null);

  const {
    data: jobs,
    isLoading: isLoadingJobs,
    isError: isErrorJobs,
  } = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: () => api.get("/jobs").then((res) => res.data),
  });

  const { data: workEntries } = useQuery<WorkEntry[]>({
    queryKey: ["workEntries"],
    queryFn: () => api.get("/work-entries").then((res) => res.data),
  });

  // Filter work entries for the selected date
  const entriesForSelectedDate =
    workEntries?.filter((entry) => {
      if (!selectedDate) return false;
      const entryDate = new Date(entry.startTime);
      return (
        entryDate.getFullYear() === selectedDate.getFullYear() &&
        entryDate.getMonth() === selectedDate.getMonth() &&
        entryDate.getDate() === selectedDate.getDate()
      );
    }) || [];

  useEffect(() => {
    if (isOpen && selectedDate) {
      const year = selectedDate.getFullYear();
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      const day = selectedDate.getDate().toString().padStart(2, "0");
      const hours = new Date().getHours().toString().padStart(2, "0");
      const minutes = new Date().getMinutes().toString().padStart(2, "0");
      setStartTime(`${year}-${month}-${day}T${hours}:${minutes}`);
      setShowAddForm(false);
    } else if (!isOpen) {
      setStartTime("");
      setSelectedJobIds([]);
      setJobHours({});
      setError(null);
      setShowAddForm(false);
    }
  }, [isOpen, selectedDate]);

  const addWorkEntryMutation = useMutation({
    mutationFn: (newEntry: CreateWorkEntryDto) =>
      api.post("/work-entries", newEntry),
    onSuccess: async () => {
      // Invalidate all related queries
      await queryClient.invalidateQueries({ queryKey: ["workEntries"] });
      await queryClient.invalidateQueries({ queryKey: ["analyticsSummary"] });
      await queryClient.invalidateQueries({ queryKey: ["earningsTrend"] });
      await queryClient.invalidateQueries({ queryKey: ["jobDistribution"] });
      await queryClient.invalidateQueries({ queryKey: ["weeklyPattern"] });

      // Force refetch analytics summary
      await queryClient.refetchQueries({ queryKey: ["analyticsSummary"] });
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || t("failedToAddWorkEntry"));
    },
  });

  const deleteWorkEntryMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/work-entries/${id}`),
    onSuccess: async () => {
      // Invalidate all related queries
      await queryClient.invalidateQueries({ queryKey: ["workEntries"] });
      await queryClient.invalidateQueries({ queryKey: ["analyticsSummary"] });
      await queryClient.invalidateQueries({ queryKey: ["earningsTrend"] });
      await queryClient.invalidateQueries({ queryKey: ["jobDistribution"] });
      await queryClient.invalidateQueries({ queryKey: ["weeklyPattern"] });

      // Force refetch analytics summary
      await queryClient.refetchQueries({ queryKey: ["analyticsSummary"] });
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || t("failedToDeleteWorkEntry"));
    },
  });

  const updateWorkEntryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkEntryDto }) =>
      api.patch(`/work-entries/${id}`, data),
    onSuccess: async () => {
      // Invalidate all related queries
      await queryClient.invalidateQueries({ queryKey: ["workEntries"] });
      await queryClient.invalidateQueries({ queryKey: ["analyticsSummary"] });
      await queryClient.invalidateQueries({ queryKey: ["earningsTrend"] });
      await queryClient.invalidateQueries({ queryKey: ["jobDistribution"] });
      await queryClient.invalidateQueries({ queryKey: ["weeklyPattern"] });

      // Force refetch analytics summary
      await queryClient.refetchQueries({ queryKey: ["analyticsSummary"] });

      setEditingEntryId(null);
      setEditFormData(null);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || t("failedToUpdateWorkEntry"));
    },
  });

  const handleJobSelection = (jobId: string) => {
    setSelectedJobIds((prev) => {
      const newSelectedJobIds = prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId];

      setJobHours((currentHours) => {
        const newHours = { ...currentHours };
        if (!newSelectedJobIds.includes(jobId)) {
          delete newHours[jobId];
        } else if (!(jobId in newHours)) {
          newHours[jobId] = "8"; // Default hours
        }
        return newHours;
      });

      return newSelectedJobIds;
    });
  };

  const handleHoursChange = (jobId: string, value: string) => {
    setJobHours((prev) => ({ ...prev, [jobId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedJobIds.length === 0) {
      setError(t("pleaseSelectJob"));
      return;
    }

    if (
      !startTime ||
      selectedJobIds.some((id) => !jobHours[id] || Number(jobHours[id]) <= 0)
    ) {
      setError(t("startTimeAndHoursRequired"));
      return;
    }

    const startDateTime = new Date(startTime);

    const entries: CreateWorkEntryDto[] = selectedJobIds.map((jobId) => {
      const hoursWorked = Number(jobHours[jobId]);
      const endDateTime = new Date(
        startDateTime.getTime() + hoursWorked * 60 * 60 * 1000
      );
      return {
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        jobId: jobId,
      };
    });

    try {
      await Promise.all(
        entries.map((entry) => addWorkEntryMutation.mutateAsync(entry))
      );
      setShowAddForm(false);
      setSelectedJobIds([]);
      setJobHours({});
    } catch (err: any) {
      setError(err.response?.data?.message || t("failedToAddWorkEntry"));
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        t("confirmDelete", "Are you sure you want to delete this entry?")
      )
    ) {
      try {
        await deleteWorkEntryMutation.mutateAsync(id);
      } catch (err: any) {
        setError(err.response?.data?.message || t("failedToDeleteWorkEntry"));
      }
    }
  };

  const handleEdit = (entry: WorkEntry) => {
    const start = new Date(entry.startTime);
    const end = new Date(entry.endTime);
    const durationMs = end.getTime() - start.getTime();
    const breakMs = entry.breakDuration * 60 * 1000;
    const hours = (durationMs - breakMs) / (1000 * 60 * 60);

    setEditingEntryId(entry.id);
    setEditFormData({
      jobId: entry.job.id,
      hours: hours.toFixed(2),
    });
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingEntryId(null);
    setEditFormData(null);
    setError(null);
  };

  const handleUpdateEntry = async (entryId: string) => {
    if (!editFormData) return;

    const entry = entriesForSelectedDate.find((e) => e.id === entryId);
    if (!entry) return;

    const hours = Number(editFormData.hours);
    if (hours <= 0) {
      setError(t("startTimeAndHoursRequired"));
      return;
    }

    const startDateTime = new Date(entry.startTime);
    const endDateTime = new Date(
      startDateTime.getTime() + hours * 60 * 60 * 1000
    );

    const updateData: UpdateWorkEntryDto = {
      jobId: editFormData.jobId,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
    };

    try {
      await updateWorkEntryMutation.mutateAsync({
        id: entryId,
        data: updateData,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || t("failedToUpdateWorkEntry"));
    }
  };

  const { totalHours, totalEarnings } = selectedJobIds.reduce(
    (acc, jobId) => {
      const job = jobs?.find((j) => j.id === jobId);
      const hoursWorked = Number(jobHours[jobId]) || 0;
      if (job) {
        acc.totalHours += hoursWorked;
        acc.totalEarnings += hoursWorked * job.wagePerHour;
      }
      return acc;
    },
    { totalHours: 0, totalEarnings: 0 }
  );

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {selectedDate
              ? selectedDate.toLocaleDateString()
              : t("workEntries")}
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        {/* Show existing entries for this date */}
        {entriesForSelectedDate.length > 0 && (
          <div className={styles.existingEntries}>
            <h3>{t("existingEntries", "Existing Entries")}</h3>
            {entriesForSelectedDate.map((entry) => {
              const start = new Date(entry.startTime);
              const end = new Date(entry.endTime);
              const durationMs = end.getTime() - start.getTime();
              const breakMs = entry.breakDuration * 60 * 1000;
              const hours = (durationMs - breakMs) / (1000 * 60 * 60);

              const isEditing = editingEntryId === entry.id;

              return (
                <div key={entry.id} className={styles.entryCard}>
                  {isEditing ? (
                    // Edit mode
                    <>
                      <div className={styles.entryInfo}>
                        <div className={styles.formGroup}>
                          <label>{t("existedJobs")}:</label>
                          <select
                            value={editFormData?.jobId || entry.job.id}
                            onChange={(e) =>
                              setEditFormData((prev) =>
                                prev ? { ...prev, jobId: e.target.value } : null
                              )
                            }
                            className={styles.hourInput}
                            style={{ width: "200px" }}
                          >
                            {jobs?.map((job) => (
                              <option key={job.id} value={job.id}>
                                {job.name} ({job.wagePerHour}/hr)
                              </option>
                            ))}
                          </select>
                        </div>
                        <div
                          className={styles.formGroup}
                          style={{ marginTop: "0.5rem" }}
                        >
                          <label>{t("hoursWorked")}:</label>
                          <input
                            type="number"
                            value={editFormData?.hours || ""}
                            onChange={(e) =>
                              setEditFormData((prev) =>
                                prev ? { ...prev, hours: e.target.value } : null
                              )
                            }
                            min="0.1"
                            step="0.1"
                            className={styles.hourInput}
                            style={{ width: "100px" }}
                          />
                        </div>
                      </div>
                      <div className={styles.entryActions}>
                        <button
                          onClick={() => handleUpdateEntry(entry.id)}
                          className={styles.editButton}
                          disabled={updateWorkEntryMutation.isPending}
                        >
                          {updateWorkEntryMutation.isPending ? "⏳" : "✓"}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className={styles.deleteButton}
                          disabled={updateWorkEntryMutation.isPending}
                        >
                          ✕
                        </button>
                      </div>
                    </>
                  ) : (
                    // View mode
                    <>
                      <div className={styles.entryInfo}>
                        <div className={styles.entryJobName}>
                          {entry.job.name}
                        </div>
                        <div className={styles.entryDetails}>
                          <span>
                            {start.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {end.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span>
                            {hours.toFixed(2)} {t("hours", "hours")}
                          </span>
                          <span>
                            ${(hours * entry.job.wagePerHour).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className={styles.entryActions}>
                        <button
                          onClick={() => handleEdit(entry)}
                          className={styles.editButton}
                          disabled={
                            deleteWorkEntryMutation.isPending ||
                            editingEntryId !== null
                          }
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className={styles.deleteButton}
                          disabled={
                            deleteWorkEntryMutation.isPending ||
                            editingEntryId !== null
                          }
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add Entry Form */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className={styles.addButton}
          >
            + {t("addNewEntry", "Add New Entry")}
          </button>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.formGroup}>
              <label>{t("existedJobs")}:</label>
              {isLoadingJobs && <p>{t("loadingJobs")}</p>}
              {isErrorJobs && <p>{t("errorLoadingJobs")}</p>}
              {jobs && jobs.length > 0 && (
                <div className={styles.jobList}>
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className={`${styles.jobItemWrapper} ${
                        selectedJobIds.includes(job.id) ? styles.selected : ""
                      }`}
                    >
                      <div
                        className={styles.jobItem}
                        onClick={() => handleJobSelection(job.id)}
                      >
                        <label>
                          <input
                            type="checkbox"
                            className={styles.customCheckbox}
                            checked={selectedJobIds.includes(job.id)}
                            readOnly
                          />
                          <span />
                          {job.name} ({job.wagePerHour} / hr)
                        </label>
                      </div>
                      {selectedJobIds.includes(job.id) && (
                        <div className={styles.hourInputContainer}>
                          <label htmlFor={`hours-${job.id}`}>
                            {t("hoursWorked")}:
                          </label>
                          <input
                            id={`hours-${job.id}`}
                            type="number"
                            value={jobHours[job.id] || ""}
                            onChange={(e) =>
                              handleHoursChange(job.id, e.target.value)
                            }
                            min="0.1"
                            step="0.1"
                            required
                            className={styles.hourInput}
                            onClick={(e) => e.stopPropagation()} // Prevent job deselection
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {jobs && jobs.length === 0 && <p>{t("noJobsFound")}</p>}
            </div>

            {selectedJobIds.length > 0 && (
              <>
                <div className={styles.summarySection}>
                  <div className={styles.summaryItem}>
                    <h4>{t("totalHours")}</h4>
                    <p>{totalHours.toFixed(2)}</p>
                  </div>
                  <div className={styles.summaryItem}>
                    <h4>{t("estimatedEarnings")}</h4>
                    <p>{totalEarnings.toFixed(2)}</p>
                  </div>
                </div>
              </>
            )}

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedJobIds([]);
                  setJobHours({});
                  setError(null);
                }}
                disabled={addWorkEntryMutation.isPending}
              >
                {t("cancelButton")}
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={addWorkEntryMutation.isPending}
              >
                {addWorkEntryMutation.isPending
                  ? t("submitting")
                  : t("addEntryButton")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddEntryModal;
