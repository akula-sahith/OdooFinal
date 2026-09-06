import { apiFetch } from './client';

export const quotationApi = {
  getAllQuotations: async () => {
    return await apiFetch('/api/quotations');
  },

  getQuotationById: async (id) => {
    return await apiFetch(`/api/quotations/${id}`);
  },

  createQuotation: async (customerId, priceListId = 1, currency = 'USD') => {
    return await apiFetch('/api/quotations', {
      method: 'POST',
      body: JSON.stringify({ customerId: Number(customerId), priceListId: Number(priceListId), currency }),
    });
  },

  addLine: async (quotationId, productId, productVariantId = null, quantity = 1, unitPrice = null) => {
    return await apiFetch(`/api/quotations/${quotationId}/lines`, {
      method: 'POST',
      body: JSON.stringify({
        productId: Number(productId),
        productVariantId: productVariantId ? Number(productVariantId) : null,
        quantity: Number(quantity),
        unitPrice: unitPrice !== null && unitPrice !== undefined && unitPrice !== '' ? Number(unitPrice) : null,
      }),
    });
  },

  updateLine: async (quotationId, lineId, quantity = null, unitPrice = null) => {
    return await apiFetch(`/api/quotations/${quotationId}/lines/${lineId}`, {
      method: 'PUT',
      body: JSON.stringify({
        quantity: quantity ? Number(quantity) : null,
        unitPrice: unitPrice !== null && unitPrice !== undefined && unitPrice !== '' ? Number(unitPrice) : null,
      }),
    });
  },

  deleteLine: async (quotationId, lineId) => {
    return await apiFetch(`/api/quotations/${quotationId}/lines/${lineId}`, {
      method: 'DELETE',
    });
  },

  submitForApproval: async (quotationId) => {
    return await apiFetch(`/api/quotations/${quotationId}/submit-approval`, {
      method: 'POST',
    });
  },

  sendToCustomer: async (quotationId) => {
    return await apiFetch(`/api/quotations/${quotationId}/send-to-customer`, {
      method: 'POST',
    });
  },

  evaluateRisk: async (quotationId) => {
    return await apiFetch(`/api/quotations/${quotationId}/evaluate-risk`, {
      method: 'POST',
    });
  },

  getRecommendations: async (quotationId) => {
    return await apiFetch(`/api/quotations/${quotationId}/recommendations`);
  },
};
