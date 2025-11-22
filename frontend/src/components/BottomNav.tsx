import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  HomeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export const BottomNav = () => {
  const { t } = useTranslation();

  const navItems = [
    { path: "/dashboard", icon: HomeIcon, label: t("nav.home") },
    { path: "/analytics", icon: ChartBarIcon, label: t("nav.analytics") },
    { path: "/settings", icon: Cog6ToothIcon, label: t("nav.settings") },
  ];

  return (
    <nav className="glass-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
              isActive
                ? "text-primary bg-primary/10 scale-110"
                : "text-text-secondary hover:text-primary hover:bg-white/5"
            }`
          }
        >
          <item.icon className="w-6 h-6" />
          <span className="text-xs font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
