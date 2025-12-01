import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute
 * - If a token exists in localStorage (or another check you prefer) render children.
 * - Otherwise redirect to /admin/login.
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}