import { ENV } from '../../app/config/env';


/**
 * DealFlow360 Centralized Authentication API Service
 * 
 * FRONTEND SECURITY PRINCIPLE:
 * The frontend is security-ready and enforces secure frontend practices.
 * Actual authentication, authorization, rate limiting, password hashing, session validation,
 * MFA verification, suspicious-login detection, and security policy enforcement are handled by the backend.
 * 
 * CENTRALIZED API CONTRACTS:
 * - POST /auth/login
 * - POST /auth/logout
 * - GET  /auth/me
 * - POST /auth/customer/signup
 * - POST /auth/verify-email
 * - POST /auth/resend-verification
 * - POST /auth/forgot-password
 * - POST /auth/reset-password
 * - POST /auth/mfa/verify
 * - GET  /auth/invitation/:token
 * - POST /auth/invitation/accept
 */

class AuthService {
  constructor() {
    this.baseUrl = ENV.API_BASE_URL;
  }

  // Base HTTP Request Wrapper with HttpOnly Cookie credentials support
  async request(endpoint, options = {}) {
    let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    if (!cleanEndpoint.startsWith('/api') && !cleanEndpoint.startsWith('/actuator')) {
      cleanEndpoint = `/api${cleanEndpoint}`;
    }
    const url = `${this.baseUrl}${cleanEndpoint}`;
    const token = localStorage.getItem('dealflow360_auth_token');
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      let data = {};
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json().catch(() => ({}));
      } else {
        const text = await response.text().catch(() => '');
        data = { message: text || response.statusText };
      }

      if (!response.ok) {
        const fallbackMsg = response.status === 409
          ? 'An account with this email address already exists. Please sign in instead.'
          : 'Authentication request failed';
        const error = new Error(data.message || fallbackMsg);
        error.code = data.code || this.mapStatusToErrorCode(response.status);
        error.status = response.status;
        error.details = data.details;
        throw error;
      }

      if (data && data.token) {
        try {
          localStorage.setItem('dealflow360_auth_token', data.token);
        } catch (e) {
          /* ignore */
        }
      }

