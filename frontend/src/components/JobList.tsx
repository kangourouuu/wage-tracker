import React, { useState } from "react";
import type { Job } from "../types/work-entry";
import styles from "./JobList.module.css";
import { useTranslation } from "react-i18next";
import { useResponsive } from "../contexts/ResponsiveContext"; // Import useResponsive

interface JobListProps {
  jobs: Job[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: { name: string; wagePerHour: number }) => void;
  isDeleting: boolean;
  isUpdating: boolean;
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  onDelete,
  onUpdate,
  isDeleting,
  isUpdating,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive(); // Use the responsive hook
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editWage, setEditWage] = useState("");

  const handleDelete = (id: string) => {
    if (window.confirm(t("confirmDelete"))) {
      onDelete(id);
    }
  };

  const handleEdit = (job: Job) => {
    setEditingId(job.id);
    setEditName(job.name);
    setEditWage(job.wagePerHour.toString());
  };

  const handleSave = (id: string) => {
    const wage = parseFloat(editWage);
    if (!editName.trim() || isNaN(wage) || wage <= 0) {
      alert(t("invalidJobData") || "Please enter valid job name and wage");
      return;
    }
    onUpdate(id, { name: editName.trim(), wagePerHour: wage });
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditName("");
    setEditWage("");
  };

  if (!jobs || jobs.length === 0) {
    return <p>{t("noJobsFound")}</p>;
  }

  if (isMobile) {
    return (
      <div className={styles.jobList}>
        <h2>{t("yourJobs")}</h2>
        <div className={styles.cardList}>
          {jobs.map((job) => (
            <div key={job.id} className={styles.card}>
              {editingId === job.id ? (
                <>
                  <div className={styles.cardRow}>
                    <strong>{t("jobName")}:</strong>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className={styles.editInput}
                    />
                  </div>
                  <div className={styles.cardRow}>
                    <strong>{t("wagePerHour")}:</strong>
                    <input
                      type="number"
                      step="0.01"
                      value={editWage}
                      onChange={(e) => setEditWage(e.target.value)}
                      className={styles.editInput}
                    />
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      onClick={() => handleSave(job.id)}
                      className={styles.saveButton}
                      disabled={isUpdating}
                    >
                      {t("save") || "Save"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className={styles.cancelButton}
                      disabled={isUpdating}
                    >
                      {t("cancel") || "Cancel"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.cardRow}>
                    <strong>{t("jobName")}:</strong> {job.name}
                  </div>
                  <div className={styles.cardRow}>
                    <strong>{t("wagePerHour")}:</strong> {job.wagePerHour}
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      onClick={() => handleEdit(job)}
                      className={styles.editButton}
                      disabled={isDeleting || isUpdating}
                    >
                      {t("edit") || "Edit"}
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className={styles.deleteButton}
                      disabled={isDeleting || isUpdating}
                    >
                      {t("delete")}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.jobList}>
      <h2>{t("yourJobs")}</h2>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>{t("jobName")}</th>
              <th>{t("wagePerHour")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                {editingId === job.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className={styles.editInput}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={editWage}
                        onChange={(e) => setEditWage(e.target.value)}
                        className={styles.editInput}
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => handleSave(job.id)}
                        className={styles.saveButton}
                        disabled={isUpdating}
                      >
                        {t("save") || "Save"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className={styles.cancelButton}
                        disabled={isUpdating}
                      >
                        {t("cancel") || "Cancel"}
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{job.name}</td>
                    <td>{job.wagePerHour}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(job)}
                        className={styles.editButton}
                        disabled={isDeleting || isUpdating}
                      >
                        {t("edit") || "Edit"}
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className={styles.deleteButton}
                        disabled={isDeleting || isUpdating}
                      >
                        {t("delete")}
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobList;
