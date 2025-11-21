import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/authStore";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const navItems = [
    { path: "/dashboard", label: t("dashboard", "Dashboard") },
    { path: "/analytics", label: t("analytics", "Analytics") },
    { path: "/settings", label: t("settings", "Settings") },
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
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{user?.name?.charAt(0) || "U"}</div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{user?.name || "User"}</span>
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
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          <select
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            value={i18n.language}
            className={styles.languageSwitcher}
            style={{ marginBottom: "1rem", width: "100%" }}
          >
            <option value="en">English</option>
            <option value="vn">Tiếng Việt</option>
          </select>
          <button onClick={handleLogout} className={styles.logoutButton}>
            {t("logout", "Logout")}
          </button>
        </div>
      </aside>
    </>
  );
};
