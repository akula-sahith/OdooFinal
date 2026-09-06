import { apiClient } from '../../../services/api/apiClient';

/**
 * Approval Chain API Service
 * Manages Admin configuration of discount escalation threshold levels and approval sequence rules.
 */
export const approvalChainService = {
  /**
   * Fetch current company approval chain sequence.
   */
  async getApprovalChain() {
    return await apiClient.get('/approval-rules');
  },

  /**
   * Create an approval chain rule.
   */
  async createApprovalRule(ruleData) {
    return await apiClient.post('/approval-rules', ruleData);
  },

  /**
   * Update full company approval chain sequence.
   */
  async updateApprovalChain(chainData) {
    return await apiClient.put('/approval-rules', { levels: chainData });
  },

  /**
   * Delete an approval rule.
   */
  async deleteApprovalRule(id) {
    if (!id) throw new Error('Rule ID is required.');
    return await apiClient.delete(`/approval-rules/${id}`);
  },
};

export default approvalChainService;

