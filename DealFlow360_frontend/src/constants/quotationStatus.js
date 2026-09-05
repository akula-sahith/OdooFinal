/**
 * Centralized Quotation Status Constants & Visual Definitions
 * Governs the commercial proposal lifecycle in DealFlow360.
 */

export const QUOTATION_STATUS = {
  DRAFT: 'DRAFT',
  PENDING_MANAGER_APPROVAL: 'PENDING_MANAGER_APPROVAL',
  PENDING_FINANCE_APPROVAL: 'PENDING_FINANCE_APPROVAL',
  APPROVED: 'APPROVED',
  SENT: 'SENT',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
};

export const QUOTATION_STATUS_DEFINITIONS = {
  DRAFT: {
    label: 'Draft',
    variant: 'neutral',
    description: 'Preliminary quotation draft being prepared by Sales Engineer.',
  },
  PENDING_MANAGER_APPROVAL: {
    label: 'Pending Manager Review',
    variant: 'warning',
    description: 'Awaiting Discount Governance escalation review by Sales Manager.',
  },
  PENDING_FINANCE_APPROVAL: {
    label: 'Pending Finance Review',
    variant: 'amber',
    description: 'High margin exception awaiting Finance & Operations review.',
  },
  APPROVED: {
    label: 'Governance Approved',
    variant: 'info',
    description: 'Approved commercial quotation ready to send to customer.',
  },
  SENT: {
    label: 'Sent to Customer',
    variant: 'purple',
    description: 'Quotation delivered to customer portal for review.',
  },
  ACCEPTED: {
    label: 'Accepted by Customer',
    variant: 'success',
    description: 'Quotation accepted by customer client. Eligible for sales order conversion.',
  },
  REJECTED: {
    label: 'Rejected',
    variant: 'danger',
    description: 'Quotation declined or rejected during governance or negotiation.',
  },
  EXPIRED: {
    label: 'Expired',
    variant: 'neutral',
    description: 'Quotation validity period has elapsed.',
  },
  CANCELLED: {
    label: 'Cancelled',
    variant: 'danger',
    description: 'Quotation withdrawn or cancelled.',
  },
};
