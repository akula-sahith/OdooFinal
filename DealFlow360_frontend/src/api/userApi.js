import { apiFetch } from './client';

export const userApi = {
  getAllUsers: async (search = '', roleId = '') => {
    let query = '';
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (roleId) params.append('roleId', roleId);
    if (params.toString()) query = `?${params.toString()}`;

    const res = await apiFetch(`/api/users${query}`);
    return res && res.data ? res.data : (Array.isArray(res) ? res : []);
  },

  getUserById: async (id) => {
    return await apiFetch(`/api/users/${id}`);
  },

  createUser: async (userData) => {
    return await apiFetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  updateUser: async (id, userData) => {
    return await apiFetch(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (id) => {
    return await apiFetch(`/api/users/${id}`, {
      method: 'DELETE',
    });
  },
};
