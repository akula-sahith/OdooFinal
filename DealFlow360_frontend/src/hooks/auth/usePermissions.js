import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { getRouteMetadata } from '../../app/config/routeMetadata';

export function usePermissions() {
  const { user, role, permissions = [] } = useAuth();

  const checkPermission = useMemo(() => {
    return (requiredPermission) => {
      if (!requiredPermission) return true;
      if (permissions.includes('*') || permissions.includes('admin.all')) return true;
      return permissions.includes(requiredPermission);
    };
  }, [permissions]);

  const checkAnyPermission = useMemo(() => {
    return (requiredPermissions = []) => {
      if (!requiredPermissions.length) return true;
      return requiredPermissions.some((p) => checkPermission(p));
    };
  }, [checkPermission]);

  const canAccessRoute = useMemo(() => {
    return (pathname) => {
      const meta = getRouteMetadata(pathname);
      if (!meta || !meta.permission) return true;
      return checkPermission(meta.permission);
    };
  }, [checkPermission]);

  return {
    user,
    role,
    permissions,
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    canAccessRoute,
    isAdmin: role === 'Admin',
    isSalesManager: role === 'Sales Manager',
    isSalesperson: role === 'Salesperson',
  };
}
