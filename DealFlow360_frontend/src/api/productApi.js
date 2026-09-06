import { apiFetch } from './client';

export const productApi = {
  getAllProducts: async (search = '', categoryId = null) => {
    let url = '/api/products?limit=100';
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    const res = await apiFetch(url);
    return Array.isArray(res) ? res : (res.data || []);
  },

  getProductById: async (id) => {
    return await apiFetch(`/api/products/${id}`);
  },

  createProduct: async (productData) => {
    return await apiFetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  getAllCategories: async () => {
    return await apiFetch('/api/categories');
  },

  createCategory: async (name) => {
    return await apiFetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  getProductVariants: async (productId) => {
    return await apiFetch(`/api/products/${productId}/variants`);
  },

  getAllPriceLists: async () => {
    return await apiFetch('/api/price-lists');
  },
};
