/**
 * Quotation Finalization & Commercial Closure Validation Rules
 */

export const validateFinalizationState = (quotation) => {
  if (!quotation) {
    return {
      canFinalize: false,
      error: 'Quotation details unavailable.',
    };
  }

  // Must be in ACCEPTED state
  if (quotation.status !== 'ACCEPTED' && quotation.status !== 'COMMERCIALLY_CLOSED') {
    return {
      canFinalize: false,
      error: `Quotation in status ${quotation.status} cannot be commercially closed. Proposal must be accepted by customer first.`,
    };
  }

  // Check validity expiry date
  if (quotation.validUntil) {
    const validUntilDate = new Date(quotation.validUntil);
    const now = new Date();
    // Expiry check
    if (quotation.status === 'EXPIRED') {
      return {
        canFinalize: false,
        error: 'This quotation has expired and cannot be commercially closed.',
      };
    }
  }

  return { canFinalize: true, error: null };
};

export const validateVersionComparison = (versionA, versionB) => {
  if (!versionA || !versionB) {
    return { isValid: false, error: 'Select two distinct quotation versions to compare.' };
  }
  if (versionA.version === versionB.version) {
    return { isValid: false, error: 'Please select two different versions for comparison.' };
  }
  return { isValid: true, error: null };
};
