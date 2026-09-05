/**
 * Role Form Validation Utility
 * Validates role name, unique code format, and description bounds.
 */

export const validateRole = (data) => {
  const errors = {};

  // Name
  if (!data.name || !String(data.name).trim()) {
    errors.name = 'Role name is required.';
  } else if (String(data.name).trim().length < 2) {
    errors.name = 'Role name must be at least 2 characters.';
  } else if (String(data.name).trim().length > 100) {
    errors.name = 'Role name must not exceed 100 characters.';
  }

  // Code
  if (!data.code || !String(data.code).trim()) {
    errors.code = 'Role code is required.';
  } else if (!/^[A-Z0-9_-]{2,50}$/i.test(String(data.code).trim())) {
    errors.code = 'Code must be 2-50 alphanumeric characters (hyphens/underscores allowed).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default validateRole;
