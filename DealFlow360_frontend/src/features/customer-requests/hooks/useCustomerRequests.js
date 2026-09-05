import { useState, useEffect, useCallback } from 'react';
import { customerRequestService } from '../services/customerRequestService';

/**
 * Custom Hook for listing and filtering customer requirement requests.
 */
export const useCustomerRequests = (initialParams = {}) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const [search, setSearch] = useState(initialParams.search || '');
  const [statusFilter, setStatusFilter] = useState(initialParams.status || 'ALL');
  const [priorityFilter, setPriorityFilter] = useState(initialParams.priority || 'ALL');
  const [page, setPage] = useState(initialParams.page || 1);
  const [pageSize, setPageSize] = useState(initialParams.pageSize || 10);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerRequestService.getRequests({
        search,
        status: statusFilter,
        priority: priorityFilter,
        page,
        pageSize,
      });

      setRequests(response.data || []);
      if (response.meta) {
        setMeta(response.meta);
      }
    } catch (err) {
      console.error('[useCustomerRequests] Failed to fetch customer requests:', err);
      setError(err.message || 'Failed to load requirement requests.');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, page, pageSize]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handlePriorityFilterChange = (priority) => {
    setPriorityFilter(priority);
    setPage(1);
  };

  return {
    requests,
    loading,
    error,
    meta,
    search,
    statusFilter,
    priorityFilter,
    page,
    pageSize,
    setSearch: handleSearchChange,
    setStatusFilter: handleStatusFilterChange,
    setPriorityFilter: handlePriorityFilterChange,
    setPage,
    setPageSize,
    refetch: fetchRequests,
  };
};

export default useCustomerRequests;
