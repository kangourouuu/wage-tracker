import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './features/analytics/pages/Analytics';
import { AnalyticsDemo } from './pages/AnalyticsDemo';
import { Settings } from './pages/Settings';
import { ResponsiveProvider } from './contexts/ResponsiveProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PWAInstallPrompt } from './shared/components/ui/PWAInstallPrompt';
import { KeyboardShortcutsOverlay } from './components/KeyboardShortcutsOverlay';
import { Canvas } from '@react-three/fiber';
import ThreeScene from './pages/ThreeScene';
import { Toaster } from 'react-hot-toast';
import './App.css';

function Root() {
  return <Navigate to="/dashboard" />;
}

function App() {
  return (
    <ResponsiveProvider>
      <Toaster position="bottom-right" />
      <PWAInstallPrompt />
      <KeyboardShortcutsOverlay />
      <Canvas className="threeCanvas" gl={{ alpha: true }}>
        <ThreeScene />
      </Canvas>
      <div className="mainContainer">
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
      </div>
    </ResponsiveProvider>
  );
}

export default App;
