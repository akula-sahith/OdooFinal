/**
 * Custom hook for querying orders eligible for commercial invoicing
 * Phase 14 — DealFlow360
 */

import { useState, useEffect, useCallback } from 'react';
import { invoiceService } from '../services/invoiceService';

export const useBillableOrders = (searchQuery = '') => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data = await invoiceService.getBillableOrders();
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        data = data.filter(
          (o) =>
            o.id.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q)
        );
      }
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch billable orders');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
  };
};
