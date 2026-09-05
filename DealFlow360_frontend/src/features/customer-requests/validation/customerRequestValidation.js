/**
 * Validation rules for Customer Request Form
 */

export const validateCustomerRequestForm = (formData) => {
  const errors = {};

  if (!formData.title || !formData.title.trim()) {
    errors.title = 'Request title is required.';
  } else if (formData.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters long.';
  }

  if (!formData.description || !formData.description.trim()) {
    errors.description = 'Requirement description is required.';
  } else if (formData.description.trim().length < 15) {
    errors.description = 'Please provide more details (at least 15 characters).';
  }

  if (formData.quantity !== undefined && formData.quantity !== null && formData.quantity !== '') {
    const num = Number(formData.quantity);
    if (isNaN(num) || num <= 0) {
      errors.quantity = 'Quantity must be a positive number greater than 0.';
    }
  }

  if (!formData.priority) {
    errors.priority = 'Priority selection is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
