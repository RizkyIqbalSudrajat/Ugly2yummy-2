import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSupplierAuth } from '../../context/SupplierAuthContext';

export const SupplierProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSupplierLoggedIn } = useSupplierAuth();
  const location = useLocation();

  if (!isSupplierLoggedIn) {
    return <Navigate to="/supplier/masuk" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
