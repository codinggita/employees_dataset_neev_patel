import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * AdminRoute — Renders <Outlet /> only if the authenticated user has the 'admin' role.
 * Redirects non-admin users to /dashboard.
 */
export default function AdminRoute() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
