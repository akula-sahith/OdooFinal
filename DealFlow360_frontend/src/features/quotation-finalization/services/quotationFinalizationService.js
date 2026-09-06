import { apiClient } from '../../../services/api/apiClient';
import { ORDER_READINESS_STATUS } from '../types/quotationFinalizationTypes';

export const quotationFinalizationService = {
  /**
   * Fetch finalization overview for a quotation.
   */
  async getFinalizationDetails(quotationId) {
    if (!quotationId) throw new Error('Quotation ID is required.');
    return await apiClient.get(`/quotations/${quotationId}`);
  },

  /**
   * Fetch all historical versions of a quotation.
   */
  async getQuotationVersions(quotationId) {
    if (!quotationId) throw new Error('Quotation ID is required.');
    return await apiClient.get(`/quotations/${quotationId}`);
  },

  /**
   * Finalize an accepted quotation.
   */
  async finalizeAcceptedQuotation(quotationId) {
    if (!quotationId) throw new Error('Quotation ID is required.');
    return await apiClient.post(`/quotations/${quotationId}/send-to-customer`);
  },

  /**
   * Check order readiness status for a quotation.
   */
  async getOrderReadiness(quotationId) {
    if (!quotationId) throw new Error('Quotation ID is required.');
    const quotation = await apiClient.get(`/quotations/${quotationId}`);
    const isReady = quotation?.status === 'CONFIRMED' || quotation?.status === 'APPROVED';
    return {
      status: isReady ? ORDER_READINESS_STATUS.READY_FOR_ORDER : ORDER_READINESS_STATUS.NOT_READY,
      isReady,
      handoffPayload: quotation,
    };
  },
};

export default quotationFinalizationService;

