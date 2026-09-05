/**
 * Customer Quotation Data Types and Enum Definitions
 * Strictly isolates customer-visible representations from internal governance data.
 */

export const CUSTOMER_QUOTATION_STATUS = {
  SENT: 'SENT',
  UNDER_REVIEW: 'UNDER_REVIEW',
  NEGOTIATION: 'NEGOTIATION',
  REVISION_AVAILABLE: 'REVISION_AVAILABLE',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
};

export const CUSTOMER_STATUS_LABELS = {
  SENT: 'Quotation Received',
  UNDER_REVIEW: 'Under Internal Review',
  NEGOTIATION: 'Negotiation In Progress',
  REVISION_AVAILABLE: 'Revised Proposal Ready',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  EXPIRED: 'Expired',
};

export const CUSTOMER_STATUS_BADGE_VARIANTS = {
  SENT: 'primary',
  UNDER_REVIEW: 'warning',
  NEGOTIATION: 'info',
  REVISION_AVAILABLE: 'purple',
  ACCEPTED: 'success',
  REJECTED: 'danger',
  EXPIRED: 'neutral',
};

export const REQUEST_CHANGE_CATEGORIES = [
  { value: 'Price', label: 'Unit Price Adjustment' },
  { value: 'Discount', label: 'Overall Discount Rate' },
  { value: 'Quantity', label: 'Quantity / Volume Change' },
  { value: 'Product', label: 'Product Selection / Substitution' },
  { value: 'Delivery', label: 'Delivery Schedule / Logistics' },
  { value: 'Terms', label: 'Payment / Commercial Terms' },
  { value: 'Other', label: 'Other Specification Request' },
];

/**
 * Maps internal quotation states to customer-facing status labels.
 * Strips internal governance status terminology.
 */
export const mapInternalToCustomerStatus = (internalStatus) => {
  switch (internalStatus) {
    case 'APPROVED':
    case 'SENT':
      return CUSTOMER_QUOTATION_STATUS.SENT;
    case 'PENDING_MANAGER_APPROVAL':
    case 'PENDING_FINANCE_APPROVAL':
      return CUSTOMER_QUOTATION_STATUS.UNDER_REVIEW;
    case 'NEGOTIATION':
    case 'REVISION_REQUESTED':
      return CUSTOMER_QUOTATION_STATUS.NEGOTIATION;
    case 'REVISION_AVAILABLE':
      return CUSTOMER_QUOTATION_STATUS.REVISION_AVAILABLE;
    case 'ACCEPTED':
      return CUSTOMER_QUOTATION_STATUS.ACCEPTED;
    case 'REJECTED':
      return CUSTOMER_QUOTATION_STATUS.REJECTED;
    case 'EXPIRED':
      return CUSTOMER_QUOTATION_STATUS.EXPIRED;
    default:
      return CUSTOMER_QUOTATION_STATUS.SENT;
  }
};
