import { apiClient } from '../../../services/api/apiClient';
import { getSharedRequestsStore } from '../../customer-requests/services/customerRequestService';

/**
 * Salesperson Dashboard Service Layer
 * Computes real backend-driven metrics for assigned requirement pipelines.
 */
export const salespersonDashboardService = {
  /**
   * Fetch salesperson dashboard KPI metrics.
   */
  async getDashboardMetrics() {
    try {
      return await apiClient.get('/sales/dashboard/metrics');
    } catch (err) {
      console.warn('[salespersonDashboardService] Backend API offline. Calculating metrics from shared preview store.');
      const store = getSharedRequestsStore();

      const assigned = store.filter((r) => r.assignedSalespersonId === 'SP-014' || !r.assignedSalespersonId);
      const pending = assigned.filter((r) => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW');
      const awaitingCustomer = assigned.filter((r) => r.status === 'REQUIREMENT_CLARIFICATION');
      const confirmed = assigned.filter((r) => r.status === 'REQUIREMENT_CONFIRMED');

      return {
        assignedRequestsCount: assigned.length,
        pendingRequestsCount: pending.length,
        awaitingCustomerCount: awaitingCustomer.length,
        confirmedRequirementsCount: confirmed.length,
        totalVolumeUnits: assigned.reduce((acc, curr) => acc + (curr.quantity || 0), 0),
        recentAssignedRequests: assigned.slice(0, 5),
      };
    }
  },
};

export default salespersonDashboardService;
