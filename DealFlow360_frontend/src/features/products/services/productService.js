import { apiClient } from '../../../services/api/apiClient';

/**
 * In-memory fallback store for standalone UI preview before backend integration is live.
 */
let mockProducts = [
  {
    id: 'prd_01',
    name: 'Enterprise Rack Server X500',
    sku: 'PRD-SRV-500',
    category_id: 'cat_01',
    category: { id: 'cat_01', name: 'Hardware & Server Infrastructure' },
    description: 'High-density 2U rack server with dual Intel Xeon processors and 128GB RAM.',
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'prd_02',
    name: 'Cloud Security Suite Enterprise',
    sku: 'PRD-SW-SEC',
    category_id: 'cat_02',
    category: { id: 'cat_02', name: 'Software Licenses & Subscriptions' },
    description: 'Annual enterprise security monitoring license with 24/7 automated threat detection.',
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'prd_03',
    name: 'Managed Deployment & Integration',
    sku: 'PRD-SVC-DEP',
    category_id: 'cat_03',
    category: { id: 'cat_03', name: 'Professional Services & Consulting' },
    description: 'Full-service enterprise deployment, system configuration, and migration support.',
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
];

/**
 * Product API Service
 * Centralized service layer for backend product operations.
 * Communicates with backend endpoints via apiClient with integration fallback.
 */
export const productService = {
  async getProducts(params = {}) {
    try {
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
    } catch (err) {
      console.warn('[productService] Backend offline or pending integration. Using integration-ready preview store.');
      return this.handleFallbackGetProducts(params);
    }
  },

  async getProductById(id) {
    if (!id) throw new Error('Product ID is required.');
    try {
      return await apiClient.get(`/products/${id}`);
    } catch (err) {
      console.warn(`[productService] getProductById(${id}) backend offline. Using fallback store.`);
      const item = mockProducts.find((p) => p.id === id);
      if (!item) {
        const notFoundErr = new Error('Product not found.');
        notFoundErr.status = 404;
        throw notFoundErr;
      }
      return { data: item };
    }
  },

  async createProduct(productData) {
    try {
      return await apiClient.post('/products', productData);
    } catch (err) {
      console.warn('[productService] createProduct backend offline. Using fallback store.');
      
      // Check duplicate SKU
      const duplicateSku = mockProducts.find(
        (p) => p.sku.toUpperCase() === productData.sku.trim().toUpperCase()
      );
      if (duplicateSku) {
        const error = new Error('Product code already exists.');
        error.status = 409;
        throw error;
      }

      const newProduct = {
        id: `prd_${Date.now()}`,
        name: productData.name.trim(),
        sku: productData.sku.trim().toUpperCase(),
        category_id: productData.category_id,
        category: { id: productData.category_id, name: 'Assigned Category' },
        description: productData.description || '',
        status: productData.status || 'ACTIVE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockProducts.unshift(newProduct);
      return { data: newProduct };
    }
  },

  async updateProduct(id, productData) {
    if (!id) throw new Error('Product ID is required.');
    try {
      return await apiClient.put(`/products/${id}`, productData);
    } catch (err) {
      console.warn(`[productService] updateProduct(${id}) backend offline. Using fallback store.`);
      const index = mockProducts.findIndex((p) => p.id === id);
      if (index === -1) {
        const notFoundErr = new Error('Product not found.');
        notFoundErr.status = 404;
        throw notFoundErr;
      }

      if (productData.sku) {
        const duplicateSku = mockProducts.find(
          (p) => p.id !== id && p.sku.toUpperCase() === productData.sku.trim().toUpperCase()
        );
        if (duplicateSku) {
          const error = new Error('Product code already exists.');
          error.status = 409;
          throw error;
        }
      }

      const updated = {
        ...mockProducts[index],
        ...productData,
        updated_at: new Date().toISOString(),
      };

      mockProducts[index] = updated;
      return { data: updated };
    }
  },

  async updateProductStatus(id, status) {
    if (!id) throw new Error('Product ID is required.');
    try {
      return await apiClient.request(`/products/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.warn(`[productService] updateProductStatus(${id}, ${status}) backend offline. Using fallback store.`);
      const index = mockProducts.findIndex((p) => p.id === id);
      if (index === -1) {
        const notFoundErr = new Error('Product not found.');
        notFoundErr.status = 404;
        throw notFoundErr;
      }

      mockProducts[index].status = status;
      mockProducts[index].updated_at = new Date().toISOString();
      return { data: mockProducts[index] };
    }
  },

  handleFallbackGetProducts(params = {}) {
    let list = [...mockProducts];

    // Filter search (Name or SKU)
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Filter Category
    if (params.categoryId) {
      list = list.filter((p) => p.category_id === params.categoryId);
    }

    // Filter Status
    if (params.status) {
      list = list.filter((p) => p.status === params.status);
    }

    // Sorting
    const sortBy = params.sortBy || 'name';
    const sortOrder = params.sortOrder === 'desc' ? -1 : 1;
    list.sort((a, b) => {
      const valA = a[sortBy] || '';
      const valB = b[sortBy] || '';
      if (valA < valB) return -1 * sortOrder;
      if (valA > valB) return 1 * sortOrder;
      return 0;
    });

    // Pagination
    const page = Number(params.page) || 1;
    const pageSize = Number(params.pageSize) || 10;
    const totalCount = list.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const startIndex = (page - 1) * pageSize;
    const paginatedList = list.slice(startIndex, startIndex + pageSize);

    return {
      data: paginatedList,
      meta: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  },
};

export default productService;
