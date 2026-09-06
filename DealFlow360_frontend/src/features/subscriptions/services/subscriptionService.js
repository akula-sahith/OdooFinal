import { apiClient } from '../../../services/api/apiClient';

export const subscriptionService = {
  getSubscriptions: async () => {
    return await apiClient.get('/subscriptions');
  },

  getSubscriptionById: async (id) => {
    return await apiClient.get(`/subscriptions/${id}`);
  },

  getPlans: async () => {
    return await apiClient.get('/subscriptions/plans');
  },

  createSubscription: async (data) => {
    return await apiClient.post('/subscriptions', data);
  },

  cancelSubscription: async (id) => {
    return await apiClient.post(`/subscriptions/${id}/cancel`);
  },
};
