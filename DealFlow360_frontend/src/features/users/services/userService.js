import { apiClient } from '../../../services/api/apiClient';
import { roleService } from '../../roles/services/roleService';

/**
 * User API Service
 * Centralized service layer for Staff User management and governance.
 */
export const userService = {
  /**
   * Fetch paginated list of staff users with filtering.
   */
  async getUsers(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('limit', params.pageSize);
    if (params.search) queryParams.append('search', params.search);
    if (params.roleId) queryParams.append('roleId', params.roleId);
    if (params.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = `/users${queryString ? `?${queryString}` : ''}`;
    const res = await apiClient.get(endpoint);
    if (Array.isArray(res)) {
      return {
        data: res,
        meta: { total: res.length, page: 1, limit: 100, totalPages: 1 },
      };
    }
    return res;
  },

  /**
   * Fetch single staff user by ID with effective permissions.
   */
  async getUserById(id) {
    if (!id) throw new Error('User ID is required.');
    const user = await apiClient.get(`/users/${id}`);
    let permissions = [];
    try {
      if (user.roleId) {
        const role = await roleService.getRoleById(user.roleId);
        if (role) {
          permissions = role.permissions || [];
        }
      }
    } catch (roleErr) {
      console.warn('[userService] Could not resolve user role permissions.');
    }

    return {
      ...user,
      effectivePermissions: permissions,
    };
  },

  /**
   * Create a new staff user.
   */
  async createUser(userData) {
    return await apiClient.post('/users', userData);
  },

  /**
   * Update existing staff user details.
   */
  async updateUser(id, userData) {
    if (!id) throw new Error('User ID is required.');
    return await apiClient.put(`/users/${id}`, userData);
  },

  /**
   * Activate or deactivate staff user status.
   */
  async updateUserStatus(id, status) {
    if (!id) throw new Error('User ID is required.');
    return await apiClient.patch(`/users/${id}/status`, { status });
  },

  /**
   * Fetch sales teams.
   */
  async getSalesTeams() {
    return await apiClient.get('/sales-teams');
  },

  /**
   * Create sales team.
   */
  async createSalesTeam(teamData) {
    return await apiClient.post('/sales-teams', teamData);
  },

  /**
   * Update sales team.
   */
  async updateSalesTeam(id, teamData) {
    if (!id) throw new Error('Sales Team ID is required.');
    return await apiClient.put(`/sales-teams/${id}`, teamData);
  },

  /**
   * Delete sales team.
   */
  async deleteSalesTeam(id) {
    if (!id) throw new Error('Sales Team ID is required.');
    return await apiClient.delete(`/sales-teams/${id}`);
  },
};

export default userService;
