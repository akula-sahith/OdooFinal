import { apiClient } from '../../../services/api/apiClient';
import { validateNegotiationMessage } from '../validation/customerQuotationValidation';

/**
 * Preview store for quotation negotiation threads.
 */
let mockNegotiationThreads = {
  'QTN-2026-00001': [
    {
      id: 'nmsg_101',
      quotationId: 'QTN-2026-00001',
      quotationVersion: 1,
      senderType: 'CUSTOMER',
      senderName: 'Acme Procurement Team',
      senderRole: 'Customer',
      message: 'Hello Sarah, could you review if an additional 5% volume discount is possible if we finalize standard payment terms within 14 days?',
      createdAt: '2026-09-05T12:35:00.000Z',
    },
    {
      id: 'nmsg_102',
      quotationId: 'QTN-2026-00001',
      quotationVersion: 1,
      senderType: 'SALESPERSON',
      senderName: 'Sarah Jenkins',
      senderRole: 'Sales Executive',
      message: 'Thank you for reaching out! I am evaluating the revised terms with our commercial strategy group and will propose a revised proposal shortly.',
      createdAt: '2026-09-05T13:10:00.000Z',
    },
  ],
};

export const quotationCommunicationService = {
  /**
   * Fetch negotiation message history for a quotation.
   * Internal manager/finance comments are strictly excluded.
   */
  async getNegotiationThread(quotationId) {
    if (!quotationId) throw new Error('Quotation ID is required.');

    try {
      return await apiClient.get(`/customer/quotations/${quotationId}/negotiation-thread`);
    } catch (err) {
      console.warn('[quotationCommunicationService] Backend API offline. Returning preview thread.');
      return mockNegotiationThreads[quotationId] || mockNegotiationThreads['QTN-2026-00001'] || [];
    }
  },

  /**
   * Send a new message in the quotation negotiation thread.
   * Append-only history; backend resolves sender identity from auth context.
   */
  async sendNegotiationMessage(quotationId, message, senderContext = {}) {
    if (!quotationId) throw new Error('Quotation ID is required.');

    const validation = validateNegotiationMessage(message);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const senderType = senderContext.senderType || 'CUSTOMER';

    try {
      const res = await apiClient.post(`/customer/quotations/${quotationId}/negotiation-thread`, {
        message: message.trim(),
        senderType,
      });
      return res;
    } catch (err) {
      console.warn('[quotationCommunicationService] Backend API offline. Appending to preview thread.');
      if (!mockNegotiationThreads[quotationId]) {
        mockNegotiationThreads[quotationId] = [];
      }

      const newMsg = {
        id: `nmsg_${Date.now()}`,
        quotationId,
        quotationVersion: senderContext.quotationVersion || 1,
        senderType,
        senderName: senderContext.senderName || (senderType === 'CUSTOMER' ? 'Customer Account' : 'Sarah Jenkins'),
        senderRole: senderType === 'CUSTOMER' ? 'Customer' : 'Sales Executive',
        message: message.trim(),
        createdAt: new Date().toISOString(),
      };

      mockNegotiationThreads[quotationId].push(newMsg);
      return newMsg;
    }
  },
};
