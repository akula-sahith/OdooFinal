import { apiClient } from '../../../services/api/apiClient';
const toQuotationView = (quotation, lines = []) => ({
  ...quotation,
  quotationId: quotation.id?.toString(),
  quotationNumber: `QTN-${quotation.id}`,
  title: `Quotation ${quotation.id}`,
  subtotal: quotation.subtotalAmount,
  taxTotal: quotation.taxAmount,
  grandTotal: quotation.totalAmount,
  items: lines,
});

/**
 * Quotation API Service
 * Centralized service layer for Sales Quotations, Line Items, Approval Submissions, and Portal Publishing.
 */
export const quotationService = {
  /**
   * Fetch list of sales quotations with optional status filtering.
   */
  async getQuotations(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('limit', params.pageSize);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = `/quotations${queryString ? `?${queryString}` : ''}`;
    const result = await apiClient.get(endpoint);
    return Array.isArray(result) ? result.map((quotation) => toQuotationView(quotation)) : result;
  },

  /**
   * Fetch single quotation by ID.
   */
  async getQuotationById(id) {
    if (!id) throw new Error('Quotation ID is required.');
    const result = await apiClient.get(`/quotations/${id}`);
    return toQuotationView(result.quotation ?? result, result.lines ?? []);
  },

  /**
   * Create a new draft sales quotation.
   */
  async createQuotation(quotationData) {
    return await apiClient.post('/quotations', {
      customerId: quotationData.customerId || quotationData.customer_id,
      priceListId: quotationData.priceListId || quotationData.price_list_id,
      currency: quotationData.currency || 'USD',
    });
  },

  /**
   * Add a line item to a quotation.
   */
  async addQuotationLine(quotationId, lineData) {
    if (!quotationId) throw new Error('Quotation ID is required.');
    return await apiClient.post(`/quotations/${quotationId}/lines`, {
      productId: lineData.productId || lineData.product_id,
      productVariantId: lineData.productVariantId || lineData.variant_id,
      quantity: lineData.quantity || 1,
    });
  },

  /**
   * Delete a line item from a quotation.
   */
  async removeQuotationLine(quotationId, lineId) {
    if (!quotationId || !lineId) throw new Error('Quotation ID and Line ID are required.');
    return await apiClient.delete(`/quotations/${quotationId}/lines/${lineId}`);
  },

  /**
   * Submit quotation for discount risk evaluation and multi-level approval routing.
   */
  async submitForApproval(quotationId) {
    if (!quotationId) throw new Error('Quotation ID is required.');
    return await apiClient.post(`/quotations/${quotationId}/submit-approval`);
  },

  /**
   * Evaluate discount risk for a quotation.
   */
  async evaluateRisk(quotationId) {
    if (!quotationId) throw new Error('Quotation ID is required.');
    return await apiClient.post(`/quotations/${quotationId}/evaluate-risk`);
  },

  /**
   * Publish an APPROVED quotation to the Customer Portal.
   */
  async sendToCustomer(quotationId) {
    if (!quotationId) throw new Error('Quotation ID is required.');
    return await apiClient.post(`/quotations/${quotationId}/send-to-customer`);
  },

  /**
   * Fetch upsell/cross-sell recommendation suggestions for a quotation.
   */
  async getRecommendations(quotationId) {
    if (!quotationId) throw new Error('Quotation ID is required.');
    return await apiClient.get(`/quotations/${quotationId}/recommendations`);
  },

  /**
   * Fetch customer requests that are eligible for quotation creation
   * (i.e. requests in REQUIREMENT_CONFIRMED status).
   */
  async getQuotationEligibleRequests() {
    try {
      const res = await apiClient.get('/customer/requests?status=REQUIREMENT_CONFIRMED');
      return res?.data || res || [];
    } catch (err) {
      console.warn('[quotationService] Backend offline. Checking shared requests store for eligible requests.');
      const store = getSharedRequestsStore();
      return store.filter((r) => r.status === 'REQUIREMENT_CONFIRMED');
    }
  },

  /**
   * Fetch all active price lists eligible for use in quotation creation.
   */
  async getQuotationEligiblePriceLists() {
    try {
      const res = await apiClient.get('/price-lists?status=ACTIVE');
      return res?.data || res || [];
    } catch (err) {
      console.warn('[quotationService] Backend offline. Returning empty price lists.');
      return [];
    }
  },
};

export default quotationService;

