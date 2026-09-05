import { REQUEST_STATUS, REQUEST_PRIORITY } from '../../../constants/status';

export { REQUEST_STATUS, REQUEST_PRIORITY };

export const REQUEST_STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'REQUIREMENT_CLARIFICATION', label: 'Clarification Requested' },
  { value: 'REQUIREMENT_CONFIRMED', label: 'Requirement Confirmed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'CLOSED', label: 'Closed' },
];

export const REQUEST_PRIORITY_OPTIONS = [
  { value: 'ALL', label: 'All Priorities' },
  { value: 'LOW', label: 'Low Priority' },
  { value: 'NORMAL', label: 'Normal Priority' },
  { value: 'HIGH', label: 'High Priority' },
  { value: 'URGENT', label: 'Urgent' },
];
