/**
 * Custom hook for fetching and managing fulfillment orders list
 * Phase 13 — DealFlow360
 */

import { useState, useEffect, useCallback } from 'react';
import { fulfillmentService } from '../services/fulfillmentService';

export const useFulfillments = (initialParams = {}) => {
  const [fulfillments, setFulfillments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchFulfillments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fulfillmentService.getFulfillments(params);
      setFulfillments(data);
    } catch (err) {
      setError(err.message || 'Failed to load fulfillment orders');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchFulfillments();
  }, [fetchFulfillments]);

  const updateFilters = (newParams) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  const createFulfillment = async (orderData) => {
    try {
      const created = await fulfillmentService.createFulfillment(orderData);
      await fetchFulfillments();
      return created;
    } catch (err) {
      throw err;
    }
  };

  return {
    fulfillments,
    loading,
    error,
    params,
    updateFilters,
    refetch: fetchFulfillments,
    createFulfillment,
  };
};
