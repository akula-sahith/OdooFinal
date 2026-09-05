/**
 * Client-Side Validation for Price List Item (Product Base Price Assignment)
 *
 * @param {Object} itemData
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export const validatePriceListItem = (itemData) => {
  const errors = {};

  // Product ID validation
  if (!itemData.product_id || !itemData.product_id.trim()) {
    errors.product_id = 'Product selection is required.';
  }

  // Base Price validation
  if (itemData.base_price === undefined || itemData.base_price === null || itemData.base_price === '') {
    errors.base_price = 'Base price is required.';
  } else {
    const numPrice = Number(itemData.base_price);
    if (isNaN(numPrice)) {
      errors.base_price = 'Base price must be a valid number.';
    } else if (numPrice < 0) {
      errors.base_price = 'Base price cannot be negative.';
    } else if (numPrice > 100000000) {
      errors.base_price = 'Base price exceeds maximum permitted limit.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default validatePriceListItem;
