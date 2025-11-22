import { useState, createContext, useContext, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { useAuthStore } from "../store/authStore";
import { useAiAssistantStore } from "../features/ai-assistant/store/aiAssistantStore";
import TimeOfDayIcon from "./TimeOfDayIcon";
import { DarkModeToggle } from "../shared/components/ui";
import { useTranslation } from "react-i18next";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

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
  const [headerActions, setHeaderActions] = useState<HeaderAction[]>([]);
  const { user, logout } = useAuthStore();
  const { toggle: toggleAssistant } = useAiAssistantStore();
  const { t, i18n } = useTranslation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const mainContentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <HeaderContext.Provider value={{ setHeaderActions }}>
      <div className="min-h-screen flex bg-transparent text-text-primary relative overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        <main className="flex-1 flex flex-col min-w-0 relative z-10 h-[100dvh] overflow-hidden">
          {/* Header */}
          <header className="h-20 flex-none flex items-center justify-between px-6 md:px-8">
            <div className="flex items-center gap-4">
              <div
                onClick={toggleAssistant}
                className="cursor-pointer hover:scale-110 transition-transform"
              >
                <TimeOfDayIcon />
              </div>
              <div>
                <h2 className="text-xl font-bold shadow-black/50 drop-shadow-md">
                  {t("dashboard.greeting")}{" "}
                  <span className="text-primary">{user?.name}</span>
                </h2>
                <p className="text-sm text-text-secondary hidden md:block font-medium shadow-black/20 drop-shadow-sm">
                  {new Date().toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {headerActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  title={action.title}
                >
                  {action.icon}
                </button>
              ))}

              <div className="hidden md:flex items-center gap-2 bg-white/5 rounded-lg p-1 backdrop-blur-sm">
                <button
                  onClick={() => changeLanguage("en")}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    i18n.language === "en"
                      ? "bg-primary text-white"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => changeLanguage("vi")}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    i18n.language === "vi"
                      ? "bg-primary text-white"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  VN
                </button>
              </div>

              <DarkModeToggle />

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold shadow-neon hover:scale-105 transition-transform"
                >
                  {user?.name?.charAt(0) || "U"}
                </button>

                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-text-primary">
                          {user?.name}
                        </p>
                        <p className="text-xs text-text-secondary truncate">
                          {user?.email}
                        </p>
                      </div>

                      <div className="md:hidden px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex gap-2">
                        <button
                          onClick={() => changeLanguage("en")}
                          className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                            i18n.language === "en"
                              ? "bg-primary text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-text-secondary"
                          }`}
                        >
                          EN
                        </button>
                        <button
                          onClick={() => changeLanguage("vi")}
                          className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                            i18n.language === "vi"
                              ? "bg-primary text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-text-secondary"
                          }`}
                        >
                          VN
                        </button>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/10 transition-colors flex items-center"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                        {t("logout")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div
            ref={mainContentRef}
            className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-32 md:pb-8 scroll-smooth"
          >
            <div className="max-w-7xl mx-auto w-full">
              <Outlet />
            </div>
          </div>

          {/* Mobile Bottom Nav */}
          <BottomNav />
        </main>
      </div>
    </HeaderContext.Provider>
  );
};
