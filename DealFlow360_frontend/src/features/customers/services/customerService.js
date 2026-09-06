import { apiClient } from '../../../services/api/apiClient';

/**
 * Customer API Service
 * Centralized service layer for B2B Customer management and Customer Contacts.
 */
export const customerService = {
  /**
   * Fetch list of customers with optional filtering.
   */
  async getCustomers(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    const queryString = queryParams.toString();
    const endpoint = `/customers${queryString ? `?${queryString}` : ''}`;
    return await apiClient.get(endpoint);
  },

  /**
   * Fetch customer by ID.
   */
  async getCustomerById(id) {
    if (!id) throw new Error('Customer ID is required.');
    return await apiClient.get(`/customers/${id}`);
  },

  /**
   * Create a new customer.
   */
  async createCustomer(customerData) {
    return await apiClient.post('/customers', customerData);
  },

  /**
   * Update an existing customer.
   */
  async updateCustomer(id, customerData) {
    if (!id) throw new Error('Customer ID is required.');
    return await apiClient.put(`/customers/${id}`, customerData);
  },

  /**
   * Fetch contacts for a specific customer.
   */
  async getCustomerContacts(customerId) {
    if (!customerId) throw new Error('Customer ID is required.');
    return await apiClient.get(`/customers/${customerId}/contacts`);
  },

  /**
   * Create a contact for a customer.
   */
  async createCustomerContact(customerId, contactData) {
    if (!customerId) throw new Error('Customer ID is required.');
    return await apiClient.post(`/customers/${customerId}/contacts`, contactData);
  },
};

export default customerService;
