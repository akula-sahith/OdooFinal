import { useState, useEffect, useCallback } from 'react';
import { customerPortalService } from '../services/customerPortalService';

export const useCustomerInvoices = (initialParams = {}) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialParams);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerPortalService.getInvoices(filters);
      setInvoices(data);
    } catch (err) {
      console.error('Failed loading invoices:', err);
      setError(err.message || 'Unable to load commercial invoices.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return { invoices, loading, error, filters, setFilters, refetch: fetchInvoices };
};
