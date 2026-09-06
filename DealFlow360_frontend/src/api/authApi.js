import { apiFetch, setAuthToken, setStoredUser } from './client';

export const authApi = {
  login: async (email, password) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      setAuthToken(data.token);
    }
    if (data.user) {
      setStoredUser(data.user);
    }
    return data;
  },

  register: async (name, email, password, role = 'SALES_REP', teamId = 1) => {
    return await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role, teamId }),
    });
  },

  customerSignup: async (signupData) => {
    const data = await apiFetch('/api/auth/customer/signup', {
      method: 'POST',
      body: JSON.stringify(signupData),
    });
    if (data.token) {
      setAuthToken(data.token);
    }
    if (data.user) {
      setStoredUser(data.user);
    }
    return data;
  },

  getCurrentUser: async () => {
    return await apiFetch('/api/auth/me');
  },

  logout: async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore logout backend errors
    } finally {
      setAuthToken(null);
      setStoredUser(null);
    }
  },
};
