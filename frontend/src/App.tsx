import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import ThreeScene from './pages/ThreeScene';
import './App.css';

function Root() {
  // const { accessToken } = useAuthStore();
  // if (accessToken) {
  //   return <Navigate to="/dashboard" />;
  // }
  // return <Navigate to="/login" />;
  return <Navigate to="/dashboard" />; // Temporarily navigate directly to dashboard
}

function App() {
  return (
    <div className="appContainer">
      <ThreeScene />
      <div className="contentOverlay">
        <Routes>
          <Route path="/login" element={<AuthForm isLogin />} />
          <Route path="/register" element={<AuthForm isLogin={false} />} />
          {/* Dashboard is now rendered within ThreeScene */}
          {/* <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          /> */}
          <Route path="/*" element={<Root />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;