import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  HomeIcon,
  ChartBarIcon,
  CalendarIcon,
  BriefcaseIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { GlassPanel } from "../shared/components/ui/GlassPanel";

export const Sidebar = () => {
  const { t } = useTranslation();

  const navItems = [
    { path: "/dashboard", icon: HomeIcon, label: t("nav.home") },
    { path: "/analytics", icon: ChartBarIcon, label: t("nav.analytics") },
    { path: "/calendar", icon: CalendarIcon, label: t("nav.calendar") },
    { path: "/jobs", icon: BriefcaseIcon, label: t("nav.jobs") },
    { path: "/settings", icon: Cog6ToothIcon, label: t("nav.settings") },
  ];

  return (
    <GlassPanel className="hidden md:flex flex-col w-64 h-[calc(100vh-2rem)] m-4 sticky top-4">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          WageTracker
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? "bg-primary/20 text-primary shadow-neon border border-primary/20"
                  : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
              }`
            }
          >
            <item.icon className="w-6 h-6 mr-3" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        {/* User profile summary or logout could go here */}
      </div>
    </GlassPanel>
  );
};
