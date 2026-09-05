import { apiClient } from '../../../services/api/apiClient';

/**
 * Customer Authentication API Service Layer
 * Interacts with backend API endpoints for B2B Customer Portal identity management.
 */
export const customerAuthService = {
  /**
   * Submit customer login credentials.
   */
  async login(email, password, rememberMe = false) {
    try {
      return await apiClient.post('/customer/auth/login', { email, password, rememberMe });
    } catch (err) {
      console.warn('[customerAuthService] Backend API offline. Delegating to AuthContext fallback.');
      throw err;
    }
  },

  /**
   * Submit customer account registration request.
   */
  async signup(signupData) {
    try {
      return await apiClient.post('/customer/auth/signup', signupData);
    } catch (err) {
      console.warn('[customerAuthService] Backend API offline. Delegating to AuthContext fallback.');
      throw err;
    }
  },

  /**
   * End current customer session.
   */
  async logout() {
    try {
      return await apiClient.post('/customer/auth/logout');
    } catch (err) {
      console.warn('[customerAuthService] Clearing local session.');
      return { success: true };
    }
  },

  /**
   * Request password reset token / link.
   */
  async requestPasswordReset(email) {
    try {
      return await apiClient.post('/customer/auth/forgot-password', { email });
    } catch (err) {
      console.warn('[customerAuthService] Privacy-safe offline confirmation.');
      return {
        message: 'If an account exists for this email, password reset instructions have been dispatched.',
      };
    }
  },

  /**
   * Reset customer account password using token.
   */
  async resetPassword(token, password) {
    try {
      return await apiClient.post('/customer/auth/reset-password', { token, password });
    } catch (err) {
      console.warn('[customerAuthService] Backend API offline.');
      throw err;
    }
  },

  /**
   * Fetch current authenticated customer session identity.
   */
  async getCurrentCustomer() {
    try {
      return await apiClient.get('/customer/auth/me');
    } catch (err) {
      console.warn('[customerAuthService] No active customer session found via API.');
      return null;
    }
  },
};

export default customerAuthService;
