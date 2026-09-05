import { useState, useEffect, useCallback } from 'react';
import { customerPortalService } from '../services/customerPortalService';

export const useCustomerOrder = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await customerPortalService.getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      console.error(`Failed loading order ${orderId}:`, err);
      setError(err.message || 'Order not found or unauthorized.');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return { order, loading, error, refetch: fetchOrder };
};
