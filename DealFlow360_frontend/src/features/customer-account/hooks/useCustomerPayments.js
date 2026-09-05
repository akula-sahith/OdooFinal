import { useState, useEffect, useCallback } from 'react';
import { customerPortalService } from '../services/customerPortalService';

export const useCustomerPayments = (initialParams = {}) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialParams);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerPortalService.getPayments(filters);
      setPayments(data);
    } catch (err) {
      console.error('Failed loading payments:', err);
      setError(err.message || 'Unable to load payment remittances.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { payments, loading, error, filters, setFilters, refetch: fetchPayments };
};
