import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';

export const ProtectedCompanyRoute = ({ children }) => {
  const { isAuthenticated, isLoading, portal } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-slate-700 text-sm font-medium">
        Validating Staff Session...
      </div>
    );
  }

  if (!isAuthenticated || portal !== 'company') {
    return <Navigate to="/m-entry-z7829a/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
