import { useState, useEffect, useCallback } from 'react';
import { quotationService } from '../services/quotationService';

export const useQuotations = (initialParams = {}) => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

  const [search, setSearch] = useState(initialParams.search || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [statusFilter, setStatusFilter] = useState(initialParams.status || 'ALL');
  const [priceListFilter, setPriceListFilter] = useState(initialParams.priceListId || 'ALL');
  const [page, setPage] = useState(initialParams.page || 1);
  const [pageSize, setPageSize] = useState(initialParams.pageSize || 10);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchQuotations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await quotationService.getQuotations({
        page,
        pageSize,
        search: debouncedSearch,
        status: statusFilter,
        priceListId: priceListFilter,
      });

      if (Array.isArray(res)) {
        setQuotations(res);
        setMeta({ total: res.length, page: 1, limit: res.length, totalPages: 1 });
      } else {
        setQuotations(res.data || []);
        setMeta(res.meta || { total: 0, page: 1, limit: pageSize, totalPages: 1 });
      }
    } catch (err) {
      console.error('[useQuotations] Error fetching quotations:', err);
      setError(err.message || 'Failed to load sales quotations.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, statusFilter, priceListFilter]);

  useEffect(() => {
    fetchQuotations();
  }, [fetchQuotations]);

  return {
    quotations,
    loading,
    error,
    meta,
    search,
    statusFilter,
    priceListFilter,
    page,
    pageSize,
    setSearch,
    setStatusFilter,
    setPriceListFilter,
    setPage,
    setPageSize,
    refetch: fetchQuotations,
  };
};

export default useQuotations;
