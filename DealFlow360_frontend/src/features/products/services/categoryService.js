import { apiClient } from '../../../services/api/apiClient';

/**
 * In-memory fallback store for standalone UI preview before backend integration is live.
 */
let mockCategories = [
  {
    id: 'cat_01',
    name: 'Hardware & Server Infrastructure',
    description: 'Enterprise rack servers, network switches, and data center hardware.',
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'cat_02',
    name: 'Software Licenses & Subscriptions',
    description: 'Cloud software licenses, SaaS subscriptions, and enterprise software modules.',
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'cat_03',
    name: 'Professional Services & Consulting',
    description: 'Implementation, integration services, technical support, and consulting hours.',
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

/**
 * Category API Service
 * Centralized service layer for backend category operations.
 * Communicates with backend endpoints via apiClient with integration fallback.
 */
export const categoryService = {
  async getCategories(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('limit', params.pageSize);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);

      const queryString = queryParams.toString();
      const endpoint = `/categories${queryString ? `?${queryString}` : ''}`;
      return await apiClient.get(endpoint);
    } catch (err) {
      console.warn('[categoryService] Backend offline or pending integration. Using integration-ready preview store.');
      return this.handleFallbackGetCategories(params);
    }
  },

  async getCategoryById(id) {
    if (!id) throw new Error('Category ID is required.');
    try {
      return await apiClient.get(`/categories/${id}`);
    } catch (err) {
      console.warn(`[categoryService] getCategoryById(${id}) backend offline. Using fallback store.`);
      const item = mockCategories.find((c) => c.id === id);
      if (!item) {
        const notFoundErr = new Error('Category not found.');
        notFoundErr.status = 404;
        throw notFoundErr;
      }
      return { data: item };
    }
  },

  async createCategory(categoryData) {
    try {
      return await apiClient.post('/categories', categoryData);
    } catch (err) {
      console.warn('[categoryService] createCategory backend offline. Using fallback store.');
      // Check duplicate category name
      const duplicate = mockCategories.find(
        (c) => c.name.toLowerCase() === categoryData.name.trim().toLowerCase()
      );
      if (duplicate) {
        const error = new Error('Category name already exists.');
        error.status = 409;
        throw error;
      }

      const newCategory = {
        id: `cat_${Date.now()}`,
        name: categoryData.name.trim(),
        description: categoryData.description || '',
        status: categoryData.status || 'ACTIVE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockCategories.unshift(newCategory);
      return { data: newCategory };
    }
  },

  async updateCategory(id, categoryData) {
    if (!id) throw new Error('Category ID is required.');
    try {
      return await apiClient.put(`/categories/${id}`, categoryData);
    } catch (err) {
      console.warn(`[categoryService] updateCategory(${id}) backend offline. Using fallback store.`);
      const index = mockCategories.findIndex((c) => c.id === id);
      if (index === -1) {
        const notFoundErr = new Error('Category not found.');
        notFoundErr.status = 404;
        throw notFoundErr;
      }

      if (categoryData.name) {
        const duplicate = mockCategories.find(
          (c) => c.id !== id && c.name.toLowerCase() === categoryData.name.trim().toLowerCase()
        );
        if (duplicate) {
          const error = new Error('Category name already exists.');
          error.status = 409;
          throw error;
        }
      }

      const updated = {
        ...mockCategories[index],
        ...categoryData,
        updated_at: new Date().toISOString(),
      };
      mockCategories[index] = updated;
      return { data: updated };
    }
  },

  async updateCategoryStatus(id, status) {
    if (!id) throw new Error('Category ID is required.');
    try {
      return await apiClient.request(`/categories/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.warn(`[categoryService] updateCategoryStatus(${id}, ${status}) backend offline. Using fallback store.`);
      const index = mockCategories.findIndex((c) => c.id === id);
      if (index === -1) {
        const notFoundErr = new Error('Category not found.');
        notFoundErr.status = 404;
        throw notFoundErr;
      }
      mockCategories[index].status = status;
      mockCategories[index].updated_at = new Date().toISOString();
      return { data: mockCategories[index] };
    }
  },

  handleFallbackGetCategories(params = {}) {
    let list = [...mockCategories];

    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q)));
    }

    if (params.status) {
      list = list.filter((c) => c.status === params.status);
    }

    return {
      data: list,
      meta: {
        currentPage: 1,
        pageSize: list.length,
        totalCount: list.length,
        totalPages: 1,
      },
    };
  },
};

export default categoryService;
