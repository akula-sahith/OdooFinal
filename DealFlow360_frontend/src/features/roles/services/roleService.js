import { apiClient } from '../../../services/api/apiClient';

/**
 * Fallback preview store for standalone UI preview when backend API is offline.
 * Initialized with representative roles and permissions.
 */
let mockRoles = [
  {
    id: 'role_admin',
    name: 'Administrator',
    code: 'ROLE-ADMIN',
    description: 'Full enterprise system access, security governance, and RBAC control.',
    isSystem: true,
    userCount: 2,
    status: 'ACTIVE',
    permissions: [
      'dashboard.view',
      'products.view', 'products.create', 'products.update', 'products.manage_status',
      'categories.view', 'categories.create', 'categories.update',
      'pricing.view', 'pricing.create', 'pricing.update', 'pricing.manage_status',
      'discounts.view', 'discounts.create', 'discounts.update', 'discounts.manage_status',
      'approvals.view', 'approvals.update',
      'users.view', 'users.create', 'users.update', 'users.manage_status',
      'roles.view', 'roles.create', 'roles.update',
      'permissions.view',
      'customers.view', 'customers.create', 'customers.update',
      'quotations.view', 'quotations.create', 'quotations.update',
      'orders.view', 'security.view', 'audit_logs.view', 'settings.view',
    ],
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'role_sales_manager',
    name: 'Sales Manager',
    code: 'ROLE-MGR',
    description: 'Sales team leadership, quotation exception reviews, and customer account management.',
    isSystem: false,
    userCount: 3,
    status: 'ACTIVE',
    permissions: [
      'dashboard.view',
      'customers.view', 'customers.create', 'customers.update',
      'quotations.view', 'quotations.create', 'quotations.update',
      'products.view', 'categories.view',
      'pricing.view',
      'discounts.view',
      'approvals.view', 'approvals.update',
      'orders.view',
    ],
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'role_salesperson',
    name: 'Salesperson',
    code: 'ROLE-SLS',
    description: 'Frontline commercial activity, client proposals, and standard quotation creation.',
    isSystem: false,
    userCount: 8,
    status: 'ACTIVE',
    permissions: [
      'dashboard.view',
      'customers.view',
      'quotations.view', 'quotations.create',
      'products.view', 'categories.view',
      'pricing.view',
      'discounts.view',
    ],
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'role_finance_ops',
    name: 'Finance / Operations',
    code: 'ROLE-FIN',
    description: 'High-risk discount escalations, credit limit reviews, and margin governance.',
    isSystem: false,
    userCount: 2,
    status: 'ACTIVE',
    permissions: [
      'dashboard.view',
      'products.view',
      'pricing.view',
      'discounts.view',
      'approvals.view', 'approvals.update',
      'orders.view',
      'audit_logs.view',
    ],
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

/**
 * Role API Service
 * Centralized service layer for RBAC Role and Permission management.
 */
export const roleService = {
  /**
   * Fetch paginated list of security roles.
   */
  async getRoles(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('limit', params.pageSize);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);

      const queryString = queryParams.toString();
      const endpoint = `/roles${queryString ? `?${queryString}` : ''}`;
      return await apiClient.get(endpoint);
    } catch (err) {
      console.warn('[roleService] Backend API offline. Operating in preview mode.');
      return this.handleFallbackGetRoles(params);
    }
  },

  /**
   * Fetch single Role record by ID.
   */
  async getRoleById(id) {
    if (!id) throw new Error('Role ID is required.');
    try {
      return await apiClient.get(`/roles/${id}`);
    } catch (err) {
      console.warn('[roleService] Backend API offline. Operating in preview mode.');
      const record = mockRoles.find((r) => r.id === id);
      if (!record) {
        const error = new Error('Security role not found.');
        error.status = 404;
        throw error;
      }
      return record;
    }
  },

  /**
   * Create a new security role.
   */
  async createRole(roleData) {
    try {
      return await apiClient.post('/roles', roleData);
    } catch (err) {
      console.warn('[roleService] Backend API offline. Creating in preview store.');

      const duplicateCode = mockRoles.some(
        (r) => r.code.toLowerCase() === roleData.code.trim().toLowerCase()
      );
      if (duplicateCode) {
        const error = new Error('A security role with this code already exists.');
        error.status = 409;
        error.errors = { code: 'Role code must be unique.' };
        throw error;
      }

      const newRecord = {
        id: `role_${Date.now()}`,
        name: roleData.name.trim(),
        code: roleData.code.trim().toUpperCase(),
        description: roleData.description?.trim() || '',
        isSystem: false,
        userCount: 0,
        status: roleData.status || 'ACTIVE',
        permissions: Array.isArray(roleData.permissions) ? roleData.permissions : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockRoles.push(newRecord);
      return newRecord;
    }
  },

  /**
   * Update an existing security role.
   */
  async updateRole(id, roleData) {
    if (!id) throw new Error('Role ID is required.');
    try {
      return await apiClient.put(`/roles/${id}`, roleData);
    } catch (err) {
      console.warn('[roleService] Backend API offline. Updating in preview store.');
      const index = mockRoles.findIndex((r) => r.id === id);
      if (index === -1) {
        const error = new Error('Security role not found.');
        error.status = 404;
        throw error;
      }

      if (roleData.code) {
        const duplicateCode = mockRoles.some(
          (r) => r.id !== id && r.code.toLowerCase() === roleData.code.trim().toLowerCase()
        );
        if (duplicateCode) {
          const error = new Error('A security role with this code already exists.');
          error.status = 409;
          error.errors = { code: 'Role code must be unique.' };
          throw error;
        }
      }

      const updatedRecord = {
        ...mockRoles[index],
        ...roleData,
        updatedAt: new Date().toISOString(),
      };

      mockRoles[index] = updatedRecord;
      return updatedRecord;
    }
  },

  /**
   * Update role active status.
   */
  async updateRoleStatus(id, status) {
    if (!id) throw new Error('Role ID is required.');
    try {
      return await apiClient.request(`/roles/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.warn('[roleService] Backend API offline. Updating status in preview store.');
      const record = mockRoles.find((r) => r.id === id);
      if (!record) {
        const error = new Error('Security role not found.');
        error.status = 404;
        throw error;
      }

      // Self-protection check
      if (record.code === 'ROLE-ADMIN' && status === 'INACTIVE') {
        const error = new Error('The primary Administrator role cannot be deactivated.');
        error.status = 400;
        throw error;
      }

      record.status = status;
      record.updatedAt = new Date().toISOString();
      return record;
    }
  },

  /**
   * Update permissions assigned to a role.
   */
  async updateRolePermissions(id, permissions) {
    if (!id) throw new Error('Role ID is required.');
    try {
      return await apiClient.put(`/roles/${id}/permissions`, { permissions });
    } catch (err) {
      console.warn('[roleService] Backend API offline. Updating role permissions in preview store.');
      const record = mockRoles.find((r) => r.id === id);
      if (!record) {
        const error = new Error('Security role not found.');
        error.status = 404;
        throw error;
      }
      record.permissions = [...permissions];
      record.updatedAt = new Date().toISOString();
      return record;
    }
  },

  handleFallbackGetRoles(params) {
    let filtered = [...mockRoles];

    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          r.code.toLowerCase().includes(term) ||
          (r.description && r.description.toLowerCase().includes(term))
      );
    }

    if (params.status && params.status !== 'ALL') {
      filtered = filtered.filter((r) => r.status === params.status);
    }

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

export default roleService;
