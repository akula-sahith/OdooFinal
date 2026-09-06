import { apiFetch } from './client';

export const fulfillmentApi = {
  getFulfillmentOrdersByOrderId: async (orderId) => {
    return await apiFetch(`/api/fulfillment/orders/${orderId}`);
  },

  getSplitsByFulfillmentOrderId: async (fulfillmentOrderId) => {
    return await apiFetch(`/api/fulfillment/splits/${fulfillmentOrderId}`);
  },

  processFulfillment: async (orderId) => {
    return await apiFetch(`/api/fulfillment/process/${orderId}`, {
      method: 'POST',
    });
  },

  getAllWarehouses: async () => {
    return await apiFetch('/api/warehouses');
  },

  createWarehouse: async (warehouseData) => {
    return await apiFetch('/api/warehouses', {
      method: 'POST',
      body: JSON.stringify(warehouseData),
    });
  },

  getAllStock: async () => {
    return await apiFetch('/api/inventory');
  },

  getStockByProductId: async (productId) => {
    return await apiFetch(`/api/inventory/product/${productId}`);
  },

  adjustStock: async (warehouseId, productId, quantityChange) => {
    return await apiFetch('/api/inventory/adjustments', {
      method: 'POST',
      body: JSON.stringify({
        warehouseId: Number(warehouseId),
        productId: Number(productId),
        quantityChange: Number(quantityChange),
      }),
    });
  },
};
