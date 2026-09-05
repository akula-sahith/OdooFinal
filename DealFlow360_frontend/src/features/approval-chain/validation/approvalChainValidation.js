/**
 * Approval Chain Governance Validation
 * Enforces ascending threshold ordering, role completeness, and non-contradictory escalation rules.
 */

export const validateApprovalChain = (levels = []) => {
  const errors = {};
  const levelErrors = [];

  if (!Array.isArray(levels) || levels.length === 0) {
    errors.general = 'Approval chain configuration must contain at least one governance level.';
    return { isValid: false, errors, levelErrors };
  }

  // Sort levels by level index
  const sortedLevels = [...levels].sort((a, b) => Number(a.level) - Number(b.level));
  const seenLevels = new Set();
  let previousThreshold = -1;

  sortedLevels.forEach((item, index) => {
    const itemError = {};
    const lvlNum = Number(item.level);
    const thresh = Number(item.thresholdPercent);

    // Check level index
    if (isNaN(lvlNum) || lvlNum < 0) {
      itemError.level = 'Level must be a non-negative integer.';
    } else if (seenLevels.has(lvlNum)) {
      itemError.level = `Duplicate approval level ${lvlNum} detected. Each level must be unique.`;
    }
    seenLevels.add(lvlNum);

    // Check Role
    if (!item.role || !String(item.role).trim()) {
      itemError.role = 'Approval role assignment is required for each governance level.';
    }

    // Check Threshold
    if (item.thresholdPercent === '' || item.thresholdPercent === undefined || item.thresholdPercent === null || isNaN(thresh)) {
      itemError.thresholdPercent = 'Discount threshold percentage is required.';
    } else if (thresh < 0) {
      itemError.thresholdPercent = 'Discount threshold cannot be negative.';
    } else if (thresh > 100) {
      itemError.thresholdPercent = 'Discount threshold cannot exceed 100%.';
    } else if (index > 0 && thresh <= previousThreshold) {
      itemError.thresholdPercent = `Threshold (${thresh}%) must be strictly greater than Level ${sortedLevels[index - 1].level} threshold (${previousThreshold}%).`;
    }

    if (Object.keys(itemError).length > 0) {
      levelErrors[index] = itemError;
    }

    if (!isNaN(thresh)) {
      previousThreshold = thresh;
    }
  });

  const hasLevelErrors = levelErrors.some((e) => e && Object.keys(e).length > 0);

  return {
    isValid: !hasLevelErrors && Object.keys(errors).length === 0,
    errors: hasLevelErrors ? { chain: 'One or more governance levels contain invalid threshold configurations.', ...errors } : errors,
    levelErrors,
  };
};

export default validateApprovalChain;
