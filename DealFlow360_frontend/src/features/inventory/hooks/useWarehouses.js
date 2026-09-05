import { useState, useEffect, useCallback } from 'react';
import { warehouseService } from '../services/warehouseService';

export const useWarehouses = (initialParams = {}) => {
  const [warehouses, setWarehouses] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: initialParams.search || '',
    status: initialParams.status || 'ALL',
    page: initialParams.page || 1,
    pageSize: initialParams.pageSize || 10,
  });

  const fetchWarehouses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await warehouseService.getWarehouses(filters);
      setWarehouses(res.data || []);
      setMeta(res.meta || { total: (res.data || []).length, page: filters.page, limit: filters.pageSize, totalPages: 1 });
    } catch (err) {
      console.error('[useWarehouses] Error:', err);
      setError(err.message || 'Failed to load warehouses.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  };

  const setPage = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return {
    warehouses,
    meta,
    loading,
    error,
    filters,
    updateFilters,
    setPage,
    refetch: fetchWarehouses,
  };
};
