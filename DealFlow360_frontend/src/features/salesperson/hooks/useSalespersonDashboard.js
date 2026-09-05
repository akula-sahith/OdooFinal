import { useState, useEffect, useCallback } from 'react';
import { salespersonDashboardService } from '../services/salespersonDashboardService';

export const useSalespersonDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await salespersonDashboardService.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('[useSalespersonDashboard] Error loading metrics:', err);
      setError(err.message || 'Failed to fetch salesperson workspace metrics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics,
  };
};

export default useSalespersonDashboard;
