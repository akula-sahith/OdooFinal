import { useState, useEffect, useCallback } from 'react';
import { inventoryService } from '../services/inventoryService';

export const useInventoryMovements = (initialParams = {}) => {
  const [movements, setMovements] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: initialParams.search || '',
    movementType: initialParams.movementType || 'ALL',
    warehouseId: initialParams.warehouseId || 'ALL',
    page: initialParams.page || 1,
    pageSize: initialParams.pageSize || 10,
  });

  const fetchMovements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await inventoryService.getInventoryMovements(filters);
      setMovements(res.data || []);
      setMeta(res.meta || { total: (res.data || []).length, page: filters.page, limit: filters.pageSize, totalPages: 1 });
    } catch (err) {
      console.error('[useInventoryMovements] Error:', err);
      setError(err.message || 'Failed to load inventory movements.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

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
    movements,
    meta,
    loading,
    error,
    filters,
    updateFilters,
    setPage,
    refetch: fetchMovements,
  };
};
