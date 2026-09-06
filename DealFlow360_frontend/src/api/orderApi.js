import { apiFetch } from './client';

export const orderApi = {
  getAllOrders: async () => {
    return await apiFetch('/api/orders');
  },

  getOrderById: async (id) => {
    return await apiFetch(`/api/orders/${id}`);
  },

  confirmQuotation: async (quotationId) => {
    return await apiFetch('/api/orders/confirm-quotation', {
      method: 'POST',
      body: JSON.stringify({
        quotationId: Number(quotationId),
      }),
    });
  },
};
