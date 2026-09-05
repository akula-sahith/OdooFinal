/**
 * Customer Authentication Types & Account Status Definitions
 */

export const CUSTOMER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  SUSPENDED: 'SUSPENDED',
};

export const CUSTOMER_AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Email address or password is incorrect.',
  ACCOUNT_SUSPENDED: 'Your account is suspended. Please contact support.',
  ACCOUNT_UNVERIFIED: 'Your email address is pending verification.',
  EMAIL_EXISTS: 'An account with this email address already exists.',
  NETWORK_ERROR: 'Unable to connect to service. Please try again.',
};
