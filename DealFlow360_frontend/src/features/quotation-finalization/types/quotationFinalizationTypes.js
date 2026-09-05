/**
 * Phase 10.6 — Quotation Finalization, Version Control & Commercial Closure Types
 */

export const COMMERCIAL_CLOSURE_STATUS = {
  COMMERCIALLY_CLOSED: 'COMMERCIALLY_CLOSED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
};

export const ORDER_READINESS_STATUS = {
  NOT_READY: 'NOT_READY',
  READY_FOR_ORDER: 'READY_FOR_ORDER',
  ORDER_CREATED: 'ORDER_CREATED',
};

export const ORDER_READINESS_LABELS = {
  NOT_READY: 'Not Ready for Order',
  READY_FOR_ORDER: 'Ready for Order Handoff',
  ORDER_CREATED: 'Order Created',
};

export const ORDER_READINESS_BADGE_VARIANTS = {
  NOT_READY: 'neutral',
  READY_FOR_ORDER: 'success',
  ORDER_CREATED: 'primary',
};

/**
 * Validates if a quotation is in a commercially closed state.
 */
export const isCommerciallyClosed = (status) => {
  return status === COMMERCIAL_CLOSURE_STATUS.COMMERCIALLY_CLOSED || status === COMMERCIAL_CLOSURE_STATUS.ACCEPTED;
};
