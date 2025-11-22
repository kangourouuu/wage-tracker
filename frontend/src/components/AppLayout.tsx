import { useState, createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { useAuthStore } from "../store/authStore";
import { useAiAssistantStore } from "../features/ai-assistant/store/aiAssistantStore";
import TimeOfDayIcon from "./TimeOfDayIcon";
import { DarkModeToggle } from "../shared/components/ui";
import { useTranslation } from "react-i18next";

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
  const { user } = useAuthStore();
  const { toggle: toggleAssistant } = useAiAssistantStore();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <HeaderContext.Provider value={{ setHeaderActions }}>
      <div className="min-h-screen flex bg-background text-text-primary relative overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        <main className="flex-1 flex flex-col min-w-0 relative z-10">
          {/* Header */}
          <header className="h-20 flex items-center justify-between px-6 md:px-8">
            <div className="flex items-center gap-4">
              <div
                onClick={toggleAssistant}
                className="cursor-pointer hover:scale-110 transition-transform"
              >
                <TimeOfDayIcon />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {t("dashboard.greeting")}{" "}
                  <span className="text-primary">{user?.name}</span>
                </h2>
                <p className="text-sm text-text-secondary hidden md:block">
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

              <div className="hidden md:flex items-center gap-2 bg-white/5 rounded-lg p-1">
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

              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold shadow-neon">
                {user?.name?.charAt(0) || "U"}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
            <Outlet />
          </div>

          {/* Mobile Bottom Nav */}
          <BottomNav />
        </main>
      </div>
    </HeaderContext.Provider>
  );
};
