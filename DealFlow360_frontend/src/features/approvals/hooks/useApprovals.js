import { useState, useEffect, useCallback } from 'react';
import { approvalService } from '../services/approvalService';

/**
 * Custom Hook for fetching and managing approval queue records.
 */
export const useApprovals = (initialFilters = {}) => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 1 });

  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
    approvalLevel: 'ALL',
    riskLevel: 'ALL',
    ...initialFilters,
  });

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await approvalService.getApprovalQueue({
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...filters,
      });

      const records = Array.isArray(res) ? res : res.data || [];
      const meta = res.meta || { total: records.length, page: 1, limit: 10, totalPages: 1 };

      setQueue(records);
      setPagination((prev) => ({
        ...prev,
        total: meta.total || records.length,
        totalPages: meta.totalPages || 1,
      }));
    } catch (err) {
      setError(err.message || 'Failed to load approval queue records.');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.pageSize]);

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) fetchQueue();
    }, 250);

    return () => {
      clearTimeout(timer);
      isMounted = false;
    };
  }, [fetchQueue]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const changePage = useCallback((newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  }, []);

  return {
    queue,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    changePage,
    refetch: fetchQueue,
  };
};
