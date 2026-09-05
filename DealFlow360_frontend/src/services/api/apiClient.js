import { ENV } from '../../app/config/env';

/**
 * DealFlow360 Centralized API Client
 * Standardized HTTP client for all API interactions across DealFlow360 modules.
 */
export const apiClient = {
  baseUrl: ENV.API_BASE_URL || 'https://api.dealflow360.com/v1',

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
      credentials: options.credentials || 'include',
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch {
          // Ignore json parse error
        }
        const error = new Error(errorData.message || `HTTP ${response.status}: Request failed`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      return await response.json();
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Backend service offline or unreachable.');
      }
      throw err;
    }
  },

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  },
};

export default apiClient;
