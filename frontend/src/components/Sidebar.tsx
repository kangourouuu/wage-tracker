import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/authStore";
import { useAiAssistantStore } from "../features/ai-assistant/store/aiAssistantStore";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const { toggle: toggleAssistant } = useAiAssistantStore();

  const navItems = [
    { path: "/dashboard", icon: "🏠", label: t("dashboard", "Dashboard") },
    { path: "/analytics", icon: "📊", label: t("analytics", "Analytics") },
    { path: "/settings", icon: "⚙️", label: t("settings", "Settings") },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose?.();
  };

  const handleNavClick = () => {
    onClose?.();
  };

  return (
    <>
      <div
        className={`${styles.backdrop} ${isOpen ? styles.open : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>WT</div>
          <h1 className={styles.appName}>Wage Tracker</h1>
          {onClose && (
            <button
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Close menu"
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.userInfo}>
          <div className={styles.avatar}>{user?.name?.charAt(0) || "U"}</div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{user?.name || "User"}</span>
            <span className={styles.userEmail}>{user?.email}</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </NavLink>
          ))}

          <button
            onClick={() => {
              toggleAssistant();
              handleNavClick();
            }}
            className={styles.navItem}
          >
            <span className={styles.icon}>💬</span>
            <span className={styles.label}>{t("assistant", "Assistant")}</span>
          </button>
        </nav>

        <div className={styles.footer}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <span className={styles.icon}>🚪</span>
            <span className={styles.label}>{t("logout", "Logout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
