import React, { lazy, Suspense } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProtectedRoute from './ProtectedRoute';

// Lazy load pages
const DashboardHome = lazy(() => import('../pages/DashboardHome'));
const EmployeesList = lazy(() => import('../pages/EmployeesList'));
const EmployeeDetail = lazy(() => import('../pages/EmployeeDetail'));
const AnalyticsDashboard = lazy(() => import('../pages/AnalyticsDashboard'));
const StatsDashboard = lazy(() => import('../pages/StatsDashboard'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export const routes = [
  // Public routes — no auth required
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },

  // Protected routes — require authentication
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: <DashboardLayout />,
        children: [
          { path: '', element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardHome /> },
          { path: 'employees', element: <EmployeesList /> },
          { path: 'employees/:id', element: <EmployeeDetail /> },
          { path: 'analytics', element: <AnalyticsDashboard /> },
          { path: 'stats', element: <StatsDashboard /> },
          { path: 'search', element: <SearchPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },

  // 404 fallback
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default function AppRoutes() {
  const element = useRoutes(routes);
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {element}
    </Suspense>
  );
}

