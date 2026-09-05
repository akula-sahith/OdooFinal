import { apiClient } from '../../../services/api/apiClient';
import { APPROVAL_CHAIN_DEFAULT_LEVELS } from '../types/approvalChainTypes';

let mockApprovalChainStore = [...APPROVAL_CHAIN_DEFAULT_LEVELS];

/**
 * Approval Chain API Service
 * Manages Admin configuration of discount escalation threshold levels and approval sequence rules.
 */
export const approvalChainService = {
  /**
   * Fetch current company approval chain sequence.
   */
  async getApprovalChain() {
    try {
      return await apiClient.get('/approval-chain');
    } catch (err) {
      console.warn('[approvalChainService] Backend API offline. Operating in preview mode.');
      return {
        data: [...mockApprovalChainStore],
        updatedAt: new Date().toISOString(),
      };
    }
  },

  /**
   * Update full company approval chain sequence.
   */
  async updateApprovalChain(chainData) {
    try {
      return await apiClient.put('/approval-chain', { levels: chainData });
    } catch (err) {
      console.warn('[approvalChainService] Backend API offline. Updating approval chain in preview store.');
      mockApprovalChainStore = Array.isArray(chainData) ? [...chainData] : [...(chainData?.levels || [])];
      return {
        data: [...mockApprovalChainStore],
        updatedAt: new Date().toISOString(),
        message: 'Approval chain governance sequence updated successfully.',
      };
    }
  },
};

export default approvalChainService;
