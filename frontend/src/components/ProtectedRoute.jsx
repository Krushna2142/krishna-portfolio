// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Simple auth check (replace with your actual logic)
  const isAuthenticated = localStorage.getItem('adminToken'); // for example

  if (!isAuthenticated) {
    // If not logged in, redirect to admin login
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated, show the protected component
  return children;
};

export default ProtectedRoute;
