import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  HomeIcon,
  ChartBarIcon,
  CalendarIcon,
  BriefcaseIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export const BottomNav = () => {
  const { t } = useTranslation();

  const navItems = [
    { path: "/dashboard", icon: HomeIcon, label: t("nav.home") },
    { path: "/analytics", icon: ChartBarIcon, label: t("nav.analytics") },
    { path: "/calendar", icon: CalendarIcon, label: t("nav.calendar") },
    { path: "/jobs", icon: BriefcaseIcon, label: t("nav.jobs") },
    { path: "/settings", icon: Cog6ToothIcon, label: t("nav.settings") },
  ];

  return (
    <nav className="glass-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `p-2 rounded-xl transition-all duration-300 ${
              isActive
                ? "text-primary bg-white/10 shadow-neon"
                : "text-text-secondary hover:text-text-primary"
            }`
          }
        >
          <item.icon className="w-6 h-6" />
          <span className="sr-only">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
