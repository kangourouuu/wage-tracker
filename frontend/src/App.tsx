import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ResponsiveProvider } from './contexts/ResponsiveProvider'; // Import ResponsiveProvider
import './App.css';

function Root() {
  return <Navigate to="/dashboard" />;
}

function App() {
  return (
    <ResponsiveProvider> {/* Wrap with ResponsiveProvider */}
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
    </ResponsiveProvider>
  );
}

export default App;