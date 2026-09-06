import { apiClient } from '../../../services/api/apiClient';

export const customerPortalService = {
  /**
   * Fetch portal view of quotation.
   */
  async getPortalQuotation(quotationId) {
    if (!quotationId) throw new Error('Quotation ID is required.');
    return await apiClient.get(`/portal/quotations/${quotationId}`);
  },

  /**
   * Submit structured negotiation request from customer portal.
   */
  async submitNegotiation(submissionData) {
    if (!submissionData.quotationId || !submissionData.customerId) {
      throw new Error('Quotation ID and Customer ID are required.');
    }
    return await apiClient.post('/portal/negotiate', submissionData);
  },

  /**
   * Confirm quotation from customer portal (converts to order).
   */
  async confirmQuotation(quotationId) {
    if (!quotationId) throw new Error('Quotation ID is required.');
    return await apiClient.post('/portal/confirm-quotation', { quotationId });
  },

  /**
   * Fetch customer orders.
   */
  async getOrders() {
    return await apiClient.get('/orders');
  },

  /**
   * Fetch order detail by ID.
   */
  async getOrderById(id) {
    if (!id) throw new Error('Order ID is required.');
    return await apiClient.get(`/orders/${id}`);
  },

  /**
   * Fetch balance summary.
   */
  async getBalanceSummary() {
    return await apiClient.get('/billing/invoices');
  },
};

export default customerPortalService;

