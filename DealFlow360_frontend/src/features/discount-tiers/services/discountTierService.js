import { apiClient } from '../../../services/api/apiClient';

/**
 * Discount Tier API Service
 * Centralized service layer for Admin Discount Governance configuration.
 */
export const discountTierService = {
  /**
   * Fetch paginated list of discount tiers.
   */
  async getDiscountTiers(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('limit', params.pageSize);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.approvalLevel !== undefined && params.approvalLevel !== 'ALL') {
      queryParams.append('approval_level', params.approvalLevel);
    }
    if (params.sortBy) queryParams.append('sort_by', params.sortBy);
    if (params.sortOrder) queryParams.append('sort_order', params.sortOrder);

    const queryString = queryParams.toString();
    const endpoint = `/discount-tiers${queryString ? `?${queryString}` : ''}`;
    return await apiClient.get(endpoint);
  },

  /**
   * Fetch single Discount Tier record by ID.
   */
  async getDiscountTierById(id) {
    if (!id) throw new Error('Discount tier ID is required.');
    return await apiClient.get(`/discount-tiers/${id}`);
  },

  /**
   * Create a new Discount Tier rule.
   */
  async createDiscountTier(tierData) {
    return await apiClient.post('/discount-tiers', tierData);
  },

  /**
   * Update an existing Discount Tier rule.
   */
  async updateDiscountTier(id, tierData) {
    if (!id) throw new Error('Discount tier ID is required.');
    return await apiClient.put(`/discount-tiers/${id}`, tierData);
  },

  /**
   * Update Discount Tier active status (ACTIVE / INACTIVE).
   */
  async updateDiscountTierStatus(id, status) {
    if (!id) throw new Error('Discount tier ID is required.');
    return await apiClient.request(`/discount-tiers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Delete a discount tier.
   */
  async deleteDiscountTier(id) {
    if (!id) throw new Error('Discount tier ID is required.');
    return await apiClient.delete(`/discount-tiers/${id}`);
  },

  /**
   * Fetch category discount ceilings.
   */
  async getDiscountCeilings() {
    return await apiClient.get('/discount-ceilings');
  },

  /**
   * Save category discount ceiling.
   */
  async saveDiscountCeiling(ceilingData) {
    return await apiClient.post('/discount-ceilings', ceilingData);
  },
};

export default discountTierService;

