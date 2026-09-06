import { apiClient } from '../../../services/api/apiClient';
import { validateWarehouse } from '../validation/inventoryValidation';

export const warehouseService = {
  /**
   * Fetch list of warehouses from backend.
   */
  async getWarehouses(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('limit', params.pageSize);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);

    const res = await apiClient.get(`/warehouses?${queryParams.toString()}`);
    return Array.isArray(res) ? { data: res, meta: { total: res.length, page: 1, limit: res.length, totalPages: 1 } } : res;
  },

  /**
   * Fetch single warehouse details by ID.
   */
  async getWarehouseById(id) {
    if (!id) throw new Error('Warehouse ID is required.');
    return await apiClient.get(`/warehouses/${id}`);
  },

  /**
   * Create a new warehouse.
   */
  async createWarehouse(data) {
    const validation = validateWarehouse(data);
    if (!validation.isValid) throw new Error(validation.error);
    return await apiClient.post('/warehouses', data);
  },

  /**
   * Update warehouse properties.
   */
  async updateWarehouse(id, data) {
    if (!id) throw new Error('Warehouse ID is required.');
    const validation = validateWarehouse(data);
    if (!validation.isValid) throw new Error(validation.error);
    return await apiClient.put(`/warehouses/${id}`, data);
  },

  /**
   * Update warehouse status.
   */
  async updateWarehouseStatus(id, status) {
    if (!id) throw new Error('Warehouse ID is required.');
    return await apiClient.patch(`/warehouses/${id}/status`, { status });
  },
};
