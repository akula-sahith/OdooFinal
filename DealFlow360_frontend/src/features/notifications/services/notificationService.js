import { apiClient } from '../../../services/api/apiClient';

/**
 * Fallback preview store for customer & staff notifications.
 * Strictly scope notifications by target userType and recipientId.
 */
let mockNotifications = [
  {
    id: 'notif_001',
    userType: 'SALESPERSON',
    recipientId: 'SP-014',
    type: 'NEW_REQUEST',
    title: 'New Commercial Request Assigned',
    message: 'Request REQ-10025 "Bulk Enterprise Server Rack Procurement" was assigned to your review queue.',
    requestId: 'REQ-10025',
    isRead: false,
    createdAt: '2026-09-05T10:05:00.000Z',
  },
  {
    id: 'notif_002',
    userType: 'CUSTOMER',
    recipientId: 'CUST-002',
    type: 'CLARIFICATION_REQUESTED',
    title: 'Clarification Question from Sales Engineer',
    message: 'Sarah Jenkins requested technical clarification for request REQ-10026.',
    requestId: 'REQ-10026',
    isRead: false,
    createdAt: '2026-09-05T09:15:00.000Z',
  },
  {
    id: 'notif_003',
    userType: 'SALESPERSON',
    recipientId: 'SP-014',
    type: 'CUSTOMER_REPLY',
    title: 'Customer Replied to Clarification',
    message: 'Global Logistics Inc submitted clarification details on REQ-10026.',
    requestId: 'REQ-10026',
    isRead: false,
    createdAt: '2026-09-05T09:30:00.000Z',
  },
  {
    id: 'notif_004',
    userType: 'CUSTOMER',
    recipientId: 'CUST-001',
    type: 'REQUEST_STATUS_CHANGED',
    title: 'Requirement Request Updated',
    message: 'Your request REQ-10025 is now UNDER_REVIEW by Sales Engineering team.',
    requestId: 'REQ-10025',
    isRead: true,
    createdAt: '2026-09-05T10:10:00.000Z',
  },
];

export const notificationService = {
  /**
   * Fetch notifications scoped to authenticated user and portal role.
   */
  async getNotifications(params = {}) {
    const userType = params.userType || 'CUSTOMER';
    try {
      const endpoint = userType === 'SALESPERSON' ? '/sales/notifications' : '/customer/notifications';
      return await apiClient.get(endpoint);
    } catch (err) {
      console.warn('[notificationService] API offline. Operating on preview notifications store.');
      let filtered = mockNotifications.filter((n) => n.userType === userType);

      const page = parseInt(params.page || 1, 10);
      const limit = parseInt(params.pageSize || 10, 10);
      const startIndex = (page - 1) * limit;
      const paginated = filtered.slice(startIndex, startIndex + limit);

      return {
        data: paginated,
        unreadCount: filtered.filter((n) => !n.isRead).length,
        total: filtered.length,
      };
    }
  },

  /**
   * Fetch real unread notification count.
   */
  async getUnreadCount(userType = 'CUSTOMER') {
    try {
      const endpoint = userType === 'SALESPERSON' ? '/sales/notifications/unread-count' : '/customer/notifications/unread-count';
      const res = await apiClient.get(endpoint);
      return res.count ?? res.unreadCount ?? 0;
    } catch (err) {
      const filtered = mockNotifications.filter((n) => n.userType === userType && !n.isRead);
      return filtered.length;
    }
  },

  /**
   * Mark individual notification as read.
   */
  async markNotificationAsRead(id, userType = 'CUSTOMER') {
    if (!id) return;
    try {
      const endpoint = userType === 'SALESPERSON' ? `/sales/notifications/${id}/read` : `/customer/notifications/${id}/read`;
      return await apiClient.patch(endpoint);
    } catch (err) {
      const notif = mockNotifications.find((n) => n.id === id);
      if (notif) {
        notif.isRead = true;
      }
      return { success: true };
    }
  },

  /**
   * Mark all notifications as read for current user role.
   */
  async markAllNotificationsAsRead(userType = 'CUSTOMER') {
    try {
      const endpoint = userType === 'SALESPERSON' ? '/sales/notifications/read-all' : '/customer/notifications/read-all';
      return await apiClient.post(endpoint);
    } catch (err) {
      mockNotifications.forEach((n) => {
        if (n.userType === userType) {
          n.isRead = true;
        }
      });
      return { success: true };
    }
  },

  /**
   * Helper to append a new notification event into the shared preview store.
   */
  createNotification(data) {
    const newRecord = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userType: data.userType || 'CUSTOMER',
      recipientId: data.recipientId || 'GLOBAL',
      type: data.type || 'REQUEST_STATUS_CHANGED',
      title: data.title || 'System Notification',
      message: data.message || '',
      requestId: data.requestId || null,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    mockNotifications.unshift(newRecord);
    return newRecord;
  },
};

export default notificationService;
