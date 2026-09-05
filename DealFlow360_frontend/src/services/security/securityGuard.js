/**
 * Phase 20 — Production Security & Validation Guard
 * Centralized service-side security, input validation, mass assignment protection,
 * organization isolation, and IDOR validation functions.
 */

export const securityGuard = {
  /**
   * Mass Assignment Protection: Filters request payload against explicit allowlist of keys.
   */
  sanitizePayload(payload = {}, allowedKeys = []) {
    if (!payload || typeof payload !== 'object') return {};
    const sanitized = {};
    for (const key of allowedKeys) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        sanitized[key] = payload[key];
      }
    }
    return sanitized;
  },

  /**
   * Input Validation: Validates data against type and constraint rules.
   */
  validateInput(data = {}, rules = {}) {
    const errors = {};
    for (const [field, rule] of Object.entries(rules)) {
      const val = data[field];

      if (rule.required && (val === undefined || val === null || val === '')) {
        errors[field] = `${rule.label || field} is required.`;
        continue;
      }

      if (val !== undefined && val !== null && val !== '') {
        if (rule.type === 'string' && typeof val !== 'string') {
          errors[field] = `${rule.label || field} must be a string.`;
        } else if (rule.type === 'number') {
          const num = Number(val);
          if (isNaN(num)) {
            errors[field] = `${rule.label || field} must be a valid number.`;
          } else if (rule.min !== undefined && num < rule.min) {
            errors[field] = `${rule.label || field} must be greater than or equal to ${rule.min}.`;
          } else if (rule.max !== undefined && num > rule.max) {
            errors[field] = `${rule.label || field} must be less than or equal to ${rule.max}.`;
          }
        } else if (rule.type === 'enum' && rule.allowedValues && !rule.allowedValues.includes(val)) {
          errors[field] = `${rule.label || field} must be one of: ${rule.allowedValues.join(', ')}.`;
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /**
   * Organization Context Isolation: Ensures resource orgId matches authenticated tenant orgId.
   */
  verifyOrgContext(sessionOrgId, targetOrgId) {
    if (!sessionOrgId || !targetOrgId || sessionOrgId !== targetOrgId) {
      const err = new Error('Access denied. Resource does not belong to authorized organization context.');
      err.status = 403;
      throw err;
    }
    return true;
  },

  /**
   * IDOR Protection: Verifies user resource ownership or role permission.
   */
  verifyResourceOwnership(sessionUserId, resourceOwnerId, hasTeamAccess = false) {
    if (!hasTeamAccess && sessionUserId !== resourceOwnerId) {
      const err = new Error('Access denied. You do not have permission to access this resource.');
      err.status = 403;
      throw err;
    }
    return true;
  },

  /**
   * Last-Admin Lockout Protection: Prevents deactivating or removing the last active administrator.
   */
  checkLastAdminLockout(usersList = [], targetUserId, newStatus) {
    if (newStatus !== 'INACTIVE') return true;

    const targetUser = usersList.find((u) => u.id === targetUserId);
    if (!targetUser) return true;

    const isAdmin =
      targetUser.roleCode === 'ROLE-ADMIN' ||
      targetUser.roleId === 'role_admin' ||
      targetUser.roleName === 'Administrator';

    if (isAdmin) {
      const activeAdmins = usersList.filter(
        (u) =>
          u.status === 'ACTIVE' &&
          (u.roleCode === 'ROLE-ADMIN' || u.roleId === 'role_admin' || u.roleName === 'Administrator')
      );

      if (activeAdmins.length <= 1) {
        const err = new Error('Action blocked. At least one active Organization Administrator must remain in the system.');
        err.status = 400;
        throw err;
      }
    }
    return true;
  },

  /**
   * Discount Governance Cap Guard: Verifies discount requested does not exceed permitted max cap.
   */
  validateDiscountGovernance(requestedDiscountPercent = 0, maxAllowedPercent = 18) {
    if (requestedDiscountPercent > maxAllowedPercent) {
      const err = new Error(
        `Discount request of ${requestedDiscountPercent}% exceeds authorized governance limit of ${maxAllowedPercent}%.`
      );
      err.status = 400;
      throw err;
    }
    return true;
  },
};

export default securityGuard;
