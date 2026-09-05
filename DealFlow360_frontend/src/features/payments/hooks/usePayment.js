/**
 * Custom hook for single payment detail & cancellation
 * Phase 15 — DealFlow360
 */

import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '../services/paymentService';

export const usePayment = (paymentId) => {
  const [payment, setPayment] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayment = useCallback(async () => {
    if (!paymentId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getPaymentById(paymentId);
      if (!data) {
        setError('Payment record not found.');
      } else {
        setPayment(data);
        const logs = await paymentService.getPaymentAuditLogs(paymentId);
        setAuditLogs(logs);
      }
    } catch (err) {
      setError(err.message || 'Failed to load payment detail');
    } finally {
      setLoading(false);
    }
  }, [paymentId]);

  useEffect(() => {
    fetchPayment();
  }, [fetchPayment]);

  const cancelPayment = async (reason, user) => {
    try {
      const cancelled = await paymentService.cancelPayment(paymentId, reason, user);
      await fetchPayment();
      return cancelled;
    } catch (err) {
      throw err;
    }
  };

  return {
    payment,
    auditLogs,
    loading,
    error,
    refetch: fetchPayment,
    cancelPayment,
  };
};
