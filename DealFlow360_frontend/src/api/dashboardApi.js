import { apiFetch } from './client';

export const dashboardApi = {
  getSalesMetrics: async () => {
    const res = await apiFetch('/api/sales/dashboard/metrics');
    return res.data || res;
  },

  getDealHealthAlerts: async () => {
    return await apiFetch('/api/deal-health/alerts');
  },

  resolveDealHealthAlert: async (alertId) => {
    return await apiFetch(`/api/deal-health/alerts/${alertId}/resolve`, {
      method: 'POST',
    });
  },

  getSalesPerformanceReport: async () => {
    return await apiFetch('/api/reporting/sales-performance');
  },

  getQuotationsByStatusReport: async () => {
    return await apiFetch('/api/reporting/quotations-by-status');
  },

  getProductPerformanceReport: async () => {
    return await apiFetch('/api/reporting/product-performance');
  },
};
