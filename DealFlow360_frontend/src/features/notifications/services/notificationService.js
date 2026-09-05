import { apiClient } from '../../../services/api/apiClient';
import { emailNotificationService } from './emailNotificationService';

/**
 * Fallback preview store for notifications.
 * Scoped by target userType ('CUSTOMER' | 'SALESPERSON' | 'FINANCE' | 'OPS' | 'ADMIN')
 */
let mockNotifications = [
  {
    id: 'notif_101',
    userType: 'CUSTOMER',
    recipientId: 'CUST-001',
    type: 'ORDER_SHIPPED',
    title: 'Consignment Dispatched',
    message: 'Shipment SHP-2026-001 for Order ORD-2026-8912 is in transit via FedEx.',
    entityType: 'SHIPMENT',
    entityId: 'SHP-2026-001',
    priority: 'HIGH',
    isRead: false,
    readAt: null,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'notif_102',
    userType: 'CUSTOMER',
    recipientId: 'CUST-001',
    type: 'INVOICE_ISSUED',
    title: 'Invoice Issued',
    message: 'Commercial Invoice INV-2026-000001 generated for $145,800.00.',
    entityType: 'INVOICE',
    entityId: 'INV-2026-000001',
    priority: 'NORMAL',
    isRead: false,
    readAt: null,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'notif_103',
    userType: 'SALESPERSON',
    recipientId: 'SP-014',
    type: 'QUOTATION_ACCEPTED',
    title: 'Quotation Accepted',
    message: 'Client accepted Quotation QT-2026-1004. Order ORD-2026-8912 generated.',
    entityType: 'QUOTATION',
    entityId: 'QT-2026-1004',
    priority: 'HIGH',
    isRead: false,
    readAt: null,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'notif_104',
    userType: 'SALESPERSON',
    recipientId: 'SP-014',
    type: 'PAYMENT_RECEIVED',
    title: 'Payment Received',
    message: 'Wire payment of $50,000 received for Invoice INV-2026-000001.',
    entityType: 'PAYMENT',
    entityId: 'PAY-2026-000001',
    priority: 'NORMAL',
    isRead: true,
    readAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export const notificationService = {
  /**
   * Fetch notifications list with pagination, userType & ownership filter
   */
  async getNotifications(params = {}) {
    const userType = params.userType || 'CUSTOMER';
    try {
      const endpoint = userType === 'SALESPERSON' ? '/sales/notifications' : '/customer/notifications';
      const res = await apiClient.get(endpoint, { params });
      if (res && res.data) return res.data;
    } catch (err) {
      console.warn('[notificationService] API offline. Using preview notifications store.');
    }

    let filtered = mockNotifications.filter(
      (n) => n.userType === userType || (userType === 'SALESPERSON' && n.userType !== 'CUSTOMER')
    );

    if (params.status === 'UNREAD') {
      filtered = filtered.filter((n) => !n.isRead);
    }

    const page = parseInt(params.page || 1, 10);
    const limit = parseInt(params.pageSize || 10, 10);
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      unreadCount: filtered.filter((n) => !n.isRead).length,
      total: filtered.length,
    };
  },

  /**
   * Fetch unread notification count
   */
  async getUnreadCount(userType = 'CUSTOMER') {
    try {
      const endpoint = userType === 'SALESPERSON' ? '/sales/notifications/unread-count' : '/customer/notifications/unread-count';
      const res = await apiClient.get(endpoint);
      return res.count ?? res.unreadCount ?? 0;
    } catch (err) {
      const filtered = mockNotifications.filter(
        (n) => (n.userType === userType || (userType === 'SALESPERSON' && n.userType !== 'CUSTOMER')) && !n.isRead
      );
      return filtered.length;
    }
  },

  /**
   * Mark individual notification as read
   */
  async markNotificationAsRead(id, userType = 'CUSTOMER') {
    if (!id) return;
    try {
      const endpoint = userType === 'SALESPERSON' ? `/sales/notifications/${id}/read` : `/customer/notifications/${id}/read`;
      await apiClient.patch(endpoint);
    } catch (err) {
      // offline fallback
    }

    const notif = mockNotifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      notif.readAt = new Date().toISOString();
    }
    return { success: true };
  },

  /**
   * Mark all notifications as read for specified user role
   */
  async markAllNotificationsAsRead(userType = 'CUSTOMER') {
    try {
      const endpoint = userType === 'SALESPERSON' ? '/sales/notifications/read-all' : '/customer/notifications/read-all';
      await apiClient.post(endpoint);
    } catch (err) {
      // offline fallback
    }

    mockNotifications.forEach((n) => {
      if (n.userType === userType || (userType === 'SALESPERSON' && n.userType !== 'CUSTOMER')) {
        n.isRead = true;
        n.readAt = new Date().toISOString();
      }
    });
    return { success: true };
  },

  /**
   * Publish a business domain event to generate in-app and email notifications
   */
  publishDomainEvent(eventData) {
    const {
      eventType,
      entityType,
      entityId,
      actorId,
      targetUserType = 'CUSTOMER',
      title,
      message,
      priority = 'NORMAL',
    } = eventData;

    const newRecord = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      organizationId: 'ORG-360-ALPHA',
      userType: targetUserType,
      type: eventType,
      title: title || `Event ${eventType}`,
      message: message || '',
      entityType: entityType || 'GENERAL',
      entityId: entityId || null,
      priority,
      isRead: false,
      readAt: null,
      createdAt: new Date().toISOString(),
    };

    mockNotifications.unshift(newRecord);

    // Trigger email notification service provider abstraction
    emailNotificationService.sendEmail({
      to: targetUserType === 'CUSTOMER' ? 'client@apexlogistics.com' : 'sales@dealflow360.com',
      subject: `[DealFlow360] ${newRecord.title}`,
      template: eventType,
      data: {
        entityType,
        entityId,
        message: newRecord.message,
      },
    });

    return newRecord;
  },

  /**
   * Helper to create manual in-app notification
   */
  createNotification(data) {
    return this.publishDomainEvent(data);
  },
};

export default notificationService;
