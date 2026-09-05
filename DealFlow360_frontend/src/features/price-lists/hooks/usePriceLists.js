import { useState, useEffect, useCallback } from 'react';
import { priceListService } from '../services/priceListService';

/**
 * Custom hook to manage Price Lists state, backend query filters, and pagination.
 *
 * @param {Object} [initialFilters={}]
 * @returns {Object} Price lists state and actions
 */
export const usePriceLists = (initialFilters = {}) => {
  const [priceLists, setPriceLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Query state
  const [search, setSearch] = useState(initialFilters.search || '');
  const [currency, setCurrency] = useState(initialFilters.currency || '');
  const [status, setStatus] = useState(initialFilters.status || '');
  const [page, setPage] = useState(initialFilters.page || 1);
  const [pageSize, setPageSize] = useState(initialFilters.pageSize || 10);
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'name');
  const [sortOrder, setSortOrder] = useState(initialFilters.sortOrder || 'asc');

  // Pagination metadata
  const [paginationMeta, setPaginationMeta] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  });

  const fetchPriceLists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await priceListService.getPriceLists({
        page,
        pageSize,
        search,
        currency,
        status,
        sortBy,
        sortOrder,
      });

      const list = Array.isArray(response) ? response : (response?.data || response?.priceLists || []);
      const meta = response?.meta || response?.pagination || {
        currentPage: page,
        pageSize,
        totalCount: list.length,
        totalPages: Math.ceil(list.length / pageSize) || 1,
      };

      setPriceLists(list);
      setPaginationMeta({
        currentPage: meta.currentPage || page,
        pageSize: meta.pageSize || pageSize,
        totalCount: meta.totalCount || 0,
        totalPages: meta.totalPages || 1,
      });
    } catch (err) {
      setError(err?.message || 'Failed to load price lists from server.');
      setPriceLists([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, currency, status, sortBy, sortOrder]);

  useEffect(() => {
    fetchPriceLists();
  }, [fetchPriceLists]);

  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    setPage(1);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setCurrency('');
    setStatus('');
    setPage(1);
  };

  return {
    priceLists,
    loading,
    error,
    pagination: paginationMeta,
    filters: {
      search,
      currency,
      status,
      page,
      pageSize,
      sortBy,
      sortOrder,
    },
    actions: {
      setSearch: handleSearchChange,
      setCurrency: handleCurrencyChange,
      setStatus: handleStatusChange,
      setPage: handlePageChange,
      setPageSize: handlePageSizeChange,
      setSortBy: handleSortChange,
      clearFilters,
      refetch: fetchPriceLists,
    },
  };
};

export default usePriceLists;
