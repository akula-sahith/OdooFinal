/**
 * Product Form Client-Side Validation
 */

export const validateProduct = (formData) => {
  const errors = {};

  // Product Name validation
  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Product name is required.';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Product name must be at least 2 characters.';
  } else if (formData.name.trim().length > 100) {
    errors.name = 'Product name cannot exceed 100 characters.';
  }

  // SKU / Product Code validation
  if (!formData.sku || !formData.sku.trim()) {
    errors.sku = 'Product SKU / Code is required.';
  } else {
    const skuRegex = /^[A-Za-z0-9_-]{3,30}$/;
    if (!skuRegex.test(formData.sku.trim())) {
      errors.sku = 'SKU must be 3-30 characters containing only letters, numbers, hyphens, or underscores.';
    }
  }

  // Category validation
  if (!formData.category_id || !formData.category_id.trim()) {
    errors.category_id = 'Category selection is required.';
  }

  // Status validation
  if (!formData.status || !['ACTIVE', 'INACTIVE'].includes(formData.status)) {
    errors.status = 'Status must be either ACTIVE or INACTIVE.';
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
