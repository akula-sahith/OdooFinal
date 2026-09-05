import { useState, useEffect, useCallback } from 'react';
import { customerPortalService } from '../services/customerPortalService';

export const useCustomerShipments = (initialParams = {}) => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialParams);

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerPortalService.getShipments(filters);
      setShipments(data);
    } catch (err) {
      console.error('Failed loading shipments:', err);
      setError(err.message || 'Unable to load shipment consignments.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  return { shipments, loading, error, filters, setFilters, refetch: fetchShipments };
};
