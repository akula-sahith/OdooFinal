/**
 * Category Form Client-Side Validation
 */

export const validateCategory = (formData) => {
  const errors = {};

  // Category Name validation
  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Category name is required.';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Category name must be at least 2 characters.';
  } else if (formData.name.trim().length > 60) {
    errors.name = 'Category name cannot exceed 60 characters.';
  }

  // Description validation (optional)
  if (formData.description && formData.description.length > 250) {
    errors.description = 'Description cannot exceed 250 characters.';
  }

  // Status validation
  if (!formData.status || !['ACTIVE', 'INACTIVE'].includes(formData.status)) {
    errors.status = 'Status must be either ACTIVE or INACTIVE.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
