import { useState, useEffect, useCallback } from 'react';
import { roleService } from '../services/roleService';

/**
 * Custom hook to fetch and manage paginated roles list with search & status parameters.
 */
export const useRoles = (params = {}) => {
  const [roles, setRoles] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await roleService.getRoles(params);
      const list = Array.isArray(response) ? response : (response?.data || response?.roles || []);
      const meta = response?.meta || {};

      setRoles(list);
      setTotal(meta.total !== undefined ? meta.total : list.length);
      setTotalPages(meta.totalPages !== undefined ? meta.totalPages : 1);
    } catch (err) {
      setError(err?.message || 'Failed to load security roles.');
      setRoles([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [params.search, params.status, params.page, params.pageSize]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    total,
    totalPages,
    isLoading,
    loading: isLoading,
    error,
    refetch: fetchRoles,
  };
};

export default useRoles;
