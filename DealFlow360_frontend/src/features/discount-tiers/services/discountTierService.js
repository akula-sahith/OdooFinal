import { apiClient } from '../../../services/api/apiClient';

/**
 * Fallback preview store for standalone UI preview when backend API is offline.
 * Initialized with representative governance rules for Salesperson, Manager, and Finance levels.
 */
let mockDiscountTiers = [
  {
    id: 'dt_01',
    name: 'Salesperson Standard Tier',
    code: 'DT-SLS-01',
    description: 'Standard discount threshold permitted directly by Salesperson without escalation.',
    minimumDiscount: 0.0,
    maximumDiscount: 5.0,
    approvalLevel: 0,
    approvalRole: 'Salesperson',
    priority: 1,
    status: 'ACTIVE',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'dt_02',
    name: 'Sales Manager Approval Tier',
    code: 'DT-MGR-02',
    description: 'Medium discount threshold requiring explicit approval from the Sales Manager.',
    minimumDiscount: 5.01,
    maximumDiscount: 12.0,
    approvalLevel: 1,
    approvalRole: 'Sales Manager',
    priority: 2,
    status: 'ACTIVE',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'dt_03',
    name: 'Finance & Ops High Risk Tier',
    code: 'DT-FIN-03',
    description: 'High risk escalation tier requiring dual sign-off from Finance and Operations.',
    minimumDiscount: 12.01,
    maximumDiscount: 25.0,
    approvalLevel: 2,
    approvalRole: 'Finance / Operations',
    priority: 3,
    status: 'ACTIVE',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'dt_04',
    name: 'Executive Special Contract Tier',
    code: 'DT-EXEC-04',
    description: 'Special strategic deal discount tier reserved for C-suite or Board authorization.',
    minimumDiscount: 25.01,
    maximumDiscount: 50.0,
    approvalLevel: 3,
    approvalRole: 'Executive / Admin',
    priority: 4,
    status: 'INACTIVE',
    effectiveFrom: '2026-01-01',
    effectiveTo: '2026-12-31',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

/**
 * Discount Tier API Service
 * Centralized service layer for Admin Discount Governance configuration.
 * Communicates directly with backend endpoints via apiClient with preview fallback when offline.
 */
export const discountTierService = {
  /**
   * Fetch paginated list of discount tiers.
   */
  async getDiscountTiers(params = {}) {
    try {
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
    } catch (err) {
      console.warn('[discountTierService] Backend API offline. Operating in preview mode.');
      return this.handleFallbackGetDiscountTiers(params);
    }
  },

  /**
   * Fetch single Discount Tier record by ID.
   */
  async getDiscountTierById(id) {
    if (!id) throw new Error('Discount tier ID is required.');
    try {
      return await apiClient.get(`/discount-tiers/${id}`);
    } catch (err) {
      console.warn('[discountTierService] Backend API offline. Operating in preview mode.');
      const record = mockDiscountTiers.find((dt) => dt.id === id);
      if (!record) {
        const error = new Error('Discount tier configuration not found.');
        error.status = 404;
        throw error;
      }
      return record;
    }
  },

  /**
   * Create a new Discount Tier rule.
   */
  async createDiscountTier(tierData) {
    try {
      return await apiClient.post('/discount-tiers', tierData);
    } catch (err) {
      console.warn('[discountTierService] Backend API offline. Creating in preview store.');

      // Check unique code
      const duplicateCode = mockDiscountTiers.some(
        (dt) => dt.code.toLowerCase() === tierData.code.trim().toLowerCase()
      );
      if (duplicateCode) {
        const error = new Error('A discount tier with this code already exists.');
        error.status = 409;
        error.errors = { code: 'Discount tier code must be unique.' };
        throw error;
      }

      const newRecord = {
        id: `dt_${Date.now()}`,
        name: tierData.name.trim(),
        code: tierData.code.trim().toUpperCase(),
        description: tierData.description?.trim() || '',
        minimumDiscount: parseFloat(tierData.minimumDiscount),
        maximumDiscount: parseFloat(tierData.maximumDiscount),
        approvalLevel: parseInt(tierData.approvalLevel ?? 0, 10),
        approvalRole: tierData.approvalRole || 'Salesperson',
        priority: parseInt(tierData.priority || 1, 10),
        status: tierData.status || 'ACTIVE',
        effectiveFrom: tierData.effectiveFrom || new Date().toISOString().split('T')[0],
        effectiveTo: tierData.effectiveTo || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockDiscountTiers.push(newRecord);
      // Sort mock list by priority
      mockDiscountTiers.sort((a, b) => a.priority - b.priority);

      return newRecord;
    }
  },

  /**
   * Update an existing Discount Tier rule.
   */
  async updateDiscountTier(id, tierData) {
    if (!id) throw new Error('Discount tier ID is required.');
    try {
      return await apiClient.put(`/discount-tiers/${id}`, tierData);
    } catch (err) {
      console.warn('[discountTierService] Backend API offline. Updating in preview store.');
      const index = mockDiscountTiers.findIndex((dt) => dt.id === id);
      if (index === -1) {
        const error = new Error('Discount tier configuration not found.');
        error.status = 404;
        throw error;
      }

      // Check unique code if changed
      if (tierData.code) {
        const duplicateCode = mockDiscountTiers.some(
          (dt) => dt.id !== id && dt.code.toLowerCase() === tierData.code.trim().toLowerCase()
        );
        if (duplicateCode) {
          const error = new Error('A discount tier with this code already exists.');
          error.status = 409;
          error.errors = { code: 'Discount tier code must be unique.' };
          throw error;
        }
      }

      const updatedRecord = {
        ...mockDiscountTiers[index],
        ...tierData,
        minimumDiscount: tierData.minimumDiscount !== undefined ? parseFloat(tierData.minimumDiscount) : mockDiscountTiers[index].minimumDiscount,
        maximumDiscount: tierData.maximumDiscount !== undefined ? parseFloat(tierData.maximumDiscount) : mockDiscountTiers[index].maximumDiscount,
        approvalLevel: tierData.approvalLevel !== undefined ? parseInt(tierData.approvalLevel, 10) : mockDiscountTiers[index].approvalLevel,
        priority: tierData.priority !== undefined ? parseInt(tierData.priority, 10) : mockDiscountTiers[index].priority,
        updatedAt: new Date().toISOString(),
      };

      mockDiscountTiers[index] = updatedRecord;
      mockDiscountTiers.sort((a, b) => a.priority - b.priority);

      return updatedRecord;
    }
  },

  /**
   * Update Discount Tier active status (ACTIVE / INACTIVE).
   */
  async updateDiscountTierStatus(id, status) {
    if (!id) throw new Error('Discount tier ID is required.');
    try {
      return await apiClient.request(`/discount-tiers/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.warn('[discountTierService] Backend API offline. Updating status in preview store.');
      const record = mockDiscountTiers.find((dt) => dt.id === id);
      if (!record) {
        const error = new Error('Discount tier configuration not found.');
        error.status = 404;
        throw error;
      }
      record.status = status;
      record.updatedAt = new Date().toISOString();
      return record;
    }
  },

  /**
   * Helper for fallback search, filtering, and pagination.
   */
  handleFallbackGetDiscountTiers(params) {
    let filtered = [...mockDiscountTiers];

    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter(
        (dt) =>
          dt.name.toLowerCase().includes(term) ||
          dt.code.toLowerCase().includes(term) ||
          (dt.description && dt.description.toLowerCase().includes(term)) ||
          dt.approvalRole.toLowerCase().includes(term)
      );
    }

    if (params.status && params.status !== 'ALL') {
      filtered = filtered.filter((dt) => dt.status === params.status);
    }

    if (params.approvalLevel !== undefined && params.approvalLevel !== 'ALL') {
      const lvl = parseInt(params.approvalLevel, 10);
      filtered = filtered.filter((dt) => dt.approvalLevel === lvl);
    }

    // Sort by priority by default
    filtered.sort((a, b) => a.priority - b.priority);

    const page = parseInt(params.page || 1, 10);
    const limit = parseInt(params.pageSize || 10, 10);
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      meta: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit) || 1,
      },
    };
  },
};

export default discountTierService;
