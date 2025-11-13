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
    return (
      <div className={styles.jobList}>
        <h2>{t("yourJobs")}</h2>
        <p className={styles.emptyState}>{t("noJobsFound")}</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className={styles.jobList}>
        <div className={styles.header}>
          <h2>{t("yourJobs")}</h2>
          <span className={styles.jobCount}>
            {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
          </span>
        </div>
        <div className={styles.cardList}>
          {jobs.map((job) => (
            <div key={job.id} className={styles.card}>
              {editingId === job.id ? (
                <>
                  <div className={styles.editForm}>
                    <div className={styles.formGroup}>
                      <label>{t("jobName")}</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className={styles.editInput}
                        placeholder={t("jobName")}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>{t("wagePerHour")}</label>
                      <div className={styles.inputWithUnit}>
                        <input
                          type="number"
                          step="0.01"
                          value={editWage}
                          onChange={(e) => setEditWage(e.target.value)}
                          className={styles.editInput}
                          placeholder="0.00"
                        />
                        <span className={styles.unit}>{t("currency")}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      onClick={() => handleSave(job.id)}
                      className={styles.saveButton}
                      disabled={isUpdating}
                    >
                      {isUpdating ? t("submitting") : t("save")}
                    </button>
                    <button
                      onClick={handleCancel}
                      className={styles.cancelButton}
                      disabled={isUpdating}
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.jobTitle}>{job.name}</h3>
                    <div className={styles.wageInfo}>
                      <span className={styles.wageAmount}>
                        {job.wagePerHour.toLocaleString()}
                      </span>
                      <span className={styles.wageCurrency}>
                        {t("currency")}
                        {t("perHour")}
                      </span>
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      onClick={() => handleEdit(job)}
                      className={styles.editButton}
                      disabled={isDeleting || isUpdating}
                    >
                      ✏️ {t("edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className={styles.deleteButton}
                      disabled={isDeleting || isUpdating}
                    >
                      🗑️ {t("delete")}
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
      <div className={styles.header}>
        <h2>{t("yourJobs")}</h2>
        <span className={styles.jobCount}>
          {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
        </span>
      </div>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>{t("jobName")}</th>
              <th>{t("wagePerHour")}</th>
              <th className={styles.actionsColumn}>{t("actions")}</th>
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
                        placeholder={t("jobName")}
                      />
                    </td>
                    <td>
                      <div className={styles.inputWithUnit}>
                        <input
                          type="number"
                          step="0.01"
                          value={editWage}
                          onChange={(e) => setEditWage(e.target.value)}
                          className={styles.editInput}
                          placeholder="0.00"
                        />
                        <span className={styles.unit}>{t("currency")}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          onClick={() => handleSave(job.id)}
                          className={styles.saveButton}
                          disabled={isUpdating}
                        >
                          {isUpdating ? t("submitting") : t("save")}
                        </button>
                        <button
                          onClick={handleCancel}
                          className={styles.cancelButton}
                          disabled={isUpdating}
                        >
                          {t("cancel")}
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      <span className={styles.jobNameCell}>{job.name}</span>
                    </td>
                    <td>
                      <span className={styles.wageCell}>
                        {job.wagePerHour.toLocaleString()} {t("currency")}
                        {t("perHour")}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          onClick={() => handleEdit(job)}
                          className={styles.editButton}
                          disabled={isDeleting || isUpdating}
                        >
                          ✏️ {t("edit")}
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className={styles.deleteButton}
                          disabled={isDeleting || isUpdating}
                        >
                          🗑️ {t("delete")}
                        </button>
                      </div>
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
