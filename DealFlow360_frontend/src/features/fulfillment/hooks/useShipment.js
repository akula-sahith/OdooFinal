/**
 * Custom hook for single shipment lifecycle operations and customer tracking
 * Phase 13 — DealFlow360
 */

import { useState, useEffect, useCallback } from 'react';
import { fulfillmentService } from '../services/fulfillmentService';

export const useShipment = (shipmentId) => {
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShipment = useCallback(async () => {
    if (!shipmentId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fulfillmentService.getShipmentById(shipmentId);
      if (!data) {
        setError('Shipment record not found');
      } else {
        setShipment(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load shipment detail');
    } finally {
      setLoading(false);
    }
  }, [shipmentId]);

  useEffect(() => {
    fetchShipment();
  }, [fetchShipment]);

  const shipShipment = async (user = 'Dispatch Lead') => {
    try {
      const res = await fulfillmentService.shipShipment(shipmentId, user);
      await fetchShipment();
      return res;
    } catch (err) {
      throw err;
    }
  };

  const updateStatus = async (targetStatus, notes, user) => {
    try {
      const res = await fulfillmentService.updateShipmentStatus(shipmentId, targetStatus, notes, user);
      await fetchShipment();
      return res;
    } catch (err) {
      throw err;
    }
  };

  return {
    shipment,
    loading,
    error,
    refetch: fetchShipment,
    shipShipment,
    updateStatus,
  };
};
