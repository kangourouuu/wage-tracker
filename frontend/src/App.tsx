import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './pages/Dashboard';
import { ResponsiveProvider } from './contexts/ResponsiveProvider';
import ThreeScene from './pages/ThreeScene'; // Import ThreeScene
import './App.css';

function Root() {
  return <Navigate to="/dashboard" />;
}

function App() {
  const location = useLocation();
  const showThreeScene = location.pathname === '/login' || location.pathname === '/register';

  return (
    <ResponsiveProvider>
      {showThreeScene && <ThreeScene />} {/* Render ThreeScene as background only on auth pages */}
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<AuthForm isLogin />} />
        <Route path="/register" element={<AuthForm isLogin={false} />} />
        <Route
          path="/dashboard"
          element={<Dashboard />} // Temporarily removed ProtectedRoute
        />
      </Routes>
    </ResponsiveProvider>
  );
}

export default App;