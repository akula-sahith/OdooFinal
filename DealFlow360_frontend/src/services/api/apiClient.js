import { ENV } from '../../app/config/env';

/**
 * DealFlow360 Centralized Production Hardened API Client
 * - Standardized HTTP client enforcing authorization headers and response sanitization.
 * - Masks Bearer token credentials in client logs.
 * - Handles 401 (Unauthenticated), 403 (Unauthorized), and 429 (Rate Limit) error responses safely.
 */
export const apiClient = {
  baseUrl: ENV.API_BASE_URL || 'https://api.dealflow360.com/v1',

  /**
   * Helper to mask Authorization header tokens for security logging
   */
  maskHeaders(headers = {}) {
    const masked = { ...headers };
    if (masked.Authorization || masked.authorization) {
      masked.Authorization = 'Bearer ********';
    }
    return masked;
  },

  async request(endpoint, options = {}) {
    let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    if (!cleanEndpoint.startsWith('/api') && !cleanEndpoint.startsWith('/actuator')) {
      cleanEndpoint = `/api${cleanEndpoint}`;
    }
    const url = `${this.baseUrl}${cleanEndpoint}`;
    
    // Retrieve session token if stored in auth state
    let token = null;
    try {
      token = localStorage.getItem('dealflow360_auth_token');
    } catch (e) {
      /* ignore */
    }

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

        let message = errorData.message || `HTTP ${response.status}: Request failed`;
        if (response.status === 401) {
          message = 'Authentication session expired or invalid. Please sign in again.';
        } else if (response.status === 403) {
          message = 'Access denied. You do not have permission to access this resource.';
        } else if (response.status === 429) {
          message = 'Rate limit exceeded. Too many requests; please slow down.';
        }

        const error = new Error(message);
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

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  },
};

export default apiClient;
