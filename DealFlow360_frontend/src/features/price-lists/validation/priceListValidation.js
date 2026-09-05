import { SUPPORTED_CURRENCIES } from '../../../constants/currency';

/**
 * Client-Side Validation for Price List Master Form
 *
 * @param {Object} formData
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export const validatePriceList = (formData) => {
  const errors = {};

  // Name validation
  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Price list name is required.';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Price list name must be at least 2 characters.';
  } else if (formData.name.trim().length > 100) {
    errors.name = 'Price list name cannot exceed 100 characters.';
  }

  // Code validation
  if (!formData.code || !formData.code.trim()) {
    errors.code = 'Price list code is required.';
  } else {
    const codeRegex = /^[A-Za-z0-9_-]{3,30}$/;
    if (!codeRegex.test(formData.code.trim())) {
      errors.code = 'Code must be 3-30 characters containing only letters, numbers, hyphens, or underscores.';
    }
  }

  // Currency validation
  const validCurrencyCodes = SUPPORTED_CURRENCIES.map((c) => c.code);
  if (!formData.currency || !formData.currency.trim()) {
    errors.currency = 'Currency selection is required.';
  } else if (!validCurrencyCodes.includes(formData.currency.trim().toUpperCase())) {
    errors.currency = 'Please select a valid currency code.';
  }

  // Status validation
  if (!formData.status || !['ACTIVE', 'INACTIVE'].includes(formData.status)) {
    errors.status = 'Status must be either ACTIVE or INACTIVE.';
  }

  // Date Relationship Validation: Effective To >= Effective From
  if (formData.effective_from && formData.effective_to) {
    const fromDate = new Date(formData.effective_from);
    const toDate = new Date(formData.effective_to);

    if (isNaN(fromDate.getTime())) {
      errors.effective_from = 'Invalid Effective From date.';
    }
    if (isNaN(toDate.getTime())) {
      errors.effective_to = 'Invalid Effective To date.';
    }

    if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
      // Set to midnight for date-only comparisons
      const fromMidnight = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate()).getTime();
      const toMidnight = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate()).getTime();

      if (toMidnight < fromMidnight) {
        errors.effective_to = 'Effective To date cannot be earlier than Effective From date.';
      }
    }
  }

  // Description validation (optional)
  if (formData.description && formData.description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default validatePriceList;
