/**
 * Discount Tier Form Validation Utility
 * Validates discount tier configuration parameters, percentage bounds, approval role, and effective dates.
 */

export const validateDiscountTier = (data) => {
  const errors = {};

  // Name
  if (!data.name || !String(data.name).trim()) {
    errors.name = 'Discount tier name is required.';
  } else if (String(data.name).trim().length < 2) {
    errors.name = 'Tier name must be at least 2 characters.';
  } else if (String(data.name).trim().length > 100) {
    errors.name = 'Tier name must not exceed 100 characters.';
  }

  // Code
  if (!data.code || !String(data.code).trim()) {
    errors.code = 'Discount tier code is required.';
  } else if (!/^[A-Z0-9_-]{2,50}$/i.test(String(data.code).trim())) {
    errors.code = 'Code must be 2-50 alphanumeric characters (hyphens and underscores allowed).';
  }

  // Minimum Discount
  const minDisc = Number(data.minimumDiscount);
  if (data.minimumDiscount === '' || data.minimumDiscount === undefined || data.minimumDiscount === null || isNaN(minDisc)) {
    errors.minimumDiscount = 'Minimum discount percentage is required.';
  } else if (minDisc < 0) {
    errors.minimumDiscount = 'Minimum discount cannot be negative.';
  } else if (minDisc > 100) {
    errors.minimumDiscount = 'Minimum discount cannot exceed 100%.';
  }

  // Maximum Discount
  const maxDisc = Number(data.maximumDiscount);
  if (data.maximumDiscount === '' || data.maximumDiscount === undefined || data.maximumDiscount === null || isNaN(maxDisc)) {
    errors.maximumDiscount = 'Maximum discount percentage is required.';
  } else if (maxDisc < 0) {
    errors.maximumDiscount = 'Maximum discount cannot be negative.';
  } else if (maxDisc > 100) {
    errors.maximumDiscount = 'Maximum discount cannot exceed 100%.';
  } else if (!isNaN(minDisc) && maxDisc < minDisc) {
    errors.maximumDiscount = `Maximum discount (${maxDisc}%) must be greater than or equal to minimum discount (${minDisc}%).`;
  }

  // Approval Level & Role
  const level = Number(data.approvalLevel ?? 0);
  if (level > 0 && (!data.approvalRole || !String(data.approvalRole).trim())) {
    errors.approvalRole = 'Approval role is required for tiers requiring approval (Level > 0).';
  }

  // Priority
  const prio = Number(data.priority);
  if (data.priority === '' || data.priority === undefined || data.priority === null || isNaN(prio)) {
    errors.priority = 'Priority order is required.';
  } else if (!Number.isInteger(prio) || prio <= 0) {
    errors.priority = 'Priority must be a positive whole integer greater than 0.';
  }

  // Dates
  if (data.effectiveFrom && data.effectiveTo) {
    const fromDate = new Date(data.effectiveFrom);
    const toDate = new Date(data.effectiveTo);

    if (isNaN(fromDate.getTime())) {
      errors.effectiveFrom = 'Invalid effective from date format.';
    }
    if (isNaN(toDate.getTime())) {
      errors.effectiveTo = 'Invalid effective to date format.';
    }

    if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime()) && toDate < fromDate) {
      errors.effectiveTo = 'Effective To date must be on or after Effective From date.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default validateDiscountTier;
