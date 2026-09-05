import { apiClient } from '../../../services/api/apiClient';

/**
 * Admin Governance & Configuration API Service
 * Handles platform configuration health, governance rules, and platform analytics.
 */
export const adminDashboardService = {
  /**
   * Fetch platform configuration metrics and analytics
   * @param {'7d'|'30d'|'90d'} timeRange
   * @param {string} [teamId]
   * @param {string} [category]
   */
  async getAdminDashboard(timeRange = '30d', teamId = 'all', category = 'all') {
    try {
      const response = await apiClient.get(
        `/v1/admin/dashboard?timeRange=${timeRange}&teamId=${teamId}&category=${category}`
      );
      return response.data;
    } catch (error) {
      console.warn('[adminDashboardService] Backend endpoint /v1/admin/dashboard offline or pending:', error.message);
      throw error;
    }
  },

  /**
   * Refresh specific section data
   */
  async getSectionData(sectionName, timeRange = '30d') {
    try {
      const response = await apiClient.get(`/v1/admin/dashboard/${sectionName}?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      console.warn(`[adminDashboardService] Section ${sectionName} error:`, error.message);
      throw error;
    }
  },
};

export default adminDashboardService;
