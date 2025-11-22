import React from "react";
import { format } from "date-fns";
import {
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import type { WorkEntry } from "../types/work-entry";
import { useTranslation } from "react-i18next";
import styles from "./RecentEntries.module.css";

interface RecentEntriesProps {
  entries: WorkEntry[];
  onEdit: (entry: WorkEntry) => void;
  onDelete: (id: string) => void;
  onDuplicate: (entry: WorkEntry) => void;
  isLoading: boolean;
}

export const RecentEntries = ({
  entries,
  onEdit,
  onDelete,
  onDuplicate,
  isLoading,
}: RecentEntriesProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return <div className="text-text-secondary">{t("loadingEntries")}</div>;
  }

  if (entries.length === 0) {
    return <div className="text-text-secondary">{t("noEntriesFound")}</div>;
  }

  // Sort entries by date (newest first) and take top 5
  const recentEntries = [...entries]
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-3">
      {recentEntries.map((entry) => (
        <div
          key={entry.id}
          className="group flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
        >
          <div className="flex flex-col">
            <span className="font-medium text-text-primary">
              {entry.job.name}
            </span>
            <span className="text-sm text-text-secondary">
              {format(new Date(entry.startTime), "MMM d, yyyy")} •{" "}
              {format(new Date(entry.startTime), "HH:mm")} -{" "}
              {format(new Date(entry.endTime), "HH:mm")}
            </span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onDuplicate(entry)}
              className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
              title={t("common.duplicate")}
            >
              <DocumentDuplicateIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(entry)}
              className="p-1.5 rounded-lg text-text-secondary hover:text-secondary hover:bg-secondary/10 transition-colors"
              title={t("common.edit")}
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(entry.id)}
              className="p-1.5 rounded-lg text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
              title={t("common.delete")}
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
