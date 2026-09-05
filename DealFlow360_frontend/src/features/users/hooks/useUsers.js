import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';

/**
 * Custom Hook for managing Staff Users list, filtering, pagination, and status toggles.
 */
export const useUsers = (initialParams = {}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const [search, setSearch] = useState(initialParams.search || '');
  const [roleIdFilter, setRoleIdFilter] = useState(initialParams.roleId || 'ALL');
  const [statusFilter, setStatusFilter] = useState(initialParams.status || 'ALL');
  const [page, setPage] = useState(initialParams.page || 1);
  const [pageSize, setPageSize] = useState(initialParams.pageSize || 10);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getUsers({
        search,
        roleId: roleIdFilter,
        status: statusFilter,
        page,
        pageSize,
      });

      setUsers(response.data || []);
      if (response.meta) {
        setMeta(response.meta);
      }
    } catch (err) {
      console.error('[useUsers] Failed to fetch staff users:', err);
      setError(err.message || 'Failed to load staff user accounts.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [search, roleIdFilter, statusFilter, page, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleRoleFilterChange = (roleId) => {
    setRoleIdFilter(roleId);
    setPage(1);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1);
  };

  const toggleUserStatus = async (userId, newStatus) => {
    try {
      await userService.updateUserStatus(userId, newStatus);
      await fetchUsers();
      return { success: true };
    } catch (err) {
      console.error('[useUsers] Failed to toggle status:', err);
      return { success: false, error: err.message || 'Failed to update user status.' };
    }
  };

  return {
    users,
    loading,
    error,
    meta,
    search,
    roleIdFilter,
    statusFilter,
    page,
    pageSize,
    setSearch: handleSearchChange,
    setRoleIdFilter: handleRoleFilterChange,
    setStatusFilter: handleStatusFilterChange,
    setPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    refetch: fetchUsers,
    toggleUserStatus,
  };
};

export default useUsers;
