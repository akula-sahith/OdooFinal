/**
 * Approval Chain Types & Governance Constants
 * Defines escalation sequence rules and trigger evaluation outcomes.
 */

export const GOVERNANCE_LEVEL_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export const EVALUATION_OUTCOMES = {
  NO_APPROVAL_REQUIRED: 'NO_APPROVAL_REQUIRED',
  PENDING_MANAGER_APPROVAL: 'PENDING_MANAGER_APPROVAL',
  PENDING_FINANCE_APPROVAL: 'PENDING_FINANCE_APPROVAL',
  PENDING_EXECUTIVE_APPROVAL: 'PENDING_EXECUTIVE_APPROVAL',
};

export const APPROVAL_CHAIN_DEFAULT_LEVELS = [
  {
    id: 'lvl_00',
    level: 0,
    title: 'Level 0 — Standard Salesperson Limit',
    role: 'Salesperson',
    thresholdPercent: 5.0,
    triggerCondition: 'Requested discount <= 5.00%',
    outcome: 'NO_APPROVAL_REQUIRED',
    outcomeBadge: 'Auto-Approved',
    description: 'Quotations with discounts within standard salesperson limits proceed directly without requiring manager authorization.',
    status: 'ACTIVE',
  },
  {
    id: 'lvl_01',
    level: 1,
    title: 'Level 1 — Sales Manager Threshold',
    role: 'Sales Manager',
    thresholdPercent: 12.0,
    triggerCondition: 'Requested discount > 5.00% and <= 12.00%',
    outcome: 'PENDING_MANAGER_APPROVAL',
    outcomeBadge: 'Manager Review Required',
    description: 'Exceeding salesperson limits routes the quotation to the assigned Sales Manager for commercial review.',
    status: 'ACTIVE',
  },
  {
    id: 'lvl_02',
    level: 2,
    title: 'Level 2 — Finance & Operations Escalation',
    role: 'Finance / Operations',
    thresholdPercent: 25.0,
    triggerCondition: 'Requested discount > 12.00% and <= 25.00%',
    outcome: 'PENDING_FINANCE_APPROVAL',
    outcomeBadge: 'Finance Sign-Off Required',
    description: 'High-risk or exceptional margin discounts require sign-off from Finance & Operations before quotation release.',
    status: 'ACTIVE',
  },
];
