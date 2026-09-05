/**
 * DEALFLOW360 Admin Dashboard Types & Contract Schemas
 * Admin is focused strictly on Platform Configuration + Governance & Analytics.
 */

/**
 * @typedef {Object} ConfigurationHealth
 * @property {number} productsCount
 * @property {number} activeProductsCount
 * @property {number} priceListsCount
 * @property {number} discountRulesCount
 * @property {number} approvalChainsCount
 * @property {number} warehousesCount
 * @property {number} subscriptionPlansCount
 */

/**
 * @typedef {Object} ConfigurationAttentionItem
 * @property {string} id
 * @property {'high'|'medium'|'low'} severity
 * @property {string} title
 * @property {string} description
 * @property {string} [timestamp]
 * @property {string} [actionText]
 * @property {string} [destination]
 */

/**
 * @typedef {Object} PlatformAnalytics
 * @property {number} [totalPlatformQuotationValue]
 * @property {number} [approvedVolume]
 * @property {number} [activeAccounts]
 * @property {number} [transactionCount]
 * @property {Array<{ label: string, value: number }>} [periodDistribution]
 */

/**
 * @typedef {Object} ConfigurationAuditItem
 * @property {string} id
 * @property {string} event
 * @property {string} actor
 * @property {string} category // 'Pricing' | 'ApprovalChain' | 'Warehouse' | 'Products' | 'Security'
 * @property {string} timestamp
 */

export const ADMIN_TIME_RANGES = {
  DAYS_7: '7d',
  DAYS_30: '30d',
  DAYS_90: '90d',
};
