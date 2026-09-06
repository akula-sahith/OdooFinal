import { apiFetch } from './client';

export const billingApi = {
  generateInvoice: async (orderId) => {
    return await apiFetch(`/api/billing/invoices/generate/${orderId}`, {
      method: 'POST',
    });
  },

  getAllInvoices: async () => {
    return await apiFetch('/api/billing/invoices');
  },

  getInvoiceById: async (id) => {
    return await apiFetch(`/api/billing/invoices/${id}`);
  },

  recordPayment: async (invoiceId, paymentMethod = 'CREDIT_CARD', amount = 0, reference = '') => {
    return await apiFetch('/api/billing/payments', {
      method: 'POST',
      body: JSON.stringify({
        invoiceId: Number(invoiceId),
        paymentMethod,
        amount: Number(amount),
        reference,
      }),
    });
  },

  getAllPayments: async () => {
    return await apiFetch('/api/billing/payments');
  },

  issueCreditNote: async (invoiceId, amount, reason) => {
    return await apiFetch('/api/billing/credit-notes', {
      method: 'POST',
      body: JSON.stringify({
        invoiceId: Number(invoiceId),
        amount: Number(amount),
        reason,
      }),
    });
  },

  getSubscriptionPlans: async () => {
    return await apiFetch('/api/subscriptions/plans');
  },

  createSubscriptionPlan: async (planData) => {
    return await apiFetch('/api/subscriptions/plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  },

  getAllSubscriptions: async () => {
    return await apiFetch('/api/subscriptions');
  },

  cancelSubscription: async (subscriptionId) => {
    return await apiFetch(`/api/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
    });
  },
};
