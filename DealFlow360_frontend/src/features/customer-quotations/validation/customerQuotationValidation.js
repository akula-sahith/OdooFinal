/**
 * Customer Quotation Action Validation Logic
 */

export const validateRejectionReason = (reason) => {
  if (!reason || typeof reason !== 'string' || !reason.trim()) {
    return {
      isValid: false,
      error: 'Please provide a reason for rejecting this quotation.',
    };
  }
  if (reason.trim().length < 5) {
    return {
      isValid: false,
      error: 'Rejection reason must be at least 5 characters long.',
    };
  }
  if (reason.trim().length > 1000) {
    return {
      isValid: false,
      error: 'Rejection reason cannot exceed 1000 characters.',
    };
  }
  return { isValid: true, error: null };
};

export const validateChangeRequest = (data = {}) => {
  const { message, category } = data;
  
  if (!message || typeof message !== 'string' || !message.trim()) {
    return {
      isValid: false,
      error: 'Please describe the requested changes in detail.',
    };
  }
  if (message.trim().length < 5) {
    return {
      isValid: false,
      error: 'Change request message must be at least 5 characters long.',
    };
  }
  if (message.trim().length > 1500) {
    return {
      isValid: false,
      error: 'Change request message cannot exceed 1500 characters.',
    };
  }

  if (!category) {
    return {
      isValid: false,
      error: 'Please select a change category.',
    };
  }

  return { isValid: true, error: null };
};

export const validateNegotiationMessage = (message) => {
  if (!message || typeof message !== 'string' || !message.trim()) {
    return {
      isValid: false,
      error: 'Message content cannot be empty.',
    };
  }
  if (message.trim().length > 1000) {
    return {
      isValid: false,
      error: 'Message cannot exceed 1000 characters.',
    };
  }
  return { isValid: true, error: null };
};

export const isQuotationActionable = (quotation) => {
  if (!quotation) return false;

  // Check backend expiry
  if (quotation.status === 'EXPIRED') return false;
  if (quotation.validUntil) {
    const expiry = new Date(quotation.validUntil);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (expiry < today) return false;
  }

  // Actionable statuses for customer
  const actionableStatuses = ['SENT', 'REVISION_AVAILABLE', 'NEGOTIATION'];
  return actionableStatuses.includes(quotation.status);
};
