import { apiClient } from '../../../services/api/apiClient';

/**
 * Price List API Service
 * Centralized service layer for Price List and Base Pricing operations.
 */
export const priceListService = {
  /**
   * Fetch paginated list of price lists.
   */
  async getPriceLists(params = {}) {
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
  },

  /**
   * Fetch single Price List record by ID.
   */
  async getPriceListById(id) {
    if (!id) throw new Error('Price list ID is required.');
    return await apiClient.get(`/price-lists/${id}`);
  },

  /**
   * Create a new Price List record.
   */
  async createPriceList(priceListData) {
    return await apiClient.post('/price-lists', priceListData);
  },

  /**
   * Update an existing Price List record.
   */
  async updatePriceList(id, priceListData) {
    if (!id) throw new Error('Price list ID is required.');
    return await apiClient.put(`/price-lists/${id}`, priceListData);
  },

  /**
   * Update Price List status (ACTIVE / INACTIVE).
   */
  async updatePriceListStatus(id, status) {
    if (!id) throw new Error('Price list ID is required.');
    return await apiClient.request(`/price-lists/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Fetch item entries (product base prices) for a Price List.
   */
  async getPriceListItems(priceListId, params = {}) {
    if (!priceListId) throw new Error('Price list ID is required.');
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    const queryString = queryParams.toString();
    const endpoint = `/price-lists/${priceListId}/items${queryString ? `?${queryString}` : ''}`;
    return await apiClient.get(endpoint);
  },

  /**
   * Add a product base price item entry to a Price List.
   */
  async addPriceListItem(priceListId, itemData) {
    if (!priceListId) throw new Error('Price list ID is required.');
    return await apiClient.post(`/price-lists/${priceListId}/items`, itemData);
  },

  /**
   * Update an existing item's base price in a Price List.
   */
  async updatePriceListItem(priceListId, itemId, itemData) {
    if (!priceListId || !itemId) throw new Error('Price list ID and Item ID are required.');
    return await apiClient.put(`/price-lists/${priceListId}/items/${itemId}`, itemData);
  },

  /**
   * Remove a product price item entry from a Price List.
   */
  async removePriceListItem(priceListId, itemId) {
    if (!priceListId || !itemId) throw new Error('Price list ID and Item ID are required.');
    return await apiClient.delete(`/price-lists/${priceListId}/items/${itemId}`);
  },
};

export default priceListService;

