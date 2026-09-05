/**
 * Validation rules for Staff User Forms (Create & Edit)
 */

export const validateUserForm = (formData) => {
  const errors = {};

  if (!formData.firstName || !formData.firstName.trim()) {
    errors.firstName = 'First name is required.';
  } else if (formData.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters.';
  }

  if (!formData.lastName || !formData.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  } else if (formData.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters.';
  }

  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email address is required.';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
  }

  if (!formData.roleId) {
    errors.roleId = 'Security role assignment is required.';
  }

  if (formData.phone && formData.phone.trim()) {
    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid phone number.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
