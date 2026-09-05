/**
 * Validation rules for Quotation headers and Line Items.
 */

export const validateQuotationHeader = (formData) => {
  const errors = {};

  if (!formData.requestId) {
    errors.requestId = 'A confirmed customer request must be selected.';
  }

  if (!formData.priceListId) {
    errors.priceListId = 'An active commercial price list must be selected.';
  }

  if (!formData.title || !formData.title.trim()) {
    errors.title = 'Quotation proposal title is required.';
  } else if (formData.title.trim().length < 3) {
    errors.title = 'Quotation title must be at least 3 characters long.';
  } else if (formData.title.trim().length > 150) {
    errors.title = 'Quotation title cannot exceed 150 characters.';
  }

  if (!formData.validFrom) {
    errors.validFrom = 'Valid From date is required.';
  }

  if (!formData.validUntil) {
    errors.validUntil = 'Valid Until date is required.';
  } else if (formData.validFrom && new Date(formData.validUntil) <= new Date(formData.validFrom)) {
    errors.validUntil = 'Valid Until date must be after Valid From date.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateQuotationItem = (itemData) => {
  const errors = {};

  if (!itemData.productId) {
    errors.productId = 'Product selection is required.';
  }

  const qty = Number(itemData.quantity);
  if (isNaN(qty) || !Number.isInteger(qty) || qty <= 0) {
    errors.quantity = 'Quantity must be a positive whole integer greater than 0.';
  } else if (qty > 100000) {
    errors.quantity = 'Quantity cannot exceed 100,000 units per line.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
