/**
 * Quotation Approval Data Models & Actions Specification
 */

export const APPROVAL_ACTIONS = {
  SUBMIT: 'SUBMIT',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  REQUEST_REVISION: 'REQUEST_REVISION',
  ESCALATE: 'ESCALATE',
};

export const APPROVAL_LEVELS = {
  NONE: 'NONE',
  MANAGER: 'MANAGER',
  FINANCE: 'FINANCE',
  EXECUTIVE: 'EXECUTIVE',
};

/**
 * @typedef {Object} ApprovalHistoryEntry
 * @property {string} id
 * @property {string} quotationId
 * @property {string} actorId
 * @property {string} actorName
 * @property {string} actorRole
 * @property {string} action - APPROVAL_ACTIONS enum
 * @property {string} fromStatus
 * @property {string} toStatus
 * @property {string} comment
 * @property {string} timestamp - ISO server timestamp
 */

/**
 * @typedef {Object} ApprovalRecord
 * @property {string} quotationId
 * @property {string} quotationNumber
 * @property {string} customerName
 * @property {string} salespersonName
 * @property {string} requestId
 * @property {number} subtotal
 * @property {number} requestedDiscountPercentage
 * @property {number} discountAmount
 * @property {number} netAmount
 * @property {string} riskLevel - NORMAL | MEDIUM | HIGH | CRITICAL
 * @property {string} approvalLevel - MANAGER | FINANCE
 * @property {string} status - PENDING_MANAGER_APPROVAL | PENDING_FINANCE_APPROVAL | APPROVED | REJECTED | REVISION_REQUESTED
 * @property {string} submittedAt
 * @property {ApprovalHistoryEntry[]} history
 */
