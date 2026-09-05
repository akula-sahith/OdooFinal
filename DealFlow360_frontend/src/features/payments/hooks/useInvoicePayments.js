/**
 * Custom hook for retrieving payment history and balance for an invoice
 * Phase 15 — DealFlow360
 */

import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '../services/paymentService';

export const useInvoicePayments = (invoiceId) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    if (!invoiceId) return;
    setLoading(true);
    try {
      const data = await paymentService.getPaymentsByInvoice(invoiceId);
      setPayments(data);
    } catch (e) {
      console.error('Failed fetching invoice payments', e);
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const completedTotal = payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((acc, p) => acc + Number(p.amount || 0), 0);

  return {
    payments,
    completedTotal,
    loading,
    refetch: fetchPayments,
  };
};
