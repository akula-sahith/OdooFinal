/**
 * Validation rules for Customer Profile update forms
 */

export const validateCustomerProfile = (formData) => {
  const errors = {};

  if (!formData.firstName || !formData.firstName.trim()) {
    errors.firstName = 'First name is required.';
  }

  if (!formData.lastName || !formData.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  }

  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email address is required.';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
  }

  if (!formData.companyName || !formData.companyName.trim()) {
    errors.companyName = 'Company name is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
