import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

/**
 * Custom hook to manage backend-driven product list state, search, filtering, and pagination.
 *
 * @param {Object} [initialFilters={}]
 * @returns {Object} Product list state and actions
 */
export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Pagination parameters state
  const [search, setSearch] = useState(initialFilters.search || '');
  const [categoryId, setCategoryId] = useState(initialFilters.categoryId || '');
  const [status, setStatus] = useState(initialFilters.status || '');
  const [page, setPage] = useState(initialFilters.page || 1);
  const [pageSize, setPageSize] = useState(initialFilters.pageSize || 10);
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'name');
  const [sortOrder, setSortOrder] = useState(initialFilters.sortOrder || 'asc');

  // Pagination metadata state
  const [paginationMeta, setPaginationMeta] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts({
        page,
        pageSize,
        search,
        categoryId,
        status,
        sortBy,
        sortOrder,
      });

      // Handle standard response formats (array or paginated object)
      const dataList = Array.isArray(response) ? response : (response?.data || response?.products || []);
      const meta = response?.meta || response?.pagination || {
        currentPage: page,
        pageSize,
        totalCount: dataList.length,
        totalPages: Math.ceil(dataList.length / pageSize) || 1,
      };

      setProducts(dataList);
      setPaginationMeta({
        currentPage: meta.currentPage || page,
        pageSize: meta.pageSize || pageSize,
        totalCount: meta.totalCount || 0,
        totalPages: meta.totalPages || 1,
      });
    } catch (err) {
      setError(err?.message || 'Failed to load products from server.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, categoryId, status, sortBy, sortOrder]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handlers
  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    setPage(1); // Reset to first page on search
  };

  const handleCategoryChange = (newCategoryId) => {
    setCategoryId(newCategoryId);
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
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryId('');
    setStatus('');
    setPage(1);
  };

  return {
    products,
    loading,
    error,
    pagination: paginationMeta,
    filters: {
      search,
      categoryId,
      status,
      page,
      pageSize,
      sortBy,
      sortOrder,
    },
    actions: {
      setSearch: handleSearchChange,
      setCategoryId: handleCategoryChange,
      setStatus: handleStatusChange,
      setPage: handlePageChange,
      setPageSize: handlePageSizeChange,
      setSortBy: handleSortChange,
      clearFilters,
      refetch: fetchProducts,
    },
  };
};

export default useProducts;
