import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';

export const useNotifications = (userType = 'CUSTOMER') => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationService.getNotifications({ userType });
      if (Array.isArray(res)) {
        setNotifications(res);
        setUnreadCount(res.filter((n) => !n.isRead).length);
      } else {
        setNotifications(res.data || []);
        setUnreadCount(res.unreadCount ?? (res.data || []).filter((n) => !n.isRead).length);
      }
    } catch (err) {
      console.error('[useNotifications] Error loading notifications:', err);
      setError(err.message || 'Failed to fetch notifications.');
    } finally {
      setLoading(false);
    }
  }, [userType]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markNotificationAsRead(notificationId, userType);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('[useNotifications] Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllNotificationsAsRead(userType);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('[useNotifications] Failed to mark all as read:', err);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};

export default useNotifications;
