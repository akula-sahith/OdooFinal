import { apiClient } from '../../../services/api/apiClient';

export const dealHealthService = {
  getAlerts: async () => {
    return await apiClient.get('/deal-health/alerts');
  },

  resolveAlert: async (id) => {
    return await apiClient.post(`/deal-health/alerts/${id}/resolve`);
  },
};
