/**
 * Custom hook for carrier management
 * Phase 13 — DealFlow360
 */

import { useState, useEffect, useCallback } from 'react';
import { carrierService } from '../services/carrierService';

export const useCarriers = (initialParams = {}) => {
  const [carriers, setCarriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchCarriers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await carrierService.getCarriers(params);
      setCarriers(data);
    } catch (err) {
      setError(err.message || 'Failed to load carriers');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchCarriers();
  }, [fetchCarriers]);

  const createCarrier = async (data) => {
    const res = await carrierService.createCarrier(data);
    await fetchCarriers();
    return res;
  };

  const updateCarrier = async (id, data) => {
    const res = await carrierService.updateCarrier(id, data);
    await fetchCarriers();
    return res;
  };

  const toggleCarrierStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const res = await carrierService.updateCarrierStatus(id, nextStatus);
    await fetchCarriers();
    return res;
  };

  return {
    carriers,
    loading,
    error,
    params,
    updateFilters: (p) => setParams((prev) => ({ ...prev, ...p })),
    refetch: fetchCarriers,
    createCarrier,
    updateCarrier,
    toggleCarrierStatus,
  };
};
