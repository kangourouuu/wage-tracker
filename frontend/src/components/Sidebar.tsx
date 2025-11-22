import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  HomeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { GlassPanel } from "../shared/components/ui/GlassPanel";
import { useAuthStore } from "../store/authStore";

export const Sidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const navItems = [
    { path: "/dashboard", icon: HomeIcon, label: t("nav.home") },
    { path: "/analytics", icon: ChartBarIcon, label: t("nav.analytics") },
    { path: "/settings", icon: Cog6ToothIcon, label: t("nav.settings") },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
                  : "text-gray-700 dark:text-gray-300 hover:bg-white/10 hover:text-text-primary"
              }`
            }
          >
            <item.icon className="w-6 h-6 mr-3" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}

        {/* Logout Button - Desktop Only */}
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 rounded-xl text-text-secondary hover:bg-danger/10 hover:text-danger transition-all duration-300"
        >
          <ArrowRightOnRectangleIcon className="w-6 h-6 mr-3" />
          <span className="font-medium">{t("logout")}</span>
        </button>
      </nav>

      <div className="p-4">{/* User profile summary could go here */}</div>
    </GlassPanel>
  );
};
