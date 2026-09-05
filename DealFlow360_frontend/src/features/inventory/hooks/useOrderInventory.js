import { useState, useCallback } from 'react';
import { inventoryService } from '../services/inventoryService';

export const useOrderInventory = (orderData) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reserving, setReserving] = useState(false);
  const [error, setError] = useState(null);

  const checkInventory = useCallback(async () => {
    if (!orderData) return;
    setLoading(true);
    setError(null);
    try {
      const res = await inventoryService.checkOrderInventory(orderData);
      setReport(res);
      return res;
    } catch (err) {
      console.error('[useOrderInventory] Check error:', err);
      setError(err.message || 'Failed to check order inventory availability.');
    } finally {
      setLoading(false);
    }
  }, [orderData]);

  const reserveInventory = async (params = {}) => {
    if (!orderData) return;
    setReserving(true);
    setError(null);
    try {
      const res = await inventoryService.reserveInventory(orderData.id || orderData.orderId, params);
      await checkInventory();
      return res;
    } catch (err) {
      setError(err.message || 'Failed to reserve stock.');
      throw err;
    } finally {
      setReserving(false);
    }
  };

  const releaseReservation = async (reservationId) => {
    setReserving(true);
    setError(null);
    try {
      const res = await inventoryService.releaseReservation(reservationId);
      await checkInventory();
      return res;
    } catch (err) {
      setError(err.message || 'Failed to release reservation.');
      throw err;
    } finally {
      setReserving(false);
    }
  };

  return {
    report,
    loading,
    reserving,
    error,
    checkInventory,
    reserveInventory,
    releaseReservation,
  };
};
