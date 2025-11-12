import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './pages/Dashboard';
import { ResponsiveProvider } from './contexts/ResponsiveProvider';
import { ProtectedRoute } from './components/ProtectedRoute'; // Import ProtectedRoute
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
      <Canvas className="threeCanvas" gl={{ alpha: true }}>
        <ThreeScene />
      </Canvas>
      <div className="mainContainer">
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<AuthForm isLogin />} />
          <Route path="/register" element={<AuthForm isLogin={false} />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>} // Re-enabled ProtectedRoute
          />
        </Routes>
      </div>
    </ResponsiveProvider>
  );
}

export default App;