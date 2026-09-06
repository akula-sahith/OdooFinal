const API_BASE_URL = 'http://localhost:8084';

export const getAuthToken = () => {
  return localStorage.getItem('dealflow_token') || '';
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('dealflow_token', token);
  } else {
    localStorage.removeItem('dealflow_token');
  }
};

export const getStoredUser = () => {
  const user = localStorage.getItem('dealflow_user');
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem('dealflow_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('dealflow_user');
  }
};

export const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Unauthorized token expiration handling if needed
    }

    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = typeof data === 'object' && data.message ? data.message : (typeof data === 'string' && data ? data : `API Request failed with status ${response.status}`);
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'}] ${url}:`, error);
    throw error;
  }
};
