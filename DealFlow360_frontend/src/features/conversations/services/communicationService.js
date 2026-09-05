/**
 * Centralized Communication Service Layer
 * Phase 17 — DealFlow360
 *
 * Manages Customer ↔ Salesperson messaging contextual to business records:
 * - QUOTATION
 * - ORDER
 * - INVOICE
 * - SHIPMENT
 * - REQUEST
 *
 * Consumes apiClient with deterministic fallback to shared preview store.
 */

import { apiClient } from '../../../services/api/apiClient';
import { notificationService } from '../../notifications/services/notificationService';

// Deterministic seed conversations for offline preview mode
let mockConversations = [
  {
    id: 'conv_QT-2026-1004',
    organizationId: 'ORG-360-ALPHA',
    contextType: 'QUOTATION',
    contextId: 'QT-2026-1004',
    contextTitle: 'Quotation #QT-2026-1004 (Server Blades)',
    customerId: 'CUST-001',
    customerName: 'Apex Global Logistics',
    salespersonId: 'SP-014',
    salespersonName: 'Sarah Jenkins (Sales Engineer)',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    unreadCountCustomer: 0,
    unreadCountSalesperson: 1,
    lastMessage: 'Please proceed with the commercial discount revision.',
    messages: [
      {
        id: 'msg_q1',
        conversationId: 'conv_QT-2026-1004',
        organizationId: 'ORG-360-ALPHA',
        senderId: 'SP-014',
        senderType: 'SALESPERSON',
        senderName: 'Sarah Jenkins',
        messageType: 'TEXT',
        body: 'Please review the updated commercial proposal for 50 Enterprise Blades.',
        status: 'READ',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        readAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: 'msg_q2',
        conversationId: 'conv_QT-2026-1004',
        organizationId: 'ORG-360-ALPHA',
        senderId: 'CUST-001',
        senderType: 'CUSTOMER',
        senderName: 'Apex Procurement',
        messageType: 'TEXT',
        body: 'Please proceed with the commercial discount revision.',
        status: 'DELIVERED',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        readAt: null,
      },
    ],
  },
  {
    id: 'conv_ORD-2026-8912',
    organizationId: 'ORG-360-ALPHA',
    contextType: 'ORDER',
    contextId: 'ORD-2026-8912',
    contextTitle: 'Sales Order #ORD-2026-8912',
    customerId: 'CUST-001',
    customerName: 'Apex Global Logistics',
    salespersonId: 'SP-014',
    salespersonName: 'Sarah Jenkins (Sales Engineer)',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    unreadCountCustomer: 1,
    unreadCountSalesperson: 0,
    lastMessage: 'Your order has been packed and containerized at Warehouse Main 01.',
    messages: [
      {
        id: 'msg_o1',
        conversationId: 'conv_ORD-2026-8912',
        organizationId: 'ORG-360-ALPHA',
        senderId: 'CUST-001',
        senderType: 'CUSTOMER',
        senderName: 'Apex Procurement',
        messageType: 'TEXT',
        body: 'When is this order expected to leave the logistics terminal?',
        status: 'READ',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        readAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'msg_o2',
        conversationId: 'conv_ORD-2026-8912',
        organizationId: 'ORG-360-ALPHA',
        senderId: 'SP-014',
        senderType: 'SALESPERSON',
        senderName: 'Sarah Jenkins',
        messageType: 'TEXT',
        body: 'Your order has been packed and containerized at Warehouse Main 01.',
        status: 'DELIVERED',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        readAt: null,
      },
    ],
  },
  {
    id: 'conv_INV-2026-000001',
    organizationId: 'ORG-360-ALPHA',
    contextType: 'INVOICE',
    contextId: 'INV-2026-000001',
    contextTitle: 'Commercial Invoice #INV-2026-000001',
    customerId: 'CUST-001',
    customerName: 'Apex Global Logistics',
    salespersonId: 'SP-014',
    salespersonName: 'Sarah Jenkins (Sales Engineer)',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    unreadCountCustomer: 0,
    unreadCountSalesperson: 0,
    lastMessage: 'Partial wire payment of $50,000 received and posted.',
    messages: [
      {
        id: 'msg_i1',
        conversationId: 'conv_INV-2026-000001',
        organizationId: 'ORG-360-ALPHA',
        senderId: 'SYSTEM',
        senderType: 'SYSTEM',
        senderName: 'DealFlow360 Finance System',
        messageType: 'SYSTEM_EVENT',
        body: 'Invoice INV-2026-000001 issued with total $145,800.00',
        status: 'READ',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        readAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: 'msg_i2',
        conversationId: 'conv_INV-2026-000001',
        organizationId: 'ORG-360-ALPHA',
        senderId: 'SP-014',
        senderType: 'SALESPERSON',
        senderName: 'Sarah Jenkins',
        messageType: 'TEXT',
        body: 'Partial wire payment of $50,000 received and posted.',
        status: 'READ',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        readAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
  },
];

export const communicationService = {
  /**
   * Fetch conversations list for authenticated user with context filtering & ownership scoping
   */
  async getConversations(params = {}) {
    const { contextType = '', search = '', userType = 'CUSTOMER' } = params;
    try {
      const endpoint = userType === 'SALESPERSON' ? '/sales/conversations' : '/customer/conversations';
      const res = await apiClient.get(endpoint, { params });
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn('[communicationService] Backend offline. Using stored conversations.');
    }

    let list = [...mockConversations];

    if (contextType && contextType !== 'ALL') {
      list = list.filter((c) => c.contextType === contextType);
    }

    if (search) {
      const query = search.toLowerCase();
      list = list.filter(
        (c) =>
          (c.contextId || '').toLowerCase().includes(query) ||
          (c.contextTitle || '').toLowerCase().includes(query) ||
          (c.customerName || '').toLowerCase().includes(query) ||
          (c.lastMessage || '').toLowerCase().includes(query)
      );
    }

    return list;
  },

  /**
   * Fetch single conversation by ID
   */
  async getConversationById(id) {
    try {
      const res = await apiClient.get(`/conversations/${id}`);
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn(`[communicationService] Backend offline. Resolving conversation ${id}.`);
    }

    const found = mockConversations.find((c) => c.id === id || c.contextId === id);
    if (!found) {
      const err = new Error('Conversation not found or access denied.');
      err.status = 404;
      throw err;
    }
    return found;
  },

  /**
   * Get or create a unique conversation linked to a business record context
   */
  async getOrCreateConversation(contextType, contextId, details = {}) {
    if (!contextType || !contextId) {
      throw new Error('contextType and contextId are required.');
    }

    try {
      const res = await apiClient.post('/conversations/get-or-create', {
        contextType,
        contextId,
        ...details,
      });
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn(`[communicationService] Backend offline. Managing conversation for ${contextType}:${contextId}.`);
    }

    let existing = mockConversations.find(
      (c) => c.contextType === contextType && c.contextId === contextId
    );

    if (!existing) {
      existing = {
        id: `conv_${contextId}`,
        organizationId: 'ORG-360-ALPHA',
        contextType,
        contextId,
        contextTitle: `${contextType} #${contextId}`,
        customerId: details.customerId || 'CUST-001',
        customerName: details.customerName || 'Apex Global Logistics',
        salespersonId: details.salespersonId || 'SP-014',
        salespersonName: details.salespersonName || 'Sarah Jenkins (Sales Engineer)',
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        unreadCountCustomer: 0,
        unreadCountSalesperson: 0,
        lastMessage: 'Conversation initiated.',
        messages: [
          {
            id: `msg_init_${Date.now()}`,
            conversationId: `conv_${contextId}`,
            organizationId: 'ORG-360-ALPHA',
            senderId: 'SYSTEM',
            senderType: 'SYSTEM',
            senderName: 'DealFlow360 System',
            messageType: 'SYSTEM_EVENT',
            body: `Conversation initiated for ${contextType} #${contextId}.`,
            status: 'READ',
            createdAt: new Date().toISOString(),
            readAt: new Date().toISOString(),
          },
        ],
      };
      mockConversations.unshift(existing);
    }

    return existing;
  },

  /**
   * Fetch messages for a conversation
   */
  async getMessages(conversationId) {
    if (!conversationId) return [];
    try {
      const res = await apiClient.get(`/conversations/${conversationId}/messages`);
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn(`[communicationService] Backend offline. Resolving messages for ${conversationId}.`);
    }

    const conv = mockConversations.find((c) => c.id === conversationId || c.contextId === conversationId);
    return conv ? conv.messages : [];
  },

  /**
   * Send a new message in a conversation with validation & rate limiting
   */
  async sendMessage(conversationId, data) {
    if (!conversationId) throw new Error('Conversation ID is required.');
    const { body = '', senderType = 'CUSTOMER', senderName = '' } = data;

    if (!body || !body.trim()) {
      const err = new Error('Message body cannot be empty.');
      err.status = 422;
      throw err;
    }

    if (body.trim().length > 2000) {
      const err = new Error('Message body exceeds maximum length limit of 2,000 characters.');
      err.status = 422;
      throw err;
    }

    try {
      const res = await apiClient.post(`/conversations/${conversationId}/messages`, {
        body: body.trim(),
        senderType,
      });
      if (res && res.data) return res.data;
    } catch (err) {
      if (err.status === 429) {
        throw new Error('Too many messages sent. Please wait before retrying.');
      }
      console.warn('[communicationService] Backend offline. Appending message to local conversation store.');
    }

    const conv = mockConversations.find((c) => c.id === conversationId || c.contextId === conversationId);
    if (!conv) {
      const err = new Error('Conversation context not found.');
      err.status = 404;
      throw err;
    }

    const newMsg = {
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      conversationId: conv.id,
      organizationId: conv.organizationId || 'ORG-360-ALPHA',
      senderId: senderType === 'CUSTOMER' ? conv.customerId : conv.salespersonId,
      senderType,
      senderName: senderName || (senderType === 'CUSTOMER' ? conv.customerName : conv.salespersonName),
      messageType: 'TEXT',
      body: body.trim(),
      status: 'DELIVERED',
      createdAt: new Date().toISOString(),
      readAt: null,
    };

    conv.messages.push(newMsg);
    conv.lastMessage = body.trim();
    conv.updatedAt = new Date().toISOString();

    if (senderType === 'CUSTOMER') {
      conv.unreadCountSalesperson = (conv.unreadCountSalesperson || 0) + 1;
    } else {
      conv.unreadCountCustomer = (conv.unreadCountCustomer || 0) + 1;
    }

    // Publish domain event for notification generation
    const targetUserType = senderType === 'CUSTOMER' ? 'SALESPERSON' : 'CUSTOMER';
    notificationService.publishDomainEvent({
      eventType: 'MESSAGE_RECEIVED',
      entityType: conv.contextType,
      entityId: conv.contextId,
      actorId: newMsg.senderId,
      targetUserType,
      title: `New message on ${conv.contextType} #${conv.contextId}`,
      message: `${newMsg.senderName}: "${body.trim().substring(0, 70)}${body.length > 70 ? '...' : ''}"`,
    });

    return newMsg;
  },

  /**
   * Mark all unread messages in a conversation as read for specified user role
   */
  async markMessagesRead(conversationId, userType = 'CUSTOMER') {
    try {
      await apiClient.post(`/conversations/${conversationId}/read`);
    } catch (e) {
      // offline fallback
    }

    const conv = mockConversations.find((c) => c.id === conversationId || c.contextId === conversationId);
    if (conv) {
      if (userType === 'CUSTOMER') {
        conv.unreadCountCustomer = 0;
      } else {
        conv.unreadCountSalesperson = 0;
      }
      conv.messages.forEach((m) => {
        const otherSender = userType === 'CUSTOMER' ? 'SALESPERSON' : 'CUSTOMER';
        if (m.senderType === otherSender && !m.readAt) {
          m.readAt = new Date().toISOString();
          m.status = 'READ';
        }
      });
    }

    return true;
  },

  /**
   * Close conversation thread
   */
  async closeConversation(id) {
    try {
      await apiClient.patch(`/conversations/${id}/close`);
    } catch (e) {
      // offline
    }
    const conv = mockConversations.find((c) => c.id === id);
    if (conv) conv.status = 'CLOSED';
    return true;
  },
};

export default communicationService;
