/**
 * Product & Category Type Definitions
 * 
 * Centralized JSDoc type definitions for the Product Catalogue & Category Management system.
 */

/**
 * @typedef {'ACTIVE' | 'INACTIVE'} ProductStatus
 */

/**
 * @typedef {'ACTIVE' | 'INACTIVE'} CategoryStatus
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {CategoryStatus} status
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} sku
 * @property {string} category_id
 * @property {Category} [category]
 * @property {string} [description]
 * @property {ProductStatus} status
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} ProductFilterParams
 * @property {number} [page=1]
 * @property {number} [pageSize=10]
 * @property {string} [search]
 * @property {string} [categoryId]
 * @property {ProductStatus | ''} [status]
 * @property {string} [sortBy='name']
 * @property {'asc' | 'desc'} [sortOrder='asc']
 */

/**
 * @typedef {Object} CategoryFilterParams
 * @property {number} [page=1]
 * @property {number} [pageSize=10]
 * @property {string} [search]
 * @property {CategoryStatus | ''} [status]
 */

/**
 * @typedef {Object} ProductFormData
 * @property {string} name
 * @property {string} sku
 * @property {string} category_id
 * @property {string} description
 * @property {ProductStatus} status
 */

/**
 * @typedef {Object} CategoryFormData
 * @property {string} name
 * @property {string} description
 * @property {CategoryStatus} status
 */

/**
 * @typedef {Object} PaginationMeta
 * @property {number} currentPage
 * @property {number} pageSize
 * @property {number} totalCount
 * @property {number} totalPages
 */

export {};
