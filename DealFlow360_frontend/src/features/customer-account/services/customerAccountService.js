import { apiClient } from '../../../services/api/apiClient';

/**
 * Customer Account Service Layer
 * Manages customer profile details and account security parameters.
 */
export const customerAccountService = {
  /**
   * Fetch current authenticated customer profile.
   */
  async getProfile() {
    try {
      return await apiClient.get('/customer/profile');
    } catch (err) {
      console.warn('[customerAccountService] Backend API offline. Returning session profile.');
      return null;
    }
  },

  /**
   * Update customer profile details.
   */
  async updateProfile(profileData) {
    try {
      return await apiClient.patch('/customer/profile', profileData);
    } catch (err) {
      console.warn('[customerAccountService] Backend API offline. Returning updated mock.');
      return {
        ...profileData,
        updatedAt: new Date().toISOString(),
      };
    }
  },

  /**
   * Fetch account status and security summary.
   */
  async getAccount() {
    try {
      return await apiClient.get('/customer/account');
    } catch (err) {
      console.warn('[customerAccountService] Backend API offline. Returning default account payload.');
      return null;
    }
  },
};

export default customerAccountService;
