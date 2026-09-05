/**
 * Custom hook for querying and filtering payment records
 * Phase 15 — DealFlow360
 */

import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '../services/paymentService';

export const usePayments = (initialParams = {}) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getPayments(params);
      setPayments(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch payment records');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const updateFilters = (newParams) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  const createPayment = async (paymentData, user) => {
    try {
      const created = await paymentService.createPayment(paymentData, user);
      await fetchPayments();
      return created;
    } catch (err) {
      throw err;
    }
  };

  return {
    payments,
    loading,
    error,
    params,
    updateFilters,
    refetch: fetchPayments,
    createPayment,
  };
};
