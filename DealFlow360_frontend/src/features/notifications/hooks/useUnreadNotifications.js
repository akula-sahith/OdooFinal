import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';

export const useUnreadNotifications = (userType = 'CUSTOMER') => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount(userType);
      setUnreadCount(count);
    } catch (err) {
      console.error('[useUnreadNotifications] Error fetching count:', err);
    } finally {
      setLoading(false);
    }
  }, [userType]);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  return {
    unreadCount,
    loading,
    refetch: fetchUnreadCount,
  };
};

export default useUnreadNotifications;
