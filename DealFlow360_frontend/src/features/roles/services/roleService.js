import { apiClient } from '../../../services/api/apiClient';

export const roleService = {
  /**
   * Fetch list of security roles.
   */
  async getRoles(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('limit', params.pageSize);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = `/roles${queryString ? `?${queryString}` : ''}`;
    const res = await apiClient.get(endpoint);
    return Array.isArray(res) ? { data: res, meta: { total: res.length, page: 1, limit: res.length, totalPages: 1 } } : res;
  },

  /**
   * Fetch single Role record by ID.
   */
  async getRoleById(id) {
    if (!id) throw new Error('Role ID is required.');
    return await apiClient.get(`/roles/${id}`);
  },

  /**
   * Create a new security role.
   */
  async createRole(roleData) {
    return await apiClient.post('/roles', roleData);
  },

  /**
   * Update an existing security role.
   */
  async updateRole(id, roleData) {
    if (!id) throw new Error('Role ID is required.');
    return await apiClient.put(`/roles/${id}`, roleData);
  },

  /**
   * Update role active status.
   */
  async updateRoleStatus(id, status) {
    if (!id) throw new Error('Role ID is required.');
    return await apiClient.request(`/roles/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Update permissions assigned to a role.
   */
  async updateRolePermissions(id, permissions) {
    if (!id) throw new Error('Role ID is required.');
    return await apiClient.put(`/roles/${id}/permissions`, { permissions });
  },
};

export default roleService;
