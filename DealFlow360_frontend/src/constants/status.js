/**
 * Centralized Governance & Operational Status Constants
 * Unifies configuration and transactional status definitions across DealFlow360.
 */

// Configuration Statuses (Admin Foundation: Products, Price Lists, Discount Tiers, Roles, Users)
export const CONFIG_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

// Common Status Options for Select Dropdowns
export const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

// Request Lifecycle Statuses (Phase 9.2 Customer ↔ Salesperson Requirements)
export const REQUEST_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  REQUIREMENT_CLARIFICATION: 'REQUIREMENT_CLARIFICATION',
  REQUIREMENT_CONFIRMED: 'REQUIREMENT_CONFIRMED',
  CANCELLED: 'CANCELLED',
  CLOSED: 'CLOSED',
};

// Request Priority Levels
export const REQUEST_PRIORITY = {
  LOW: 'LOW',
  NORMAL: 'NORMAL',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
};

