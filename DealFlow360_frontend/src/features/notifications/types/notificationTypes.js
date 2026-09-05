/**
 * Centralized Notification Types & Target Route Resolvers
 */

export const NOTIFICATION_TYPES = {
  NEW_REQUEST: 'NEW_REQUEST',
  REQUEST_ASSIGNED: 'REQUEST_ASSIGNED',
  NEW_MESSAGE: 'NEW_MESSAGE',
  CLARIFICATION_REQUESTED: 'CLARIFICATION_REQUESTED',
  CUSTOMER_REPLY: 'CUSTOMER_REPLY',
  REQUIREMENT_CONFIRMED: 'REQUIREMENT_CONFIRMED',
  REQUEST_STATUS_CHANGED: 'REQUEST_STATUS_CHANGED',
};

export const NOTIFICATION_METADATA = {
  NEW_REQUEST: {
    title: 'New Commercial Request',
    icon: 'Inbox',
    variant: 'info',
  },
  REQUEST_ASSIGNED: {
    title: 'Request Assigned to You',
    icon: 'UserCheck',
    variant: 'purple',
  },
  NEW_MESSAGE: {
    title: 'New Message Received',
    icon: 'MessageSquare',
    variant: 'info',
  },
  CLARIFICATION_REQUESTED: {
    title: 'Requirement Clarification Requested',
    icon: 'HelpCircle',
    variant: 'amber',
  },
  CUSTOMER_REPLY: {
    title: 'Customer Replied to Clarification',
    icon: 'MessageSquare',
    variant: 'info',
  },
  REQUIREMENT_CONFIRMED: {
    title: 'Requirement Confirmed',
    icon: 'CheckCircle2',
    variant: 'success',
  },
  REQUEST_STATUS_CHANGED: {
    title: 'Request Lifecycle Status Changed',
    icon: 'Clock',
    variant: 'warning',
  },
};

/**
 * Resolves the authorized destination path based on user role and notification payload.
 */
export function resolveNotificationRoute(notification, userType = 'CUSTOMER') {
  if (!notification || !notification.requestId) {
    return userType === 'SALESPERSON' ? '/company/sales/dashboard' : '/customer/dashboard';
  }

  if (userType === 'SALESPERSON') {
    return `/company/sales/requests/${notification.requestId}`;
  }
  return `/customer/requests/${notification.requestId}`;
}
