import { apiClient } from '../../../services/api/apiClient';
import { validateWarehouse } from '../validation/inventoryValidation';

/**
 * Preview store for Warehouses.
 */
let mockWarehouses = [
  {
    warehouseId: 'WH-VJA-01',
    warehouseCode: 'WH-VJA-01',
    name: 'Vijayawada Central Logistics Hub',
    description: 'Main regional distribution & hardware fulfillment center',
    address: 'Plot 42, Auto Nagar Industrial Estate',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    country: 'India',
    postalCode: '520007',
    status: 'ACTIVE',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-09-05T12:00:00.000Z',
  },
  {
    warehouseId: 'WH-HYD-01',
    warehouseCode: 'WH-HYD-01',
    name: 'Hyderabad Cyberabad Tech Depot',
    description: 'High-density networking & server rack assembly warehouse',
    address: 'Phase 3, HITEC City Industrial Zone',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    postalCode: '500081',
    status: 'ACTIVE',
    createdAt: '2026-02-15T09:30:00.000Z',
    updatedAt: '2026-09-05T12:00:00.000Z',
  },
  {
    warehouseId: 'WH-[#714B67]-01',
    warehouseCode: 'WH-BLR-01',
    name: 'Bengaluru Commercial Fulfillment Center',
    description: 'South regional electronics & enterprise equipment warehouse',
    address: 'Electronics City Phase II',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    postalCode: '560100',
    status: 'ACTIVE',
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-09-05T12:00:00.000Z',
  },
];

export const warehouseService = {
  /**
   * Fetch paginated list of warehouses.
   */
  async getWarehouses(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('limit', params.pageSize);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);

      return await apiClient.get(`/company/warehouses?${queryParams.toString()}`);
    } catch (err) {
      console.warn('[warehouseService] Backend API offline. Returning preview warehouses.');
      return this.handleFallbackGetWarehouses(params);
    }
  },

  /**
   * Fetch single warehouse details by ID.
   */
  async getWarehouseById(id) {
    if (!id) throw new Error('Warehouse ID is required.');
    try {
      return await apiClient.get(`/company/warehouses/${id}`);
    } catch (err) {
      const found = mockWarehouses.find((w) => w.warehouseId === id || w.warehouseCode === id);
      if (!found) {
        const error = new Error('Warehouse not found.');
        error.status = 404;
        throw error;
      }
      return found;
    }
  },

  /**
   * Create a new warehouse. Enforces unique warehouseCode.
   */
  async createWarehouse(data) {
    const validation = validateWarehouse(data);
    if (!validation.isValid) throw new Error(validation.error);

    try {
      return await apiClient.post('/company/warehouses', data);
    } catch (err) {
      console.warn('[warehouseService] Backend API offline. Creating warehouse in preview store.');
      const code = data.warehouseCode.trim().toUpperCase();

      // Check unique code
      if (mockWarehouses.some((w) => w.warehouseCode === code)) {
        throw new Error(`Warehouse code '${code}' already exists in your organization.`);
      }

      const newWh = {
        warehouseId: `WH-${Date.now()}`,
        warehouseCode: code,
        name: data.name.trim(),
        description: data.description ? data.description.trim() : '',
        address: data.address ? data.address.trim() : '',
        city: data.city.trim(),
        state: data.state ? data.state.trim() : '',
        country: data.country || 'India',
        postalCode: data.postalCode || '',
        status: data.status || 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockWarehouses.unshift(newWh);
      return newWh;
    }
  },

  /**
   * Update warehouse properties.
   */
  async updateWarehouse(id, data) {
    if (!id) throw new Error('Warehouse ID is required.');
    const validation = validateWarehouse(data);
    if (!validation.isValid) throw new Error(validation.error);

    try {
      return await apiClient.put(`/company/warehouses/${id}`, data);
    } catch (err) {
      const index = mockWarehouses.findIndex((w) => w.warehouseId === id || w.warehouseCode === id);
      if (index === -1) throw new Error('Warehouse not found.');

      const existing = mockWarehouses[index];
      const updated = {
        ...existing,
        name: data.name.trim(),
        description: data.description ? data.description.trim() : existing.description,
        address: data.address ? data.address.trim() : existing.address,
        city: data.city.trim(),
        state: data.state ? data.state.trim() : existing.state,
        country: data.country || existing.country,
        postalCode: data.postalCode || existing.postalCode,
        updatedAt: new Date().toISOString(),
      };

      mockWarehouses[index] = updated;
      return updated;
    }
  },

  /**
   * Update warehouse status (ACTIVE / INACTIVE).
   */
  async updateWarehouseStatus(id, status) {
    if (!id) throw new Error('Warehouse ID is required.');
    try {
      return await apiClient.patch(`/company/warehouses/${id}/status`, { status });
    } catch (err) {
      const index = mockWarehouses.findIndex((w) => w.warehouseId === id || w.warehouseCode === id);
      if (index === -1) throw new Error('Warehouse not found.');

      mockWarehouses[index].status = status;
      mockWarehouses[index].updatedAt = new Date().toISOString();
      return mockWarehouses[index];
    }
  },

  /**
   * Fallback query handler.
   */
  handleFallbackGetWarehouses(params) {
    let list = [...mockWarehouses];

    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.warehouseCode.toLowerCase().includes(q) ||
          w.city.toLowerCase().includes(q)
      );
    }

    if (params.status && params.status !== 'ALL') {
      list = list.filter((w) => w.status === params.status);
    }

    const page = parseInt(params.page || 1, 10);
    const limit = parseInt(params.pageSize || 10, 10);
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      meta: {
        total: list.length,
        page,
        limit,
        totalPages: Math.ceil(list.length / limit) || 1,
      },
    };
  },
};
