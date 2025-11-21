import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useState, useEffect } from "react";
import { AuthForm } from "./components/AuthForm";
import { ResponsiveProvider } from "./contexts/ResponsiveProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/AppLayout";
import { PWAInstallPrompt } from "./shared/components/ui/PWAInstallPrompt";
import { ShortcutsModal } from "./components/ShortcutsModal";

import {
  ErrorBoundary,
  OfflineBanner,
  Skeleton,
} from "./shared/components/feedback";
import { useResponsive } from "./contexts/ResponsiveContext";
import { Canvas } from "@react-three/fiber";
import ThreeScene from "./pages/ThreeScene";
import { Toaster } from "react-hot-toast";
import "./App.css";

// Lazy load routes for better performance
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((m) => ({ default: m.Dashboard }))
);
const Analytics = lazy(() =>
  import("./features/analytics/pages/Analytics").then((m) => ({
    default: m.Analytics,
  }))
);
const AnalyticsDemo = lazy(() =>
  import("./pages/AnalyticsDemo").then((m) => ({ default: m.AnalyticsDemo }))
);
const Settings = lazy(() =>
  import("./pages/Settings").then((m) => ({ default: m.Settings }))
);

function Root() {
  return <Navigate to="/dashboard" />;
}

function AppContent() {
  const { prefersReducedMotion, isOnline } = useResponsive();
  const shouldRender3D = !prefersReducedMotion;
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "?" &&
        !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)
      ) {
        setIsShortcutsOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Toaster position="bottom-right" />
      <PWAInstallPrompt />
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
      {!isOnline && <OfflineBanner />}

      {shouldRender3D && (
        <Canvas className="threeCanvas" gl={{ alpha: true }}>
          <ThreeScene />
        </Canvas>
      )}

      <ErrorBoundary>
        <Suspense
          fallback={
            <div
              style={{
                padding: "2rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
              }}
            >
              <Skeleton height="400px" width="90%" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" element={<AuthForm isLogin />} />
            <Route path="/register" element={<AuthForm isLogin={false} />} />
            <Route path="/analytics-demo" element={<AnalyticsDemo />} />

            {/* Protected Routes with AppLayout */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

function App() {
  return (
    <ResponsiveProvider>
      <AppContent />
    </ResponsiveProvider>
  );
}

export default App;
