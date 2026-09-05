import { useState, useEffect, useCallback } from 'react';
import { customerPortalService } from '../services/customerPortalService';

export const useCustomerNotifications = (initialParams = {}) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerPortalService.getNotifications(initialParams);
      setNotifications(data);
    } catch (err) {
      console.error('Failed loading notifications:', err);
      setError(err.message || 'Unable to fetch customer notifications.');
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  const markRead = async (id) => {
    try {
      await customerPortalService.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      console.error('Error marking notification read:', e);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return { notifications, unreadCount, loading, error, markRead, refetch: fetchNotifications };
};
