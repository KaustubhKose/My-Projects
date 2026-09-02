import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isAuthenticated, currentRole, getDashboardPath } = useAuth();
  const location = useLocation();

  // 1. If not authenticated, redirect to /login preserving the requested path
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If authenticated but role is not allowed for this route, redirect to authorized dashboard
  if (allowedRoles && currentRole && !allowedRoles.includes(currentRole)) {
    const authorizedPath = getDashboardPath(currentRole);
    return <Navigate to={authorizedPath} replace />;
  }

  return <>{children}</>;
};
