/**
 * Request Event Types & Visibility Tokens
 * Centralized registry of all audit/lifecycle events recorded against a B2B requirement request.
 */

export const REQUEST_EVENT_TYPES = {
  REQUEST_CREATED: 'REQUEST_CREATED',
  REQUEST_SUBMITTED: 'REQUEST_SUBMITTED',
  REQUEST_ASSIGNED: 'REQUEST_ASSIGNED',
  REVIEW_STARTED: 'REVIEW_STARTED',
  CLARIFICATION_REQUESTED: 'CLARIFICATION_REQUESTED',
  CUSTOMER_RESPONDED: 'CUSTOMER_RESPONDED',
  SALESPERSON_RESPONDED: 'SALESPERSON_RESPONDED',
  REQUIREMENT_CONFIRMED: 'REQUIREMENT_CONFIRMED',
  REQUEST_CANCELLED: 'REQUEST_CANCELLED',
  REQUEST_CLOSED: 'REQUEST_CLOSED',
};

export const EVENT_VISIBILITY = {
  CUSTOMER_VISIBLE: 'CUSTOMER_VISIBLE',
  INTERNAL: 'INTERNAL',
};

export const REQUEST_EVENT_METADATA = {
  REQUEST_CREATED: {
    label: 'Request Drafted',
    visibility: EVENT_VISIBILITY.CUSTOMER_VISIBLE,
    variant: 'neutral',
  },
  REQUEST_SUBMITTED: {
    label: 'Request Submitted to Sales Workflow',
    visibility: EVENT_VISIBILITY.CUSTOMER_VISIBLE,
    variant: 'info',
  },
  REQUEST_ASSIGNED: {
    label: 'Sales Lead Assigned',
    visibility: EVENT_VISIBILITY.CUSTOMER_VISIBLE,
    variant: 'purple',
  },
  REVIEW_STARTED: {
    label: 'Sales Engineer Review Started',
    visibility: EVENT_VISIBILITY.CUSTOMER_VISIBLE,
    variant: 'warning',
  },
  CLARIFICATION_REQUESTED: {
    label: 'Requirement Clarification Requested',
    visibility: EVENT_VISIBILITY.CUSTOMER_VISIBLE,
    variant: 'amber',
  },
  CUSTOMER_RESPONDED: {
    label: 'Customer Replied to Clarification',
    visibility: EVENT_VISIBILITY.CUSTOMER_VISIBLE,
    variant: 'info',
  },
  SALESPERSON_RESPONDED: {
    label: 'Sales Representative Replied',
    visibility: EVENT_VISIBILITY.CUSTOMER_VISIBLE,
    variant: 'purple',
  },
  REQUIREMENT_CONFIRMED: {
    label: 'Requirement Confirmed (Quotation Ready)',
    visibility: EVENT_VISIBILITY.CUSTOMER_VISIBLE,
    variant: 'success',
  },
  REQUEST_CANCELLED: {
    label: 'Request Cancelled by Customer',
    visibility: EVENT_VISIBILITY.CUSTOMER_VISIBLE,
    variant: 'danger',
  },
  REQUEST_CLOSED: {
    label: 'Request Closed',
    visibility: EVENT_VISIBILITY.INTERNAL,
    variant: 'neutral',
  },
};
