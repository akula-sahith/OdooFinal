import { apiFetch } from './client';

export const portalApi = {
  getPortalQuotationView: async (id) => {
    return await apiFetch(`/api/portal/quotations/${id}`);
  },

  submitNegotiation: async (negotiationData) => {
    return await apiFetch('/api/portal/negotiate', {
      method: 'POST',
      body: JSON.stringify(negotiationData),
    });
  },

  confirmQuotation: async (quotationId, pin = null, paymentMethod = null) => {
    return await apiFetch('/api/portal/confirm-quotation', {
      method: 'POST',
      body: JSON.stringify({
        quotationId: Number(quotationId),
        pin: pin || null,
        paymentMethod: paymentMethod || 'DEMO_PIN_PAYMENT',
      }),
    });
  },
};
