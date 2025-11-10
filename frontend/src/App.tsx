import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import './App.css';

function Root() {
  return <Navigate to="/dashboard" />;
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
          element={<Dashboard />}
        />
      </Routes>
    </div>
  );
}

export default App;