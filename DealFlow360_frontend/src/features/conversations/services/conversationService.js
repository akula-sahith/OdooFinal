import { apiClient } from '../../../services/api/apiClient';
import { notificationService } from '../../notifications/services/notificationService';

/**
 * Fallback preview store for conversations keyed by requestId.
 */
let mockConversations = {
  'REQ-10026': {
    id: 'conv_REQ-10026',
    requestId: 'REQ-10026',
    status: 'ACTIVE',
    messages: [
      {
        id: 'msg_201',
        conversationId: 'conv_REQ-10026',
        senderType: 'SYSTEM',
        senderName: 'DealFlow360 Workflow',
        content: 'Request REQ-10026 created and submitted.',
        createdAt: '2026-09-04T14:30:00.000Z',
        readAt: '2026-09-04T14:30:00.000Z',
      },
      {
        id: 'msg_202',
        conversationId: 'conv_REQ-10026',
        senderType: 'SALESPERSON',
        senderName: 'Sarah Jenkins',
        content: 'Could you please confirm the required drop specification and barcode scanner battery capacity?',
        createdAt: '2026-09-05T09:15:00.000Z',
        readAt: null,
      },
    ],
  },
};

/**
 * Conversation Service Layer
 * Manages Customer ↔ Salesperson messaging contextual to a specific Requirement Request.
 */
export const conversationService = {
  /**
   * Fetch or initialize conversation associated with a specific request.
   */
  async getConversation(requestId) {
    if (!requestId) throw new Error('Request ID is required.');
    try {
      return await apiClient.get(`/customer/requests/${requestId}/conversation`);
    } catch (err) {
      console.warn('[conversationService] Backend API offline. Operating in preview store.');
      if (!mockConversations[requestId]) {
        mockConversations[requestId] = {
          id: `conv_${requestId}`,
          requestId,
          status: 'ACTIVE',
          messages: [
            {
              id: `msg_${Date.now()}`,
              conversationId: `conv_${requestId}`,
              senderType: 'SYSTEM',
              senderName: 'System Automated Audit',
              content: `Request ${requestId} created and submitted into DealFlow360 sales workflow.`,
              createdAt: new Date().toISOString(),
              readAt: new Date().toISOString(),
            },
          ],
        };
      }
      return mockConversations[requestId];
    }
  },

  /**
   * Fetch message history for a conversation.
   */
  async getMessages(conversationId) {
    if (!conversationId) throw new Error('Conversation ID is required.');
    try {
      return await apiClient.get(`/conversations/${conversationId}/messages`);
    } catch (err) {
      console.warn('[conversationService] Backend API offline. Operating in preview store.');
      const conv = Object.values(mockConversations).find((c) => c.id === conversationId);
      return conv ? conv.messages : [];
    }
  },

  /**
   * Send a new message in a conversation with notification creation and rate-limit safety.
   */
  async sendMessage(conversationId, content, senderInfo = {}) {
    if (!conversationId) throw new Error('Conversation ID is required.');
    if (!content || !content.trim()) throw new Error('Message content cannot be empty.');

    const senderType = senderInfo.senderType || 'CUSTOMER';

    try {
      const res = await apiClient.post(`/conversations/${conversationId}/messages`, {
        content: content.trim(),
        senderType,
      });
      return res;
    } catch (err) {
      if (err.status === 429) {
        throw new Error("You're sending messages too quickly. Please try again.");
      }

      console.warn('[conversationService] Backend API offline. Appending to preview store.');
      const conv = Object.values(mockConversations).find((c) => c.id === conversationId);
      if (!conv) {
        throw new Error('Conversation context not found.');
      }

      const newMessage = {
        id: `msg_${Date.now()}`,
        conversationId,
        senderType,
        senderName: senderInfo.senderName || (senderType === 'SALESPERSON' ? 'Sales Representative' : 'Customer Client'),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        readAt: null,
      };

      conv.messages.push(newMessage);

      // Trigger notification for the recipient party
      const targetUserType = senderType === 'CUSTOMER' ? 'SALESPERSON' : 'CUSTOMER';
      const notificationTitle = senderType === 'CUSTOMER' ? 'Customer Replied to Request' : 'Sales Representative Sent Message';

      notificationService.createNotification({
        userType: targetUserType,
        type: senderType === 'CUSTOMER' ? 'CUSTOMER_REPLY' : 'NEW_MESSAGE',
        title: notificationTitle,
        message: `${senderInfo.senderName || 'User'} sent: "${content.trim().substring(0, 60)}${content.length > 60 ? '...' : ''}"`,
        requestId: conv.requestId,
      });

      return newMessage;
    }
  },

  /**
   * Get unread message count for a given request/conversation.
   */
  async getUnreadMessageCount(requestId, currentUserType = 'CUSTOMER') {
    try {
      const res = await apiClient.get(`/requests/${requestId}/messages/unread-count`);
      return res.count || 0;
    } catch (err) {
      const conv = mockConversations[requestId];
      if (!conv || !conv.messages) return 0;
      const otherSenderType = currentUserType === 'CUSTOMER' ? 'SALESPERSON' : 'CUSTOMER';
      return conv.messages.filter((m) => m.senderType === otherSenderType && !m.readAt).length;
    }
  },

  /**
   * Mark all messages in a conversation as read for current user.
   */
  async markConversationAsRead(requestId, currentUserType = 'CUSTOMER') {
    try {
      return await apiClient.post(`/requests/${requestId}/messages/read`);
    } catch (err) {
      const conv = mockConversations[requestId];
      if (conv && conv.messages) {
        const otherSenderType = currentUserType === 'CUSTOMER' ? 'SALESPERSON' : 'CUSTOMER';
        conv.messages.forEach((m) => {
          if (m.senderType === otherSenderType) {
            m.readAt = new Date().toISOString();
          }
        });
      }
      return { success: true };
    }
  },

  /**
   * Mark single message as read.
   */
  async markMessageAsRead(conversationId, messageId) {
    try {
      return await apiClient.post(`/conversations/${conversationId}/messages/${messageId}/read`);
    } catch (err) {
      return { success: true };
    }
  },
};

export default conversationService;
