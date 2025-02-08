// PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const PrivateRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // No specific roles required or user has required role
  if (allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
    return <Outlet />;
  }

  // User's role is not authorized
  return <Navigate to={`/${user.role}-dashboard`} replace />;
};

export default PrivateRoute;
