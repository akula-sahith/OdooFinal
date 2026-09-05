/**
 * Custom hook for shipment listing and creation
 * Phase 13 — DealFlow360
 */

import { useState, useEffect, useCallback } from 'react';
import { fulfillmentService } from '../services/fulfillmentService';

export const useShipments = (initialParams = {}) => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fulfillmentService.getShipments(params);
      setShipments(data);
    } catch (err) {
      setError(err.message || 'Failed to load shipments list');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const createShipment = async (fulfillmentId, shipmentData, user) => {
    try {
      const created = await fulfillmentService.createShipment(fulfillmentId, shipmentData, user);
      await fetchShipments();
      return created;
    } catch (err) {
      throw err;
    }
  };

  return {
    shipments,
    loading,
    error,
    params,
    updateFilters: (p) => setParams((prev) => ({ ...prev, ...p })),
    refetch: fetchShipments,
    createShipment,
  };
};
