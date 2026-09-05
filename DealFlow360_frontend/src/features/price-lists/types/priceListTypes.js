/**
 * Price List Module Type Definitions
 * JSDoc type definitions for Admin Price List Management system.
 */

/**
 * @typedef {'ACTIVE' | 'INACTIVE'} PriceListStatus
 */

/**
 * @typedef {Object} PriceListItem
 * @property {string} id
 * @property {string} price_list_id
 * @property {string} product_id
 * @property {import('../../products/types/productTypes').Product} [product]
 * @property {number} base_price
 * @property {PriceListStatus} [status]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} PriceList
 * @property {string} id
 * @property {string} name
 * @property {string} code
 * @property {string} currency
 * @property {string} [effective_from]
 * @property {string} [effective_to]
 * @property {string} [description]
 * @property {PriceListStatus} status
 * @property {number} [product_count]
 * @property {PriceListItem[]} [items]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} PriceListFilterParams
 * @property {number} [page=1]
 * @property {number} [pageSize=10]
 * @property {string} [search]
 * @property {string} [currency]
 * @property {PriceListStatus | ''} [status]
 * @property {string} [sortBy='name']
 * @property {'asc' | 'desc'} [sortOrder='asc']
 */

/**
 * @typedef {Object} PriceListFormData
 * @property {string} name
 * @property {string} code
 * @property {string} currency
 * @property {string} effective_from
 * @property {string} effective_to
 * @property {string} description
 * @property {PriceListStatus} status
 */

/**
 * @typedef {Object} PriceListItemFormData
 * @property {string} product_id
 * @property {number | string} base_price
 * @property {PriceListStatus} [status]
 */

/**
 * @typedef {Object} PaginationMeta
 * @property {number} currentPage
 * @property {number} pageSize
 * @property {number} totalCount
 * @property {number} totalPages
 */

export {};
