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
  const isStaff = user && (user.portal === 'company' || ['Admin', 'Sales Manager', 'Salesperson', 'Finance', 'ADMIN', 'SALES_MANAGER', 'SALES_REP', 'FINANCE'].includes(user.role));
  if (!isAuthenticated || !user || !isStaff) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Security Check: Disabled or Locked Accounts cannot access protected company workspace
  if (user.status === 'INACTIVE' || user.status === 'LOCKED') {
    return (
      <CompanyLayout>
        <PermissionDenied
          title="Account Status Restriction"
          description="Your staff account has been deactivated or locked by an administrator. Please contact your organization administrator to restore access."
        />
      </CompanyLayout>
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

export default ProtectedCompanyRoute;
