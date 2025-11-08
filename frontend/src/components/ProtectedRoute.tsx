import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // const { accessToken } = useAuthStore();

  // if (!accessToken) {
  //   return <Navigate to="/login" />;
  // }

  return children;
};
