/**
 * Discount Tier Types & Status Constants
 * Centralized governance definitions for Discount Tiers and Approval Escalation.
 */

export const DISCOUNT_TIER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export const APPROVAL_ROLES = [
  { value: 'Salesperson', label: 'Salesperson (Self-Approved / Auto)' },
  { value: 'Sales Manager', label: 'Sales Manager' },
  { value: 'Finance / Operations', label: 'Finance / Operations' },
  { value: 'Executive / Admin', label: 'Executive / Admin' },
];

export const APPROVAL_LEVELS = [
  { value: 0, label: 'Level 0 — Standard (No Approval Required)', code: 'NO_APPROVAL_REQUIRED' },
  { value: 1, label: 'Level 1 — Manager Approval Required', code: 'PENDING_MANAGER_APPROVAL' },
  { value: 2, label: 'Level 2 — Finance / Operations Escalation', code: 'PENDING_FINANCE_APPROVAL' },
  { value: 3, label: 'Level 3 — Executive Board Approval', code: 'PENDING_EXECUTIVE_APPROVAL' },
];
