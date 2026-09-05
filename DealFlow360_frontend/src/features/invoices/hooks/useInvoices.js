/**
 * Custom hook for fetching and filtering invoices
 * Phase 14 — DealFlow360
 */

import { useState, useEffect, useCallback } from 'react';
import { invoiceService } from '../services/invoiceService';

export const useInvoices = (initialParams = {}) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await invoiceService.getInvoices(params);
      setInvoices(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch invoices list');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const updateFilters = (newParams) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  const createInvoiceFromOrder = async (orderData, customOptions) => {
    try {
      const created = await invoiceService.createInvoiceFromOrder(orderData, customOptions);
      await fetchInvoices();
      return created;
    } catch (err) {
      throw err;
    }
  };

  return {
    invoices,
    loading,
    error,
    params,
    updateFilters,
    refetch: fetchInvoices,
    createInvoiceFromOrder,
  };
};
