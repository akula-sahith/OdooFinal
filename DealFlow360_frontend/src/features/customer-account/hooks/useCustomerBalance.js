import { useState, useEffect, useCallback } from 'react';
import { customerPortalService } from '../services/customerPortalService';

export const useCustomerBalance = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerPortalService.getBalanceSummary();
      setBalance(data);
    } catch (err) {
      console.error('Failed loading balance summary:', err);
      setError(err.message || 'Unable to calculate financial balance summary.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, loading, error, refetch: fetchBalance };
};
