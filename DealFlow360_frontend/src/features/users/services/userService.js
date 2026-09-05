import { apiClient } from '../../../services/api/apiClient';
import { roleService } from '../../roles/services/roleService';

/**
 * Fallback preview store for standalone UI preview when backend API is offline.
 * Initialized with representative staff users (no credentials/passwords exposed).
 */
let mockUsers = [
  {
    id: 'usr_admin_01',
    firstName: 'System',
    lastName: 'Administrator',
    name: 'System Administrator',
    email: 'admin@dealflow360.com',
    roleId: 'role_admin',
    roleName: 'Administrator',
    roleCode: 'ROLE-ADMIN',
    department: 'IT & Security Governance',
    employeeCode: 'EMP-001',
    phone: '+1 (555) 019-2831',
    status: 'ACTIVE',
    lastLoginAt: new Date(Date.now() - 30 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 120 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'usr_mgr_01',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@dealflow360.com',
    roleId: 'role_sales_manager',
    roleName: 'Sales Manager',
    roleCode: 'ROLE-MGR',
    department: 'Enterprise Sales',
    employeeCode: 'EMP-014',
    phone: '+1 (555) 018-9922',
    status: 'ACTIVE',
    lastLoginAt: new Date(Date.now() - 120 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'usr_rep_01',
    firstName: 'Alex',
    lastName: 'Rivera',
    name: 'Alex Rivera',
    email: 'alex.rivera@dealflow360.com',
    roleId: 'role_salesperson',
    roleName: 'Salesperson',
    roleCode: 'ROLE-SLS',
    department: 'Commercial Direct Sales',
    employeeCode: 'EMP-042',
    phone: '+1 (555) 014-3310',
    status: 'ACTIVE',
    lastLoginAt: new Date(Date.now() - 360 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'usr_fin_01',
    firstName: 'David',
    lastName: 'Chen',
    name: 'David Chen',
    email: 'david.chen@dealflow360.com',
    roleId: 'role_finance_ops',
    roleName: 'Finance / Operations',
    roleCode: 'ROLE-FIN',
    department: 'Corporate Finance & Risk',
    employeeCode: 'EMP-009',
    phone: '+1 (555) 017-8844',
    status: 'ACTIVE',
    lastLoginAt: new Date(Date.now() - 1440 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'usr_rep_02',
    firstName: 'Elena',
    lastName: 'Rostova',
    name: 'Elena Rostova',
    email: 'elena.rostova@dealflow360.com',
    roleId: 'role_salesperson',
    roleName: 'Salesperson',
    roleCode: 'ROLE-SLS',
    department: 'Commercial Direct Sales',
    employeeCode: 'EMP-055',
    phone: '+1 (555) 016-2299',
    status: 'INACTIVE',
    lastLoginAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

/**
 * User API Service
 * Centralized service layer for Staff User management and governance.
 */
export const userService = {
  /**
   * Fetch paginated list of staff users with filtering.
   */
  async getUsers(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('limit', params.pageSize);
      if (params.search) queryParams.append('search', params.search);
      if (params.roleId) queryParams.append('roleId', params.roleId);
      if (params.status) queryParams.append('status', params.status);

      const queryString = queryParams.toString();
      const endpoint = `/users${queryString ? `?${queryString}` : ''}`;
      return await apiClient.get(endpoint);
    } catch (err) {
      console.warn('[userService] Backend API offline. Operating in preview mode.');
      return this.handleFallbackGetUsers(params);
    }
  },

  /**
   * Fetch single staff user by ID with effective permissions.
   */
  async getUserById(id) {
    if (!id) throw new Error('User ID is required.');
    try {
      return await apiClient.get(`/users/${id}`);
    } catch (err) {
      console.warn('[userService] Backend API offline. Operating in preview mode.');
      const user = mockUsers.find((u) => u.id === id);
      if (!user) {
        const error = new Error('Staff user record not found.');
        error.status = 404;
        throw error;
      }

      // Populate effective permissions from role service
      let permissions = [];
      try {
        const role = await roleService.getRoleById(user.roleId);
        if (role) {
          permissions = role.permissions || [];
        }
      } catch (roleErr) {
        console.warn('[userService] Could not resolve user role permissions.');
      }

      return {
        ...user,
        effectivePermissions: permissions,
      };
    }
  },

  /**
   * Create a new staff user.
   */
  async createUser(userData) {
    try {
      return await apiClient.post('/users', userData);
    } catch (err) {
      console.warn('[userService] Backend API offline. Creating in preview store.');

      const duplicateEmail = mockUsers.some(
        (u) => u.email.toLowerCase() === userData.email.trim().toLowerCase()
      );
      if (duplicateEmail) {
        const error = new Error('A staff user with this email address already exists.');
        error.status = 409;
        error.errors = { email: 'Email address must be unique across staff accounts.' };
        throw error;
      }

      let roleName = 'Staff Member';
      let roleCode = 'ROLE-STAFF';
      try {
        const role = await roleService.getRoleById(userData.roleId);
        if (role) {
          roleName = role.name;
          roleCode = role.code;
        }
      } catch (e) {
        /* fallback */
      }

      const firstName = userData.firstName.trim();
      const lastName = userData.lastName.trim();

      const newRecord = {
        id: `usr_${Date.now()}`,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        email: userData.email.trim().toLowerCase(),
        roleId: userData.roleId,
        roleName,
        roleCode,
        department: userData.department?.trim() || '',
        employeeCode: userData.employeeCode?.trim() || '',
        phone: userData.phone?.trim() || '',
        status: userData.status || 'ACTIVE',
        lastLoginAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockUsers.unshift(newRecord);
      return newRecord;
    }
  },

  /**
   * Update existing staff user details.
   */
  async updateUser(id, userData) {
    if (!id) throw new Error('User ID is required.');
    try {
      return await apiClient.put(`/users/${id}`, userData);
    } catch (err) {
      console.warn('[userService] Backend API offline. Updating in preview store.');
      const index = mockUsers.findIndex((u) => u.id === id);
      if (index === -1) {
        const error = new Error('Staff user record not found.');
        error.status = 404;
        throw error;
      }

      if (userData.email) {
        const duplicateEmail = mockUsers.some(
          (u) => u.id !== id && u.email.toLowerCase() === userData.email.trim().toLowerCase()
        );
        if (duplicateEmail) {
          const error = new Error('A staff user with this email address already exists.');
          error.status = 409;
          error.errors = { email: 'Email address must be unique.' };
          throw error;
        }
      }

      let roleName = mockUsers[index].roleName;
      let roleCode = mockUsers[index].roleCode;
      if (userData.roleId && userData.roleId !== mockUsers[index].roleId) {
        try {
          const role = await roleService.getRoleById(userData.roleId);
          if (role) {
            roleName = role.name;
            roleCode = role.code;
          }
        } catch (e) {
          /* fallback */
        }
      }

      const firstName = userData.firstName ? userData.firstName.trim() : mockUsers[index].firstName;
      const lastName = userData.lastName ? userData.lastName.trim() : mockUsers[index].lastName;

      const updatedRecord = {
        ...mockUsers[index],
        ...userData,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        roleName,
        roleCode,
        updatedAt: new Date().toISOString(),
      };

      mockUsers[index] = updatedRecord;
      return updatedRecord;
    }
  },

  /**
   * Activate or deactivate staff user status.
   */
  async updateUserStatus(id, status) {
    if (!id) throw new Error('User ID is required.');
    try {
      return await apiClient.request(`/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.warn('[userService] Backend API offline. Updating status in preview store.');
      const record = mockUsers.find((u) => u.id === id);
      if (!record) {
        const error = new Error('Staff user record not found.');
        error.status = 404;
        throw error;
      }

      // Self protection check for system admin user
      if (record.id === 'usr_admin_01' && status === 'INACTIVE') {
        const error = new Error('The primary System Administrator account cannot be deactivated.');
        error.status = 400;
        throw error;
      }

      record.status = status;
      record.updatedAt = new Date().toISOString();
      return record;
    }
  },

  handleFallbackGetUsers(params) {
    let filtered = [...mockUsers];

    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          (u.employeeCode && u.employeeCode.toLowerCase().includes(term)) ||
          (u.department && u.department.toLowerCase().includes(term))
      );
    }

    if (params.roleId && params.roleId !== 'ALL') {
      filtered = filtered.filter((u) => u.roleId === params.roleId);
    }

    if (params.status && params.status !== 'ALL') {
      filtered = filtered.filter((u) => u.status === params.status);
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

export default userService;
