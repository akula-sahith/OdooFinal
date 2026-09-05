/**
 * Validation rules for Salesperson Request interactions.
 */

export const validateClarificationMessage = (message) => {
  const errors = {};
  if (!message || !message.trim()) {
    errors.message = 'Clarification message is required to communicate with customer.';
  } else if (message.trim().length < 5) {
    errors.message = 'Clarification message must be at least 5 characters long.';
  } else if (message.trim().length > 2000) {
    errors.message = 'Clarification message cannot exceed 2000 characters.';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateConfirmationNotes = (notes) => {
  const errors = {};
  if (notes && notes.trim().length > 1000) {
    errors.notes = 'Confirmation notes cannot exceed 1000 characters.';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
