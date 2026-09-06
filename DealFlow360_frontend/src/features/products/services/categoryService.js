import { apiClient } from '../../../services/api/apiClient';

/**
 * Category API Service
 * Centralized service layer for backend category operations.
 */
export const categoryService = {
  async getCategories(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('limit', params.pageSize);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = `/categories${queryString ? `?${queryString}` : ''}`;
    return await apiClient.get(endpoint);
  },

  async getCategoryById(id) {
    if (!id) throw new Error('Category ID is required.');
    return await apiClient.get(`/categories/${id}`);
  },

  async createCategory(categoryData) {
    return await apiClient.post('/categories', categoryData);
  },

  async updateCategory(id, categoryData) {
    if (!id) throw new Error('Category ID is required.');
    return await apiClient.put(`/categories/${id}`, categoryData);
  },

  async updateCategoryStatus(id, status) {
    if (!id) throw new Error('Category ID is required.');
    return await apiClient.request(`/categories/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

export default categoryService;

