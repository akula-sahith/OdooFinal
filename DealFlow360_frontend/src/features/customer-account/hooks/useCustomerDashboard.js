import { useState, useEffect, useCallback } from 'react';
import { customerPortalService } from '../services/customerPortalService';

export const useCustomerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerPortalService.getDashboard();
      setDashboard(data);
    } catch (err) {
      console.error('Failed fetching customer dashboard:', err);
      setError(err.message || 'Unable to load customer dashboard statistics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { dashboard, loading, error, refetch: fetchDashboard };
};