      return data;
    } catch (err) {
      if (err.code || err.status) throw err;
      const networkErr = new Error('Backend service offline or unreachable. Please check server connection.');
      networkErr.code = 'SERVER_UNAVAILABLE';
      throw networkErr;
    }
  }

  mapStatusToErrorCode(status) {
    switch (status) {
      case 401: return 'INVALID_CREDENTIALS';
      case 403: return 'UNAUTHORIZED';
      case 409: return 'USER_ALREADY_EXISTS';
      case 422: return 'VALIDATION_ERROR';
      case 429: return 'TOO_MANY_ATTEMPTS';
      default: return 'SERVER_UNAVAILABLE';
    }
  }

  // Fallback for standalone frontend preview before live backend deployment
  async handleIntegrationFallback(endpoint, options) {
    await new Promise((res) => setTimeout(res, 600));

    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : {};

    if (endpoint === '/auth/login') {
      const { email, password } = body;
      if (!email || !password) {
        const err = new Error('Please enter a valid email and password.');
        err.code = 'INVALID_CREDENTIALS';
        throw err;
      }

      const lowerEmail = email.toLowerCase().trim();

      let role = 'Customer';
      let portal = 'customer';
      let name = email.split('@')[0].replace('.', ' ');
      let companyName = 'Acme Enterprises';
      let department = undefined;
      let employeeId = undefined;

      if (lowerEmail.includes('admin') || lowerEmail === 'admin@dealflow360.com') {
        role = 'Admin';
        portal = 'company';
        name = 'System Administrator';
        companyName = 'DealFlow360 Internal';
        department = 'Executive Administration';
        employeeId = 'DF360-ADM-001';
      } else if (lowerEmail.includes('manager') || lowerEmail === 'manager@dealflow360.com') {
        role = 'Sales Manager';
        portal = 'company';
        name = 'Sales Manager';
        companyName = 'DealFlow360 Internal';
        department = 'Commercial Sales Management';
        employeeId = 'DF360-MGR-102';
      } else if (lowerEmail.includes('sales') || lowerEmail === 'sales@dealflow360.com' || lowerEmail === 'rahul@dealflow360.com') {
        role = 'Salesperson';
        portal = 'company';
        name = 'Sales Representative';
        companyName = 'DealFlow360 Internal';
        department = 'Commercial Sales';
        employeeId = 'DF360-REP-204';
      }

      return {
        user: {
          id: `usr_${Date.now()}`,
          email: lowerEmail,
          name,
          fullName: name,
          portal,
          status: 'ACTIVE',
          role,
          companyName,
          department,
          employeeId,
        },
        requiresMfa: false,
        token: 'session_token_ready',
      };
    }

    if (endpoint === '/auth/customer/signup') {
      const { email, fullName, companyName } = body;
      return {
        user: {
          id: `usr_cust_${Date.now()}`,
          email: (email || 'customer@client.com').toLowerCase().trim(),
          name: fullName || 'Valued Customer',
          fullName: fullName || 'Valued Customer',
          portal: 'customer',
          status: 'ACTIVE',
          role: 'Customer',
          companyName: companyName || 'Client Company',
        },
        token: 'session_token_customer_signup',
      };
    }

    if (endpoint === '/auth/forgot-password') {
      // Neutral security response to prevent user enumeration
      return {
        success: true,
        message: "If an account exists for this email, you'll receive instructions to reset your password.",
      };
    }

    if (endpoint.startsWith('/auth/invitation/')) {
      const token = endpoint.split('/')[3];
      return {
        token,
        fullName: 'Rahul Kumar',
        workEmail: 'rahul@dealflow360.com',
        assignedRole: 'Salesperson',
        companyName: 'DealFlow360 Internal',
        isValid: !token.includes('invalid') && !token.includes('expired'),
        isExpired: token.includes('expired'),
        isUsed: token.includes('used'),
      };
    }

    if (endpoint === '/auth/invitation/accept') {
      return {
        user: {
          id: 'usr_invited_1',
          email: 'rahul@dealflow360.com',
          name: 'Rahul Kumar',
          portal: 'company',
          status: 'ACTIVE',
          role: 'Salesperson',
          companyName: 'DealFlow360 Internal',
        },
        token: 'session_token_invite',
      };
    }

    if (endpoint === '/auth/mfa/verify') {
      if (body.code !== '123456' && body.code !== '000000') {
        const err = new Error('Invalid authentication code. Please check your authenticator app.');
        err.code = 'INVALID_CREDENTIALS';
        throw err;
      }
      return {
        user: {
          id: 'usr_mfa_verified',
          email: 'user@dealflow360.com',
          name: 'Verified User',
          portal: body.portal,
          status: 'ACTIVE',
        },
        token: 'session_token_mfa',
      };
    }

    return { success: true };
  }

  // 1. POST /auth/login
  async login(email, password, portal) {
    return await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, portal }),
    });
  }

  // 2. POST /auth/logout
  async logout() {
    try {
      localStorage.removeItem('dealflow360_auth_token');
      localStorage.removeItem('dealflow360_user');
    } catch (e) {}
    try {
      return await this.request('/auth/logout', { method: 'POST' });
    } catch (e) {
      return { success: true };
    }
  }

  // 3. GET /auth/me
  async getCurrentUser() {
    const token = localStorage.getItem('dealflow360_auth_token');
    if (!token) return null;
    try {
      const res = await this.request('/auth/me');
      if (!res) return null;
      return res.user ? res : { user: res };
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        try {
          localStorage.removeItem('dealflow360_auth_token');
        } catch (e) {}
      }
      return null;
    }
  }

  // 4. POST /auth/customer/signup
  async signupCustomer(signupData) {
    return await this.request('/auth/customer/signup', {
      method: 'POST',
      body: JSON.stringify(signupData),
    });
  }

  // 5. POST /auth/verify-email
  async verifyEmail(token) {
    return await this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // 6. POST /auth/resend-verification
  async resendVerification(email) {
    return await this.request('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // 7. POST /auth/forgot-password (STRICT NEUTRAL SECURITY RESPONSE)
  async forgotPassword(email, portal) {
    return await this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email, portal }),
    });
  }

  // 8. POST /auth/reset-password
  async resetPassword(token, newPassword, portal) {
    return await this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword, portal }),
    });
  }

  // 9. POST /auth/mfa/verify
  async verifyMFA(mfaToken, code, portal) {
    return await this.request('/auth/mfa/verify', {
      method: 'POST',
      body: JSON.stringify({ mfaToken, code, portal }),
    });
  }

  // 10. GET /auth/invitation/:token
  async getInvitationDetails(token) {
    return await this.request(`/auth/invitation/${token}`);
  }

  // 11. POST /auth/invitation/accept
  async acceptInvitation(token, password) {
    return await this.request('/auth/invitation/accept', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }
}

export const authService = new AuthService();
