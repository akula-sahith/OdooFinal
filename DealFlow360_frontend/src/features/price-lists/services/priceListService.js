import { apiClient } from '../../../services/api/apiClient';

/**
 * Fallback preview stores for standalone UI preview when backend API is offline.
 */
let mockPriceLists = [
  {
    id: 'pl_01',
    name: 'Standard Global Price List 2026',
    code: 'PL-USD-2026',
    currency: 'USD',
    status: 'ACTIVE',
    effectiveFrom: '2026-01-01',
    effectiveTo: '2026-12-31',
    description: 'Standard USD base price list for global enterprise accounts.',
    itemCount: 3,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'pl_02',
    name: 'European Enterprise Price List',
    code: 'PL-EUR-2026',
    currency: 'EUR',
    status: 'ACTIVE',
    effectiveFrom: '2026-01-01',
    effectiveTo: '2026-12-31',
    description: 'Base price list for EU corporate customer accounts.',
    itemCount: 1,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'pl_03',
    name: 'India Commercial Wholesale Catalog',
    code: 'PL-INR-2026',
    currency: 'INR',
    status: 'INACTIVE',
    effectiveFrom: '2025-06-01',
    effectiveTo: '2026-06-01',
    description: 'Legacy pricing catalog for regional APAC partners.',
    itemCount: 0,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

let mockPriceListItems = {
  pl_01: [
    {
      id: 'pli_01',
      priceListId: 'pl_01',
      productId: 'prd_01',
      productName: 'Enterprise Rack Server X500',
      productSku: 'PRD-SRV-500',
      basePrice: 4999.0,
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'pli_02',
      priceListId: 'pl_01',
      productId: 'prd_02',
      productName: 'Cloud Security Suite Enterprise',
      productSku: 'PRD-SW-SEC',
      basePrice: 1200.0,
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'pli_03',
      priceListId: 'pl_01',
      productId: 'prd_03',
      productName: 'Managed Deployment & Integration',
      productSku: 'PRD-SVC-DEP',
      basePrice: 2500.0,
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
  ],
  pl_02: [
    {
      id: 'pli_04',
      priceListId: 'pl_02',
      productId: 'prd_01',
      productName: 'Enterprise Rack Server X500',
      productSku: 'PRD-SRV-500',
      basePrice: 4500.0,
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ],
  pl_03: [],
};

/**
 * Price List API Service
 * Centralized service layer for Price List and Base Pricing operations.
 * Communicates directly with backend endpoints via apiClient with preview fallback when offline.
 */
export const priceListService = {
  /**
   * Fetch paginated list of price lists.
   */
  async getPriceLists(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('limit', params.pageSize);
      if (params.search) queryParams.append('search', params.search);
      if (params.currency) queryParams.append('currency', params.currency);
      if (params.status) queryParams.append('status', params.status);
      if (params.sortBy) queryParams.append('sort_by', params.sortBy);
      if (params.sortOrder) queryParams.append('sort_order', params.sortOrder);

      const queryString = queryParams.toString();
      const endpoint = `/price-lists${queryString ? `?${queryString}` : ''}`;
      return await apiClient.get(endpoint);
    } catch (err) {
      console.warn('[priceListService] Backend API offline. Operating in preview mode.');
      return this.handleFallbackGetPriceLists(params);
    }
  },

  /**
   * Fetch single Price List record by ID.
   */
  async getPriceListById(id) {
    if (!id) throw new Error('Price list ID is required.');
    try {
      return await apiClient.get(`/price-lists/${id}`);
    } catch (err) {
      console.warn('[priceListService] Backend API offline. Operating in preview mode.');
      const record = mockPriceLists.find((pl) => pl.id === id);
      if (!record) {
        const error = new Error('Price list not found');
        error.status = 404;
        throw error;
      }
      const items = mockPriceListItems[id] || [];
      return {
        ...record,
        itemCount: items.length,
      };
    }
  },

  /**
   * Create a new Price List record.
   */
  async createPriceList(priceListData) {
    try {
      return await apiClient.post('/price-lists', priceListData);
    } catch (err) {
      console.warn('[priceListService] Backend API offline. Creating in preview store.');
      // Duplicate name / code check
      const duplicateCode = mockPriceLists.some(
        (pl) => pl.code.toLowerCase() === priceListData.code.trim().toLowerCase()
      );
      if (duplicateCode) {
        const error = new Error('A price list with this code already exists.');
        error.status = 409;
        error.errors = { code: 'Price list code must be unique.' };
        throw error;
      }

      const newRecord = {
        id: `pl_${Date.now()}`,
        name: priceListData.name.trim(),
        code: priceListData.code.trim().toUpperCase(),
        currency: priceListData.currency,
        status: priceListData.status || 'ACTIVE',
        effectiveFrom: priceListData.effectiveFrom || null,
        effectiveTo: priceListData.effectiveTo || null,
        description: priceListData.description?.trim() || '',
        itemCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockPriceLists.unshift(newRecord);
      mockPriceListItems[newRecord.id] = [];
      return newRecord;
    }
  },

  /**
   * Update an existing Price List record.
   */
  async updatePriceList(id, priceListData) {
    if (!id) throw new Error('Price list ID is required.');
    try {
      return await apiClient.put(`/price-lists/${id}`, priceListData);
    } catch (err) {
      console.warn('[priceListService] Backend API offline. Updating in preview store.');
      const index = mockPriceLists.findIndex((pl) => pl.id === id);
      if (index === -1) {
        const error = new Error('Price list not found');
        error.status = 404;
        throw error;
      }

      // Check unique code if updated
      if (priceListData.code) {
        const duplicateCode = mockPriceLists.some(
          (pl) => pl.id !== id && pl.code.toLowerCase() === priceListData.code.trim().toLowerCase()
        );
        if (duplicateCode) {
          const error = new Error('A price list with this code already exists.');
          error.status = 409;
          error.errors = { code: 'Price list code must be unique.' };
          throw error;
        }
      }

      const updatedRecord = {
        ...mockPriceLists[index],
        ...priceListData,
        updatedAt: new Date().toISOString(),
      };

      mockPriceLists[index] = updatedRecord;
      return updatedRecord;
    }
  },

  /**
   * Update Price List status (ACTIVE / INACTIVE).
   */
  async updatePriceListStatus(id, status) {
    if (!id) throw new Error('Price list ID is required.');
    try {
      return await apiClient.request(`/price-lists/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.warn('[priceListService] Backend API offline. Updating status in preview store.');
      const record = mockPriceLists.find((pl) => pl.id === id);
      if (!record) {
        const error = new Error('Price list not found');
        error.status = 404;
        throw error;
      }
      record.status = status;
      record.updatedAt = new Date().toISOString();
      return record;
    }
  },

  /**
   * Fetch item entries (product base prices) for a Price List.
   */
  async getPriceListItems(priceListId, params = {}) {
    if (!priceListId) throw new Error('Price list ID is required.');
    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      const queryString = queryParams.toString();
      const endpoint = `/price-lists/${priceListId}/items${queryString ? `?${queryString}` : ''}`;
      return await apiClient.get(endpoint);
    } catch (err) {
      console.warn('[priceListService] Backend API offline. Fetching items from preview store.');
      let items = mockPriceListItems[priceListId] || [];

      if (params.search) {
        const term = params.search.toLowerCase();
        items = items.filter(
          (item) =>
            item.productName.toLowerCase().includes(term) ||
            item.productSku.toLowerCase().includes(term)
        );
      }

      return {
        data: items,
        meta: {
          total: items.length,
          page: 1,
          limit: 50,
          totalPages: 1,
        },
      };
    }
  },

  /**
   * Add a product base price item entry to a Price List.
   */
  async addPriceListItem(priceListId, itemData) {
    if (!priceListId) throw new Error('Price list ID is required.');
    try {
      return await apiClient.post(`/price-lists/${priceListId}/items`, itemData);
    } catch (err) {
      console.warn('[priceListService] Backend API offline. Adding item in preview store.');
      const items = mockPriceListItems[priceListId] || [];

      const targetProductId = itemData.productId || itemData.product_id;
      const targetBasePrice = itemData.basePrice !== undefined ? itemData.basePrice : itemData.base_price;

      // Duplicate product check
      const duplicateProduct = items.some((i) => (i.productId || i.product_id) === targetProductId);
      if (duplicateProduct) {
        const error = new Error('This product is already included in this price list.');
        error.status = 409;
        throw error;
      }

      const newItem = {
        id: `pli_${Date.now()}`,
        priceListId,
        productId: targetProductId,
        productName: itemData.productName || 'Configured Product',
        productSku: itemData.productSku || 'PRD-CUSTOM',
        basePrice: parseFloat(targetBasePrice),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      items.unshift(newItem);
      mockPriceListItems[priceListId] = items;

      // Update itemCount on parent price list
      const parentList = mockPriceLists.find((pl) => pl.id === priceListId);
      if (parentList) {
        parentList.itemCount = items.length;
      }

      return newItem;
    }
  },

  /**
   * Update an existing item's base price in a Price List.
   */
  async updatePriceListItem(priceListId, itemId, itemData) {
    if (!priceListId || !itemId) throw new Error('Price list ID and Item ID are required.');
    try {
      return await apiClient.put(`/price-lists/${priceListId}/items/${itemId}`, itemData);
    } catch (err) {
      console.warn('[priceListService] Backend API offline. Updating item in preview store.');
      const items = mockPriceListItems[priceListId] || [];
      const item = items.find((i) => i.id === itemId);
      if (!item) {
        const error = new Error('Price list item not found.');
        error.status = 404;
        throw error;
      }

      const targetBasePrice = itemData.basePrice !== undefined ? itemData.basePrice : itemData.base_price;
      if (targetBasePrice !== undefined) {
        item.basePrice = parseFloat(targetBasePrice);
      }
      item.updatedAt = new Date().toISOString();
      return item;
    }
  },

  /**
   * Remove a product price item entry from a Price List.
   */
  async removePriceListItem(priceListId, itemId) {
    if (!priceListId || !itemId) throw new Error('Price list ID and Item ID are required.');
    try {
      return await apiClient.delete(`/price-lists/${priceListId}/items/${itemId}`);
    } catch (err) {
      console.warn('[priceListService] Backend API offline. Removing item from preview store.');
      let items = mockPriceListItems[priceListId] || [];
      items = items.filter((i) => i.id !== itemId);
      mockPriceListItems[priceListId] = items;

      // Update itemCount on parent price list
      const parentList = mockPriceLists.find((pl) => pl.id === priceListId);
      if (parentList) {
        parentList.itemCount = items.length;
      }
    }
  },

  /**
   * Internal helper for fallback listing query filtering and pagination.
   */
  handleFallbackGetPriceLists(params) {
    let filtered = [...mockPriceLists];

    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter(
        (pl) =>
          pl.name.toLowerCase().includes(term) ||
          pl.code.toLowerCase().includes(term) ||
          (pl.description && pl.description.toLowerCase().includes(term))
      );
    }

    if (params.currency && params.currency !== 'ALL') {
      filtered = filtered.filter((pl) => pl.currency === params.currency);
    }

    if (params.status && params.status !== 'ALL') {
      filtered = filtered.filter((pl) => pl.status === params.status);
    }

    const page = parseInt(params.page || 1, 10);
    const limit = parseInt(params.pageSize || 10, 10);
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      meta: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit) || 1,
      },
    };
  },
};

export default priceListService;
