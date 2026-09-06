import { apiClient } from '../../../services/api/apiClient';

export const fulfillmentService = {
  /**
   * Fetch fulfillment orders for an order.
   */
  async getFulfillmentOrdersByOrderId(orderId) {
    if (!orderId) throw new Error('Order ID is required.');
    return await apiClient.get(`/fulfillment/orders/${orderId}`);
  },

  /**
   * Fetch warehouse splits for a fulfillment order.
   */
  async getSplitsByFulfillmentOrderId(fulfillmentOrderId) {
    if (!fulfillmentOrderId) throw new Error('Fulfillment Order ID is required.');
    return await apiClient.get(`/fulfillment/splits/${fulfillmentOrderId}`);
  },

  /**
   * Process fulfillment split for an order.
   */
  async processFulfillment(orderId) {
    if (!orderId) throw new Error('Order ID is required.');
    return await apiClient.post(`/fulfillment/process/${orderId}`);
  },

  /**
   * Fetch all shipments / orders.
   */
  async getShipments() {
    return await apiClient.get('/orders');
  },
};

export default fulfillmentService;

