import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';
import { usePermissions } from '../../hooks/auth/usePermissions';
import { CompanyLayout } from '../../layouts/CompanyLayout/CompanyLayout';
import { CompanyShellSkeleton } from '../../components/feedback/Skeleton/CompanyShellSkeleton';
import { PermissionDenied } from '../../pages/company/PermissionDenied';

export const ProtectedCompanyRoute = ({ children, requiredPermission }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { hasPermission } = usePermissions();
  const location = useLocation();

  // Show shell skeleton while restoring session or permissions
  if (isLoading) {
    return <CompanyShellSkeleton />;
  }

  // Redirect to company staff login if not authenticated or not staff portal
  if (!isAuthenticated || !user || user.portal !== 'company') {
    return (
      <Navigate
        to="/m-entry-z7829a/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Check route level permission if specified
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <CompanyLayout>
        <PermissionDenied />
      </CompanyLayout>
    );
  }

  return <CompanyLayout>{children}</CompanyLayout>;
};
