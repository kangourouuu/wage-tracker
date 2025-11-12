import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './pages/Dashboard';
import { ResponsiveProvider } from './contexts/ResponsiveProvider';
import { ProtectedRoute } from './components/ProtectedRoute'; // Import ProtectedRoute
import './App.css';

function Root() {
  return <Navigate to="/dashboard" />;
}

function App() {
  return (
    <ResponsiveProvider>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<AuthForm isLogin />} />
        <Route path="/register" element={<AuthForm isLogin={false} />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} // Re-enabled ProtectedRoute
        />
      </Routes>
    </ResponsiveProvider>
  );
}

export default App;