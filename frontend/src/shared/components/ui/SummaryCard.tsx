import type { FC, ReactNode } from "react";
import { GlassCard } from "./GlassCard";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
} from "@heroicons/react/24/solid";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  color?: "primary" | "secondary" | "success" | "warning";
}

export const SummaryCard: FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = "primary",
}) => {
  const getColorClass = () => {
    switch (color) {
      case "secondary":
        return "text-secondary";
      case "success":
        return "text-success";
      case "warning":
        return "text-yellow-500";
      default:
        return "text-primary";
    }
  };

  const getBgClass = () => {
    switch (color) {
      case "secondary":
        return "bg-secondary/10";
      case "success":
        return "bg-success/10";
      case "warning":
        return "bg-yellow-500/10";
      default:
        return "bg-primary/10";
    }
  };

  return (
    <GlassCard className="relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${getBgClass()} ${getColorClass()}`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span
            className={`flex items-center font-medium ${
              trend.value > 0
                ? "text-success"
                : trend.value < 0
                ? "text-danger"
                : "text-text-secondary"
            }`}
          >
            {trend.value > 0 ? (
              <ArrowUpIcon className="w-4 h-4 mr-1" />
            ) : trend.value < 0 ? (
              <ArrowDownIcon className="w-4 h-4 mr-1" />
            ) : (
              <MinusIcon className="w-4 h-4 mr-1" />
            )}
            {Math.abs(trend.value)}%
          </span>
          {trend.label && (
            <span className="text-text-muted ml-2 text-xs">{trend.label}</span>
          )}
        </div>
      )}
    </GlassCard>
  );
};
