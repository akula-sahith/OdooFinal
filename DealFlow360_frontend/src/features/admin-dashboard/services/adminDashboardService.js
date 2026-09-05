import { apiClient } from '../../../services/api/apiClient';

const mockDashboardData = {
  summary: {
    totalProducts: 14,
    activePriceLists: 2,
    totalCategories: 3,
    totalQuotations: 12,
    activeCustomers: 8,
    systemStatus: 'OPERATIONAL',
  },
  governanceMetrics: {
    discountComplianceRate: 98.4,
    pendingApprovalRequests: 3,
    activeRiskAlerts: 0,
    policyEnforcement: 'STRICT',
  },
  recentActivities: [
    {
      id: 'act_1',
      title: 'Price List "Standard Global Price List 2026" Updated',
      actor: 'Admin Personnel',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'act_2',
      title: 'Product "Enterprise Rack Server X500" Base Price Added',
      actor: 'Catalog Admin',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
    },
    {
      id: 'act_3',
      title: 'Category "Software Licenses" Status Changed to Active',
      actor: 'Admin Personnel',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
};

/**
 * Admin Governance & Configuration API Service
 * Handles platform configuration health, governance rules, and platform analytics.
 */
export const adminDashboardService = {
  /**
   * Fetch platform configuration metrics and analytics
   */
  async getAdminDashboard(timeRange = '30d', teamId = 'all', category = 'all') {
    try {
      const response = await apiClient.get(
        `/v1/admin/dashboard?timeRange=${timeRange}&teamId=${teamId}&category=${category}`
      );
      return response.data;
    } catch (error) {
      console.warn('[adminDashboardService] Backend endpoint offline. Returning preview analytics.');
      return mockDashboardData;
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
      console.warn(`[adminDashboardService] Section ${sectionName} offline. Returning section preview.`);
      return mockDashboardData[sectionName] || mockDashboardData.summary;
    }
  },
};

export default adminDashboardService;
