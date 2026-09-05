import { useState, useEffect, useCallback } from 'react';
import { inventoryService } from '../services/inventoryService';

export const useInventory = (initialParams = {}) => {
  const [stockRecords, setStockRecords] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: initialParams.search || '',
    warehouseId: initialParams.warehouseId || 'ALL',
    status: initialParams.status || 'ALL',
    page: initialParams.page || 1,
    pageSize: initialParams.pageSize || 10,
  });

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await inventoryService.getInventory(filters);
      setStockRecords(res.data || []);
      setMeta(res.meta || { total: (res.data || []).length, page: filters.page, limit: filters.pageSize, totalPages: 1 });
    } catch (err) {
      console.error('[useInventory] Error:', err);
      setError(err.message || 'Failed to load inventory stock.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

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

  const adjustStock = async (data) => {
    setAdjusting(true);
    setError(null);
    try {
      const res = await inventoryService.adjustStock(data);
      await fetchInventory();
      return res;
    } catch (err) {
      setError(err.message || 'Failed to adjust stock.');
      throw err;
    } finally {
      setAdjusting(false);
    }
  };

  const transferStock = async (data) => {
    setAdjusting(true);
    setError(null);
    try {
      const res = await inventoryService.transferInventory(data);
      await fetchInventory();
      return res;
    } catch (err) {
      setError(err.message || 'Failed to transfer stock.');
      throw err;
    } finally {
      setAdjusting(false);
    }
  };

  return {
    stockRecords,
    meta,
    loading,
    adjusting,
    error,
    filters,
    updateFilters,
    setPage,
    adjustStock,
    transferStock,
    refetch: fetchInventory,
  };
};
