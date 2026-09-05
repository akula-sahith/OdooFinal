/**
 * Custom hook for item picking workflow execution
 * Phase 13 — DealFlow360
 */

import { useState } from 'react';
import { fulfillmentService } from '../services/fulfillmentService';

export const usePicking = (fulfillmentId, onUpdate) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const startPicking = async (user = 'Warehouse Picker') => {
    setProcessing(true);
    setError(null);
    try {
      const res = await fulfillmentService.startPicking(fulfillmentId, user);
      if (onUpdate) onUpdate(res);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  const pickItem = async (itemId, quantity, user = 'Warehouse Picker') => {
    setProcessing(true);
    setError(null);
    try {
      const res = await fulfillmentService.pickItem(fulfillmentId, itemId, quantity, user);
      if (onUpdate) onUpdate(res);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  const completePicking = async (user = 'Warehouse Picker') => {
    setProcessing(true);
    setError(null);
    try {
      const res = await fulfillmentService.completePicking(fulfillmentId, user);
      if (onUpdate) onUpdate(res);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  return {
    startPicking,
    pickItem,
    completePicking,
    processing,
    error,
    clearError: () => setError(null),
  };
};
