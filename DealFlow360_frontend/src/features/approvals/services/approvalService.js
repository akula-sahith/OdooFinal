import { apiClient } from '../../../services/api/apiClient';

/**
 * Quotation Approval Workflow API Service
 * Manages Admin and Manager approval queues and decisions.
 */
export const approvalService = {
  /**
   * Fetch approval queue.
   */
  async getApprovalQueue(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.quotationId) queryParams.append('quotationId', params.quotationId);
    const queryString = queryParams.toString();
    const endpoint = `/approvals${queryString ? `?${queryString}` : ''}`;
    return await apiClient.get(endpoint);
  },

  /**
   * Fetch pending approval requests.
   */
  async getPendingApprovals() {
    return await apiClient.get('/approvals/pending');
  },

  /**
   * Approve a quotation record.
   */
  async approveQuotation(id, reason = '') {
    if (!id) throw new Error('Approval record ID is required.');
    return await apiClient.post(`/approvals/${id}/approve`, {
      decisionReason: reason || 'Approved via dashboard',
    });
  },

  /**
   * Reject a quotation record.
   */
  async rejectQuotation(id, reason = '') {
    if (!id) throw new Error('Approval record ID is required.');
    return await apiClient.post(`/approvals/${id}/reject`, {
      decisionReason: reason || 'Rejected via dashboard',
    });
  },
};

export default approvalService;

