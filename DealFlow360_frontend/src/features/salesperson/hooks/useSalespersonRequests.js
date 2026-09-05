import { useState, useEffect, useCallback } from 'react';
import { salespersonRequestService } from '../services/salespersonRequestService';

export const useSalespersonRequests = (initialParams = {}) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

  const [search, setSearch] = useState(initialParams.search || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [statusFilter, setStatusFilter] = useState(initialParams.status || 'ALL');
  const [priorityFilter, setPriorityFilter] = useState(initialParams.priority || 'ALL');
  const [assignmentFilter, setAssignmentFilter] = useState(initialParams.assignment || 'ALL');
  const [page, setPage] = useState(initialParams.page || 1);
  const [pageSize, setPageSize] = useState(initialParams.pageSize || 10);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await salespersonRequestService.getAssignedRequests({
        page,
        pageSize,
        search: debouncedSearch,
        status: statusFilter,
        priority: priorityFilter,
        assignment: assignmentFilter,
      });

      if (Array.isArray(response)) {
        setRequests(response);
        setMeta({ total: response.length, page: 1, limit: response.length, totalPages: 1 });
      } else {
        setRequests(response.data || []);
        setMeta(response.meta || { total: 0, page: 1, limit: pageSize, totalPages: 1 });
      }
    } catch (err) {
      console.error('[useSalespersonRequests] Error fetching request queue:', err);
      setError(err.message || 'Failed to load requirement request queue.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, statusFilter, priorityFilter, assignmentFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    loading,
    error,
    meta,
    search,
    statusFilter,
    priorityFilter,
    assignmentFilter,
    page,
    pageSize,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    setAssignmentFilter,
    setPage,
    setPageSize,
    refetch: fetchRequests,
  };
};

export default useSalespersonRequests;
