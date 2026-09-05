import { apiClient } from '../../../services/api/apiClient';
import { discountTierService } from '../../discount-tiers/services/discountTierService';
import { calculateLineDiscountAmount, roundMoney } from '../utils/quotationCalculations';
import { DISCOUNT_GOVERNANCE_STATUS, DISCOUNT_RISK_LEVELS } from '../types/quotationTypes';

/**
 * Discount Governance Service
 * Evaluates commercial discount requests against configured Discount Tier rules,
 * detecting authority limits, approval requirements, risk levels, and audit logs.
 */
export const discountGovernanceService = {
  /**
   * Retrieves the maximum authorized discount percentage for a staff user's role.
   */
  async getApplicableDiscountTier(userRole = 'Salesperson') {
    try {
      const res = await discountTierService.getDiscountTiers({ status: 'ACTIVE' });
      const tiers = Array.isArray(res) ? res : res.data || [];

      if (!tiers.length) {
        throw new Error('No active Discount Tier configuration found in governance system.');
      }

      // Find highest tier directly assigned to this role
      const userTier = tiers.find(
        (t) => t.approvalRole?.toLowerCase() === userRole.toLowerCase() || t.approvalLevel === 0
      );

      return userTier || tiers[0];
    } catch (err) {
      console.warn('[discountGovernanceService] Offline or fallback governance evaluation.');
      return {
        id: 'dt_01',
        name: 'Salesperson Standard Tier',
        code: 'DT-SLS-01',
        maximumDiscount: 5.0,
        approvalRole: 'Salesperson',
        approvalLevel: 0,
      };
    }
  },

  /**
   * Evaluates a discount request against configured Discount Tier governance rules.
   */
  async evaluateDiscount({
    requestedDiscountPercentage = 0,
    subtotal = 0,
    userId = 'SP-014',
    userRole = 'Salesperson',
    quotationId = null,
  }) {
    const pct = Number(requestedDiscountPercentage || 0);

    if (isNaN(pct) || pct < 0 || !isFinite(pct)) {
      throw new Error('Discount percentage must be a valid non-negative number.');
    }

    try {
      // Attempt backend endpoint
      const response = await apiClient.post('/company/quotations/evaluate-discount', {
        requestedDiscountPercentage: pct,
        subtotal,
        userId,
        userRole,
        quotationId,
      });
      return response;
    } catch (err) {
      console.warn('[discountGovernanceService] Backend API offline. Evaluating against active Discount Tier configuration.');
      return this.handleFallbackDiscountEvaluation(pct, subtotal, userRole, userId);
    }
  },

  /**
   * Fallback rule engine using active Discount Tier records.
   */
  async handleFallbackDiscountEvaluation(requestedPct, subtotal, userRole, userId) {
    const discountAmount = calculateLineDiscountAmount(subtotal, requestedPct);
    const requestedAt = new Date().toISOString();

    let tiers = [];
    try {
      const tierRes = await discountTierService.getDiscountTiers({ status: 'ACTIVE' });
      tiers = Array.isArray(tierRes) ? tierRes : tierRes.data || [];
    } catch (e) {
      tiers = [];
    }

    if (!tiers || tiers.length === 0) {
      // Section 58 Edge Case: No Discount Tier configuration exists
      return {
        allowed: false,
        approvalRequired: true,
        approvalLevel: 'FINANCE',
        governanceDecision: DISCOUNT_GOVERNANCE_STATUS.REJECTED_BY_POLICY,
        applicableTier: null,
        maximumAuthorizedDiscount: 0,
        requestedDiscountPercentage: requestedPct,
        discountAmount,
        riskLevel: DISCOUNT_RISK_LEVELS.CRITICAL,
        riskReason: 'No active Discount Tier governance policy configured. High-risk discounts are blocked.',
        audit: {
          requestedBy: userId,
          requestedAt,
          userRole,
        },
      };
    }

    // Role maximum authorized limits (DT-SLS-01 max = 5%)
    const salespersonTier = tiers.find((t) => t.approvalLevel === 0) || tiers[0];
    const maxSalespersonAuth = salespersonTier ? Number(salespersonTier.maximumDiscount) : 5.0;

    // Manager tier limit (DT-MGR-02 max = 12%)
    const managerTier = tiers.find((t) => t.approvalLevel === 1) || tiers[1];
    const maxManagerAuth = managerTier ? Number(managerTier.maximumDiscount) : 12.0;

    // Finance tier limit (DT-FIN-03 max = 25%)
    const financeTier = tiers.find((t) => t.approvalLevel === 2) || tiers[2];
    const maxFinanceAuth = financeTier ? Number(financeTier.maximumDiscount) : 25.0;

    // CASE 1: 0% or within Salesperson Authority (Section 56 Edge Case: requested == maxSalespersonAuth)
    if (requestedPct <= maxSalespersonAuth) {
      return {
        allowed: true,
        approvalRequired: false,
        approvalLevel: 'NONE',
        governanceDecision: DISCOUNT_GOVERNANCE_STATUS.WITHIN_AUTHORITY,
        applicableTier: salespersonTier,
        maximumAuthorizedDiscount: maxSalespersonAuth,
        requestedDiscountPercentage: requestedPct,
        discountAmount,
        riskLevel: DISCOUNT_RISK_LEVELS.NORMAL,
        riskReason: `Requested discount (${requestedPct}%) is within your authorized salesperson limit (${maxSalespersonAuth}%).`,
        audit: {
          requestedBy: userId,
          requestedAt,
          userRole,
        },
      };
    }

    // CASE 2: Exceeds Salesperson limit, within Manager limit (Section 57 Edge Case: 5.01% to 12%)
    if (requestedPct <= maxManagerAuth) {
      return {
        allowed: true,
        approvalRequired: true,
        approvalLevel: 'MANAGER',
        governanceDecision: DISCOUNT_GOVERNANCE_STATUS.PENDING_MANAGER_APPROVAL,
        applicableTier: managerTier || salespersonTier,
        maximumAuthorizedDiscount: maxSalespersonAuth,
        requestedDiscountPercentage: requestedPct,
        discountAmount,
        riskLevel: DISCOUNT_RISK_LEVELS.MEDIUM,
        riskReason: `Requested discount (${requestedPct}%) exceeds your authorized limit (${maxSalespersonAuth}%) and requires Sales Manager approval.`,
        audit: {
          requestedBy: userId,
          requestedAt,
          userRole,
        },
      };
    }

    // CASE 3: Exceeds Manager limit, within Finance/Ops limit (12.01% to 25%)
    if (requestedPct <= maxFinanceAuth) {
      return {
        allowed: true,
        approvalRequired: true,
        approvalLevel: 'FINANCE',
        governanceDecision: DISCOUNT_GOVERNANCE_STATUS.PENDING_FINANCE_APPROVAL,
        applicableTier: financeTier || managerTier,
        maximumAuthorizedDiscount: maxSalespersonAuth,
        requestedDiscountPercentage: requestedPct,
        discountAmount,
        riskLevel: DISCOUNT_RISK_LEVELS.HIGH,
        riskReason: `Requested discount (${requestedPct}%) exceeds Sales Manager authority (${maxManagerAuth}%) and requires Finance & Operations approval.`,
        audit: {
          requestedBy: userId,
          requestedAt,
          userRole,
        },
      };
    }

    // CASE 4: Exceeds absolute policy threshold (> 25%)
    return {
      allowed: false,
      approvalRequired: true,
      approvalLevel: 'FINANCE',
      governanceDecision: DISCOUNT_GOVERNANCE_STATUS.REJECTED_BY_POLICY,
      applicableTier: financeTier || null,
      maximumAuthorizedDiscount: maxSalespersonAuth,
      requestedDiscountPercentage: requestedPct,
      discountAmount,
      riskLevel: DISCOUNT_RISK_LEVELS.CRITICAL,
      riskReason: `Requested discount (${requestedPct}%) exceeds maximum corporate policy limit (${maxFinanceAuth}%). Proposal cannot be submitted without executive exception.`,
      audit: {
        requestedBy: userId,
        requestedAt,
        userRole,
      },
    };
  },
};

export default discountGovernanceService;
