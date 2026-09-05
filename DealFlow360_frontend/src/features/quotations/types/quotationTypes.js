/**
 * Quotation & QuotationItem Data Model Specification
 */

export const DISCOUNT_GOVERNANCE_STATUS = {
  NOT_REQUESTED: 'NOT_REQUESTED',
  WITHIN_AUTHORITY: 'WITHIN_AUTHORITY',
  PENDING_MANAGER_APPROVAL: 'PENDING_MANAGER_APPROVAL',
  PENDING_FINANCE_APPROVAL: 'PENDING_FINANCE_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REVISION_REQUESTED: 'REVISION_REQUESTED',
};

export const DISCOUNT_RISK_LEVELS = {
  NORMAL: 'NORMAL',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

/**
 * @typedef {Object} QuotationItem
 * @property {string} quotationItemId
 * @property {string} quotationId
 * @property {string} productId
 * @property {string} productNameSnapshot
 * @property {string} skuSnapshot
 * @property {string} categorySnapshot
 * @property {number} quantity
 * @property {number} unitBasePrice
 * @property {number} requestedDiscountPercentage
 * @property {number} requestedDiscountAmount
 * @property {number} approvedDiscountPercentage
 * @property {number} discountAmount
 * @property {number} netLineAmount
 * @property {number} taxAmount
 * @property {number} lineSubtotal
 * @property {number} lineTotal
 * @property {string} currency
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Quotation
 * @property {string} quotationId
 * @property {string} quotationNumber - Human readable (e.g. QTN-2026-00001)
 * @property {string} requestId
 * @property {string} customerId
 * @property {string} customerName
 * @property {string} companyName
 * @property {string} customerEmail
 * @property {string} salespersonId
 * @property {string} salespersonName
 * @property {string} priceListId
 * @property {string} priceListName
 * @property {string} status - QUOTATION_STATUS enum
 * @property {string} title
 * @property {string} description
 * @property {string} currency
 * @property {string} validFrom
 * @property {string} validUntil
 * @property {number} subtotal
 * @property {number} discountTotal
 * @property {number} discountPercentage
 * @property {string} discountStatus
 * @property {string} discountTierId
 * @property {string} discountAuthority
 * @property {boolean} approvalRequired
 * @property {string} approvalLevel
 * @property {string} riskLevel
 * @property {number} taxTotal
 * @property {number} grandTotal
 * @property {QuotationItem[]} items
 * @property {number} version
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} createdBy
 */

export const DEFAULT_QUOTATION_VALIDITY_DAYS = 30;
