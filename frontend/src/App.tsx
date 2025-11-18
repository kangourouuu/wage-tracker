import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthForm } from './components/AuthForm';
import { ResponsiveProvider } from './contexts/ResponsiveProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PWAInstallPrompt } from './shared/components/ui/PWAInstallPrompt';
import { KeyboardShortcutsOverlay } from './components/KeyboardShortcutsOverlay';
import { ErrorBoundary, OfflineBanner, Skeleton } from './shared/components/feedback';
import { useResponsive } from './contexts/ResponsiveContext';
import { Canvas } from '@react-three/fiber';
import ThreeScene from './pages/ThreeScene';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Lazy load routes for better performance
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Analytics = lazy(() => import('./features/analytics/pages/Analytics').then(m => ({ default: m.Analytics })));
const AnalyticsDemo = lazy(() => import('./pages/AnalyticsDemo').then(m => ({ default: m.AnalyticsDemo })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));

function Root() {
  return <Navigate to="/dashboard" />;
}

function AppContent() {
  const { isMobile, prefersReducedMotion, isOnline } = useResponsive();
  const shouldRender3D = !isMobile && !prefersReducedMotion;

  return (
    <>
      <Toaster position="bottom-right" />
      <PWAInstallPrompt />
      <KeyboardShortcutsOverlay />
      {!isOnline && <OfflineBanner />}

      {shouldRender3D && (
        <Canvas className="threeCanvas" gl={{ alpha: true }}>
          <ThreeScene />
        </Canvas>
      )}

      <div className="mainContainer">
        <ErrorBoundary>
          <Suspense fallback={
            <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
              <Skeleton height="400px" width="90%" />
            </div>
          }>
            <Routes>
              <Route path="/" element={<Root />} />
              <Route path="/login" element={<AuthForm isLogin />} />
              <Route path="/register" element={<AuthForm isLogin={false} />} />
              <Route path="/analytics-demo" element={<AnalyticsDemo />} />
              <Route
                path="/dashboard"
                element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
              />
              <Route
                path="/analytics"
                element={<ProtectedRoute><Analytics /></ProtectedRoute>}
              />
              <Route
                path="/settings"
                element={<ProtectedRoute><Settings /></ProtectedRoute>}
              />
            </Routes>
          </Suspense>
        </ErrorBoundary>

      </div>
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
