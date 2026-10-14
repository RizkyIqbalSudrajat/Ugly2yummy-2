import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStaffAuth } from '../../context/StaffAuthContext';
import { StaffRole } from '../../types/staff';

interface StaffProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: StaffRole;
}

export const StaffProtectedRoute: React.FC<StaffProtectedRouteProps> = ({
  children,
  allowedRole,
}) => {
  const { isStaffLoggedIn, role } = useStaffAuth();
  const location = useLocation();

  if (!isStaffLoggedIn) {
    return <Navigate to="/internal/masuk" state={{ from: location }} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    // Jika role tidak sesuai, arahkan ke dashboard masing-masing atau login
    if (role === 'pekerja') {
      return <Navigate to="/internal/pekerja/ringkasan" replace />;
    }
    if (role === 'admin') {
      return <Navigate to="/internal/admin" replace />;
    }
    return <Navigate to="/internal/masuk" replace />;
  }

  return <>{children}</>;
};
