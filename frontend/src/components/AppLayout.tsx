import { useState, useEffect, createContext, useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sidebar } from "./Sidebar";
import { DarkModeToggle } from "../shared/components/ui";
import { useAuthStore } from "../store/authStore";
import { useAiAssistantStore } from "../features/ai-assistant/store/aiAssistantStore";
import TimeOfDayIcon from "./TimeOfDayIcon";
import styles from "./AppLayout.module.css";

interface HeaderAction {
  icon: string;
  onClick: () => void;
  title?: string;
}

interface HeaderContextType {
  setHeaderActions: (actions: HeaderAction[]) => void;
}

const HeaderContext = createContext<HeaderContextType | null>(null);

export const useHeaderActions = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeaderActions must be used within AppLayout");
  }
  return context;
};

export const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [headerActions, setHeaderActions] = useState<HeaderAction[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const { toggle: toggleAssistant } = useAiAssistantStore();

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <HeaderContext.Provider value={{ setHeaderActions }}>
      <div className={styles.layout}>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className={styles.main}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <button
                className={styles.menuButton}
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open menu"
              >
                ☰
              </button>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAssistant();
                }}
                className={styles.assistantToggle}
              >
                <TimeOfDayIcon />
              </div>
              <h1 className={styles.welcomeTitle}>
                {t("welcome", { name: user?.name })}
              </h1>
            </div>
            <div className={styles.headerRight}>
              {headerActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={styles.actionButton}
                  title={action.title}
                >
                  {action.icon}
                </button>
              ))}
              <DarkModeToggle />
              <select
                onChange={(e) => changeLanguage(e.target.value)}
                value={i18n.language}
                className={styles.languageSwitcher}
              >
                <option value="en">English</option>
                <option value="vn">Tiếng Việt</option>
              </select>
              <button onClick={handleLogout} className={styles.logoutButton}>
                {t("logout")}
              </button>
            </div>
          </header>
          <Outlet />
        </main>
      </div>
    </HeaderContext.Provider>
  );
};
