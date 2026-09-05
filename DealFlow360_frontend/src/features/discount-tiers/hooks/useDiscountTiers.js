import { useState, useEffect, useCallback } from 'react';
import { discountTierService } from '../services/discountTierService';

/**
 * Custom hook to fetch and manage paginated discount tiers list with search & filter parameters.
 */
export const useDiscountTiers = (params = {}) => {
  const [discountTiers, setDiscountTiers] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTiers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await discountTierService.getDiscountTiers(params);
      const list = Array.isArray(response) ? response : (response?.data || response?.tiers || []);
      const meta = response?.meta || {};

      setDiscountTiers(list);
      setTotal(meta.total !== undefined ? meta.total : list.length);
      setTotalPages(meta.totalPages !== undefined ? meta.totalPages : 1);
    } catch (err) {
      setError(err?.message || 'Failed to load discount governance tiers.');
      setDiscountTiers([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [
    params.search,
    params.status,
    params.approvalLevel,
    params.page,
    params.pageSize,
    params.sortBy,
    params.sortOrder,
  ]);

  useEffect(() => {
    fetchTiers();
  }, [fetchTiers]);

  return {
    discountTiers,
    tiers: discountTiers,
    total,
    totalPages,
    isLoading,
    loading: isLoading,
    error,
    refetch: fetchTiers,
  };
};

export default useDiscountTiers;
