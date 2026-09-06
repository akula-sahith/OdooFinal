import { apiFetch } from './client';

export const customerApi = {
  getAllCustomers: async (search = '') => {
    let url = '/api/customers?limit=100';
    if (search) url += `&search=${encodeURIComponent(search)}`;
    const res = await apiFetch(url);
    return Array.isArray(res) ? res : (res.data || []);
  },

  getCustomerById: async (id) => {
    return await apiFetch(`/api/customers/${id}`);
  },

  createCustomer: async (customerData) => {
    return await apiFetch('/api/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  },

  updateCustomer: async (id, customerData) => {
    return await apiFetch(`/api/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  },

  getCustomerRequests: async () => {
    const res = await apiFetch('/api/customer/requests?limit=100');
    return Array.isArray(res) ? res : (res.data || []);
  },

  respondToRequest: async (requestId, responseNotes, status = 'RESOLVED') => {
    return await apiFetch(`/api/customer/requests/${requestId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ response: responseNotes, status }),
    });
  },
};
