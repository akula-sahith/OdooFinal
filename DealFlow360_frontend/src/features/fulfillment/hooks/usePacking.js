/**
 * Custom hook for package creation and packing completion
 * Phase 13 — DealFlow360
 */

import { useState } from 'react';
import { fulfillmentService } from '../services/fulfillmentService';

export const usePacking = (fulfillmentId, onUpdate) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const startPacking = async (user = 'Packing Station Ops') => {
    setProcessing(true);
    setError(null);
    try {
      const res = await fulfillmentService.startPacking(fulfillmentId, user);
      if (onUpdate) onUpdate(res);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  const createPackage = async (packageData, user = 'Packing Station Ops') => {
    setProcessing(true);
    setError(null);
    try {
      const pkg = await fulfillmentService.createPackage(fulfillmentId, packageData, user);
      if (onUpdate) onUpdate();
      return pkg;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  const completePacking = async (user = 'Packing Station Ops') => {
    setProcessing(true);
    setError(null);
    try {
      const res = await fulfillmentService.completePacking(fulfillmentId, user);
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
    startPacking,
    createPackage,
    completePacking,
    processing,
    error,
    clearError: () => setError(null),
  };
};
