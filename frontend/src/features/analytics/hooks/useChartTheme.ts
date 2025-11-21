import { useDarkMode } from "../../../shared/hooks/useDarkMode";

export const useChartTheme = () => {
  const { isDark } = useDarkMode();

  const colors = {
    text: isDark ? "#e2e8f0" : "#4a5568", // text-secondary-dark : text-secondary
    grid: isDark ? "#334155" : "#e2e8f0", // slate-700 : slate-200
    tooltipBg: isDark ? "#1e293b" : "#ffffff", // slate-800 : white
    tooltipBorder: isDark ? "#475569" : "#e2e8f0", // slate-600 : slate-200
    earnings: {
      stroke: "#8b5cf6", // violet-500
      fill: isDark ? "#8b5cf6" : "#8b5cf6",
      gradientStart: isDark ? 0.6 : 0.8,
      gradientEnd: 0.1,
    },
    hours: {
      stroke: "#10b981", // emerald-500
      fill: isDark ? "#10b981" : "#10b981",
      gradientStart: isDark ? 0.6 : 0.8,
      gradientEnd: 0.1,
    },
  };

  return colors;
};
