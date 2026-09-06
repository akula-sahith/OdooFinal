import { apiClient } from '../../../services/api/apiClient';

/**
 * Product API Service
 * Centralized service layer for backend product operations.
 */
export const productService = {
  async getProducts(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('limit', params.pageSize);
    if (params.search) queryParams.append('search', params.search);
    if (params.categoryId) queryParams.append('category_id', params.categoryId);
    if (params.status) queryParams.append('status', params.status);
    if (params.sortBy) queryParams.append('sort_by', params.sortBy);
    if (params.sortOrder) queryParams.append('sort_order', params.sortOrder);

    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    return await apiClient.get(endpoint);
  },

  async getProductById(id) {
    if (!id) throw new Error('Product ID is required.');
    return await apiClient.get(`/products/${id}`);
  },

  async createProduct(productData) {
    return await apiClient.post('/products', productData);
  },

  async updateProduct(id, productData) {
    if (!id) throw new Error('Product ID is required.');
    return await apiClient.put(`/products/${id}`, productData);
  },

  async updateProductStatus(id, status) {
    if (!id) throw new Error('Product ID is required.');
    return await apiClient.request(`/products/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async getProductVariants(productId) {
    if (!productId) throw new Error('Product ID is required.');
    return await apiClient.get(`/products/${productId}/variants`);
  },

  async createProductVariant(productId, variantData) {
    if (!productId) throw new Error('Product ID is required.');
    return await apiClient.post(`/products/${productId}/variants`, variantData);
  },

  async deleteProductVariant(productId, variantId) {
    if (!productId || !variantId) throw new Error('Product ID and Variant ID are required.');
    return await apiClient.delete(`/products/${productId}/variants/${variantId}`);
  },
};

export default productService;

