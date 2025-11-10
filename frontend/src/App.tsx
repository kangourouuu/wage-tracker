import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import './App.css';

function Root() {
  const { accessToken } = useAuthStore();
  if (accessToken) {
    return <Navigate to="/dashboard" />;
  }
  return <Navigate to="/login" />;
}

function App() {
  return (
    <div className="mainContainer">
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<AuthForm isLogin />} />
        <Route path="/register" element={<AuthForm isLogin={false} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;