// src/components/common/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";


export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user"); // optional cached user
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (err) {
    user = null;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const role = user?.role;
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
