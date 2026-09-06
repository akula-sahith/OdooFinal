import { apiFetch } from './client';

export const approvalApi = {
  getAllApprovalRules: async () => {
    const res = await apiFetch('/api/approval-rules');
    return Array.isArray(res) ? res : (res.data || []);
  },

  createApprovalRule: async (ruleData) => {
    return await apiFetch('/api/approval-rules', {
      method: 'POST',
      body: JSON.stringify(ruleData),
    });
  },

  getAllApprovals: async (status = null, quotationId = null) => {
    let url = '/api/approvals';
    const params = [];
    if (status) params.push(`status=${status}`);
    if (quotationId) params.push(`quotationId=${quotationId}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return await apiFetch(url);
  },

  getPendingApprovals: async () => {
    return await apiFetch('/api/approvals/pending');
  },

  approveRecord: async (approvalId, approverId = 1, decisionReason = 'Approved via DealFlow360 Web UI') => {
    return await apiFetch(`/api/approvals/${approvalId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approverId, decisionReason }),
    });
  },

  rejectRecord: async (approvalId, approverId = 1, decisionReason = 'Rejected via DealFlow360 Web UI') => {
    return await apiFetch(`/api/approvals/${approvalId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ approverId, decisionReason }),
    });
  },

  getAllDiscountTiers: async () => {
    const res = await apiFetch('/api/discount-tiers');
    return Array.isArray(res) ? res : (res.data || []);
  },

  createDiscountTier: async (tierData) => {
    return await apiFetch('/api/discount-tiers', {
      method: 'POST',
      body: JSON.stringify(tierData),
    });
  },
};
