/**
 * Approval Decision & State Transition Validation Rules
 */

export const validateRejectionReason = (reason = '') => {
  if (!reason || typeof reason !== 'string' || !reason.trim()) {
    return { valid: false, error: 'A rejection reason is strictly required.' };
  }
  if (reason.trim().length < 5) {
    return { valid: false, error: 'Rejection reason must be at least 5 characters long.' };
  }
  return { valid: true };
};

export const validateRevisionReason = (reason = '') => {
  if (!reason || typeof reason !== 'string' || !reason.trim()) {
    return { valid: false, error: 'Revision instructions for the salesperson are strictly required.' };
  }
  if (reason.trim().length < 5) {
    return { valid: false, error: 'Revision instructions must be at least 5 characters long.' };
  }
  return { valid: true };
};

export const validateSelfApproval = (creatorId, approverId) => {
  if (creatorId && approverId && creatorId === approverId) {
    return { valid: false, error: 'Separation of Duties violation: Salespersons cannot approve their own commercial proposals.' };
  }
  return { valid: true };
};

export const validateStateTransition = (currentStatus, targetAction) => {
  const allowedTransitions = {
    DRAFT: ['SUBMIT'],
    REVISION_REQUESTED: ['SUBMIT'],
    PENDING_MANAGER_APPROVAL: ['APPROVE', 'REJECT', 'REQUEST_REVISION', 'ESCALATE'],
    PENDING_FINANCE_APPROVAL: ['APPROVE', 'REJECT', 'REQUEST_REVISION'],
    APPROVED: [],
    REJECTED: [],
  };

  const allowed = allowedTransitions[currentStatus] || [];
  if (!allowed.includes(targetAction)) {
    return {
      valid: false,
      error: `Invalid state transition. Action "${targetAction}" is not permitted for quotation in status [${currentStatus}].`,
    };
  }

  return { valid: true };
};
