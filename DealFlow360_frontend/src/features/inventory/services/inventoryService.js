import { apiClient } from '../../../services/api/apiClient';
import {
  calculateAvailableQuantity,
  calculateInventoryStatus,
  MOVEMENT_TYPE,
  RESERVATION_STATUS,
  ALLOCATION_STATUS,
  TRANSFER_STATUS,
  INVENTORY_READINESS_STATUS,
} from '../types/inventoryTypes';
import {
  validateStockAdjustment,
  validateStockReservation,
  validateStockTransfer,
} from '../validation/inventoryValidation';

export const inventoryService = {
  /**
   * Fetch list of inventory stock records.
   */
  async getInventory(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('limit', params.pageSize);
    if (params.search) queryParams.append('search', params.search);
    if (params.warehouseId) queryParams.append('warehouseId', params.warehouseId);
    if (params.status) queryParams.append('status', params.status);

    const res = await apiClient.get(`/inventory?${queryParams.toString()}`);
    return Array.isArray(res) ? { data: res, meta: { total: res.length, page: 1, limit: res.length, totalPages: 1 } } : res;
  },

  /**
   * Fetch stock records for a specific product across all warehouses.
   */
  async getInventoryByProduct(productId) {
    if (!productId) throw new Error('Product ID is required.');
    return await apiClient.get(`/inventory/product/${productId}`);
  },

  /**
   * Adjust physical stock quantity.
   */
  async adjustStock(data) {
    const validation = validateStockAdjustment(data);
    if (!validation.isValid) throw new Error(validation.error);
    return await apiClient.post('/inventory/adjustments', data);
  },

  /**
   * Fetch inventory movement audit ledger.
   */
  async getInventoryMovements(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('limit', params.pageSize);
    if (params.search) queryParams.append('search', params.search);
    if (params.movementType) queryParams.append('movementType', params.movementType);
    if (params.warehouseId) queryParams.append('warehouseId', params.warehouseId);

    const res = await apiClient.get(`/inventory/movements?${queryParams.toString()}`);
    return Array.isArray(res) ? { data: res, meta: { total: res.length, page: 1, limit: res.length, totalPages: 1 } } : res;
  },

  /**
   * Check stock availability for an Order.
   */
  async checkOrderInventory(orderData) {
    if (!orderData) throw new Error('Order data is required for inventory check.');
    return await apiClient.post(`/orders/${orderData.id || orderData.orderId}/inventory-check`, orderData);
  },

  /**
   * Reserve stock for an Order from a selected warehouse.
   */
  async reserveInventory(orderId, reservationData = {}) {
    if (!orderId) throw new Error('Order ID is required.');
    return await apiClient.post('/inventory/reserve', { orderId, ...reservationData });
  },

  /**
   * Release an active stock reservation.
   */
  async releaseReservation(reservationId) {
    if (!reservationId) throw new Error('Reservation ID is required.');
    return await apiClient.post(`/inventory/reservations/${reservationId}/release`);
  },

  /**
   * Warehouse-to-Warehouse Stock Transfer.
   */
  async transferInventory(data) {
    const validation = validateStockTransfer(data);
    if (!validation.isValid) throw new Error(validation.error);
    return await apiClient.post('/inventory/transfers', data);
  },
};
