import { useState, useEffect, useCallback } from 'react';
import { customerQuotationService } from '../services/customerQuotationService';

export const useCustomerQuotations = (initialParams = {}) => {
  const [quotations, setQuotations] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: initialParams.search || '',
    status: initialParams.status || 'ALL',
    page: initialParams.page || 1,
    pageSize: initialParams.pageSize || 10,
  });

  const fetchQuotations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await customerQuotationService.getCustomerQuotations(filters);
      setQuotations(res.data || []);
      setMeta(
        res.meta || {
          total: (res.data || []).length,
          page: filters.page,
          limit: filters.pageSize,
          totalPages: 1,
        }
      );
    } catch (err) {
      console.error('[useCustomerQuotations] Fetch error:', err);
      setError(err.message || 'Failed to load customer quotations.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchQuotations();
  }, [fetchQuotations]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1, // Reset page on filter change
    }));
  };

  const setPage = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return {
    quotations,
    meta,
    loading,
    error,
    filters,
    updateFilters,
    setPage,
    refetch: fetchQuotations,
  };
};
