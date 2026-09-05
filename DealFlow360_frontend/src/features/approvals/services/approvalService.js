import { apiClient } from '../../../services/api/apiClient';
import { quotationService } from '../../quotations/services/quotationService';
import { discountGovernanceService } from '../../quotations/services/discountGovernanceService';
import {
  validateRejectionReason,
  validateRevisionReason,
  validateSelfApproval,
  validateStateTransition,
} from '../validation/approvalValidation';

/**
 * Fallback preview audit history store.
 */
let mockApprovalHistory = {
  'QTN-2026-00001': [
    {
      id: 'aph_01',
      quotationId: 'QTN-2026-00001',
      actorId: 'SP-014',
      actorName: 'Sarah Jenkins',
      actorRole: 'Salesperson',
      action: 'SUBMIT',
      fromStatus: 'DRAFT',
      toStatus: 'PENDING_MANAGER_APPROVAL',
      comment: 'Commercial proposal submitted for 8% discount approval.',
      timestamp: '2026-09-05T12:30:00.000Z',
    },
  ],
};

/**
 * Quotation Approval Workflow API Service
 */
export const approvalService = {
  /**
   * Fetch paginated approval queue for the authenticated user based on role permissions.
   */
  async getApprovalQueue(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('limit', params.pageSize);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.approvalLevel) queryParams.append('approval_level', params.approvalLevel);
      if (params.riskLevel) queryParams.append('risk_level', params.riskLevel);

      const queryString = queryParams.toString();
      const endpoint = `/company/approvals${queryString ? `?${queryString}` : ''}`;
      return await apiClient.get(endpoint);
    } catch (err) {
      console.warn('[approvalService] Backend API offline. Filtering preview approval queue.');
      return this.handleFallbackGetApprovalQueue(params);
    }
  },

  /**
   * Fetch approval details and commercial snapshot for a quotation.
   */
  async getApprovalDetails(quotationId) {
    if (!quotationId) throw new Error('Quotation ID is required.');
    try {
      return await apiClient.get(`/company/approvals/${quotationId}`);
    } catch (err) {
      console.warn('[approvalService] Backend API offline. Fetching quotation details.');
      const quotation = await quotationService.getQuotationById(quotationId);
      const history = mockApprovalHistory[quotationId] || mockApprovalHistory['QTN-2026-00001'] || [];
      return {
        quotation,
        history,
      };
    }
  },

  /**
   * Fetch append-only audit history for a quotation.
   */
  async getApprovalHistory(quotationId) {
    if (!quotationId) throw new Error('Quotation ID is required.');
    try {
      return await apiClient.get(`/company/approvals/${quotationId}/history`);
    } catch (err) {
      return mockApprovalHistory[quotationId] || mockApprovalHistory['QTN-2026-00001'] || [];
    }
  },

  /**
   * Submit a DRAFT quotation for commercial approval.
   */
  async submitForApproval(quotationId, userContext = {}) {
    if (!quotationId) throw new Error('Quotation ID is required.');

    try {
      return await apiClient.post(`/company/approvals/${quotationId}/submit`, {});
    } catch (err) {
      console.warn('[approvalService] Backend API offline. Submitting quotation draft in preview store.');
      const quotation = await quotationService.getQuotationById(quotationId);

      const transitionCheck = validateStateTransition(quotation.status, 'SUBMIT');
      if (!transitionCheck.valid) throw new Error(transitionCheck.error);

      // Re-evaluate discount governance
      const governance = await discountGovernanceService.evaluateDiscount({
        requestedDiscountPercentage: quotation.discountPercentage || 0,
        subtotal: quotation.subtotal || 0,
        userId: userContext.id || quotation.salespersonId,
        userRole: 'Salesperson',
      });

      let targetStatus = 'APPROVED';
      if (governance.approvalRequired) {
        targetStatus = governance.approvalLevel === 'FINANCE' ? 'PENDING_FINANCE_APPROVAL' : 'PENDING_MANAGER_APPROVAL';
      }

      const updated = await quotationService.updateQuotation(quotationId, {
        status: targetStatus,
        discountStatus: governance.governanceDecision,
        approvalRequired: governance.approvalRequired,
        approvalLevel: governance.approvalLevel,
        riskLevel: governance.riskLevel,
      });

      // Log audit event
      const historyEntry = {
        id: `aph_${Date.now()}`,
        quotationId,
        actorId: userContext.id || quotation.salespersonId || 'SP-014',
        actorName: userContext.fullName || quotation.salespersonName || 'Sarah Jenkins',
        actorRole: 'Salesperson',
        action: 'SUBMIT',
        fromStatus: quotation.status,
        toStatus: targetStatus,
        comment: `Submitted for commercial approval (${quotation.discountPercentage}% discount requested).`,
        timestamp: new Date().toISOString(),
      };

      if (!mockApprovalHistory[quotationId]) mockApprovalHistory[quotationId] = [];
      mockApprovalHistory[quotationId].push(historyEntry);

      return updated;
    }
  },

  /**
   * Sales Manager / Finance Approval action.
   */
  async approveQuotation(quotationId, comment = '', userContext = {}) {
    if (!quotationId) throw new Error('Quotation ID is required.');

    try {
      return await apiClient.post(`/company/approvals/${quotationId}/approve`, { comment });
    } catch (err) {
      console.warn('[approvalService] Backend API offline. Approving in preview store.');
      const quotation = await quotationService.getQuotationById(quotationId);

      // Concurrency check simulation
      if (quotation.status === 'APPROVED' || quotation.status === 'REJECTED') {
        const conflictErr = new Error('This quotation has already been processed or updated by another user.');
        conflictErr.status = 409;
        throw conflictErr;
      }

      // Self-approval check
      const selfCheck = validateSelfApproval(quotation.salespersonId, userContext.id || 'MGR-007');
      if (!selfCheck.valid && userContext.role !== 'Sales Manager' && userContext.role !== 'Finance') {
        throw new Error(selfCheck.error);
      }

      const transitionCheck = validateStateTransition(quotation.status, 'APPROVE');
      if (!transitionCheck.valid) throw new Error(transitionCheck.error);

      // If Manager approves but discount requires Finance escalation
      let targetStatus = 'APPROVED';
      if (quotation.status === 'PENDING_MANAGER_APPROVAL' && quotation.riskLevel === 'HIGH') {
        targetStatus = 'PENDING_FINANCE_APPROVAL';
      }

      const updated = await quotationService.updateQuotation(quotationId, {
        status: targetStatus,
        discountStatus: targetStatus === 'APPROVED' ? 'APPROVED' : 'PENDING_FINANCE_APPROVAL',
      });

      const historyEntry = {
        id: `aph_${Date.now()}`,
        quotationId,
        actorId: userContext.id || 'MGR-007',
        actorName: userContext.fullName || 'Marcus Vance',
        actorRole: userContext.role || 'Sales Manager',
        action: 'APPROVE',
        fromStatus: quotation.status,
        toStatus: targetStatus,
        comment: comment.trim() || 'Approved commercial proposal.',
        timestamp: new Date().toISOString(),
      };

      if (!mockApprovalHistory[quotationId]) mockApprovalHistory[quotationId] = [];
      mockApprovalHistory[quotationId].push(historyEntry);

      return updated;
    }
  },

  /**
   * Reject quotation action (Requires non-empty reason).
   */
  async rejectQuotation(quotationId, reason = '', userContext = {}) {
    if (!quotationId) throw new Error('Quotation ID is required.');
    const reasonCheck = validateRejectionReason(reason);
    if (!reasonCheck.valid) throw new Error(reasonCheck.error);

    try {
      return await apiClient.post(`/company/approvals/${quotationId}/reject`, { reason });
    } catch (err) {
      console.warn('[approvalService] Backend API offline. Rejecting in preview store.');
      const quotation = await quotationService.getQuotationById(quotationId);

      if (quotation.status === 'APPROVED' || quotation.status === 'REJECTED') {
        const conflictErr = new Error('This quotation has already been processed.');
        conflictErr.status = 409;
        throw conflictErr;
      }

      const transitionCheck = validateStateTransition(quotation.status, 'REJECT');
      if (!transitionCheck.valid) throw new Error(transitionCheck.error);

      const updated = await quotationService.updateQuotation(quotationId, {
        status: 'REJECTED',
        discountStatus: 'REJECTED',
      });

      const historyEntry = {
        id: `aph_${Date.now()}`,
        quotationId,
        actorId: userContext.id || 'MGR-007',
        actorName: userContext.fullName || 'Marcus Vance',
        actorRole: userContext.role || 'Sales Manager',
        action: 'REJECT',
        fromStatus: quotation.status,
        toStatus: 'REJECTED',
        comment: reason.trim(),
        timestamp: new Date().toISOString(),
      };

      if (!mockApprovalHistory[quotationId]) mockApprovalHistory[quotationId] = [];
      mockApprovalHistory[quotationId].push(historyEntry);

      return updated;
    }
  },

  /**
   * Request Revision action (Requires non-empty instructions).
   */
  async requestRevision(quotationId, reason = '', userContext = {}) {
    if (!quotationId) throw new Error('Quotation ID is required.');
    const reasonCheck = validateRevisionReason(reason);
    if (!reasonCheck.valid) throw new Error(reasonCheck.error);

    try {
      return await apiClient.post(`/company/approvals/${quotationId}/request-revision`, { reason });
    } catch (err) {
      console.warn('[approvalService] Backend API offline. Requesting revision in preview store.');
      const quotation = await quotationService.getQuotationById(quotationId);

      if (quotation.status === 'APPROVED' || quotation.status === 'REJECTED') {
        const conflictErr = new Error('This quotation has already been processed.');
        conflictErr.status = 409;
        throw conflictErr;
      }

      const transitionCheck = validateStateTransition(quotation.status, 'REQUEST_REVISION');
      if (!transitionCheck.valid) throw new Error(transitionCheck.error);

      const updated = await quotationService.updateQuotation(quotationId, {
        status: 'REVISION_REQUESTED',
        discountStatus: 'REVISION_REQUESTED',
      });

      const historyEntry = {
        id: `aph_${Date.now()}`,
        quotationId,
        actorId: userContext.id || 'MGR-007',
        actorName: userContext.fullName || 'Marcus Vance',
        actorRole: userContext.role || 'Sales Manager',
        action: 'REQUEST_REVISION',
        fromStatus: quotation.status,
        toStatus: 'REVISION_REQUESTED',
        comment: reason.trim(),
        timestamp: new Date().toISOString(),
      };

      if (!mockApprovalHistory[quotationId]) mockApprovalHistory[quotationId] = [];
      mockApprovalHistory[quotationId].push(historyEntry);

      return updated;
    }
  },

  /**
   * Helper for fallback approval queue filtering & pagination.
   */
  async handleFallbackGetApprovalQueue(params) {
    const res = await quotationService.getQuotations({ pageSize: 100 });
    let list = res.data || [];

    // Filter quotations awaiting approval
    list = list.filter(
      (q) =>
        q.status === 'PENDING_MANAGER_APPROVAL' ||
        q.status === 'PENDING_FINANCE_APPROVAL' ||
        q.status === 'REVISION_REQUESTED' ||
        q.status === 'APPROVED' ||
        q.status === 'REJECTED'
    );

    if (params.approvalLevel && params.approvalLevel !== 'ALL') {
      list = list.filter((q) => q.approvalLevel === params.approvalLevel || q.status.includes(params.approvalLevel));
    }

    if (params.status && params.status !== 'ALL') {
      list = list.filter((q) => q.status === params.status);
    }

    if (params.riskLevel && params.riskLevel !== 'ALL') {
      list = list.filter((q) => q.riskLevel === params.riskLevel);
    }

    if (params.search) {
      const term = params.search.toLowerCase();
      list = list.filter(
        (q) =>
          q.quotationNumber.toLowerCase().includes(term) ||
          q.companyName.toLowerCase().includes(term) ||
          q.salespersonName.toLowerCase().includes(term) ||
          q.requestId.toLowerCase().includes(term)
      );
    }

    const page = parseInt(params.page || 1, 10);
    const limit = parseInt(params.pageSize || 10, 10);
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      meta: {
        total: list.length,
        page,
        limit,
        totalPages: Math.ceil(list.length / limit) || 1,
      },
    };
  },
};

export default approvalService;
