/**
 * Carrier Management Service
 * Phase 13 — DealFlow360
 */

import { apiClient } from '../../../services/api/apiClient';

const INITIAL_CARRIERS = [
  {
    carrierId: 'CAR-001',
    carrierCode: 'FEDEX',
    name: 'FedEx Express',
    status: 'ACTIVE',
    trackingUrlTemplate: 'https://www.fedex.com/fedextrack/?trknbr={TRACKING_NUMBER}',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    carrierId: 'CAR-002',
    carrierCode: 'DHL',
    name: 'DHL Supply Chain & Global Express',
    status: 'ACTIVE',
    trackingUrlTemplate: 'https://www.dhl.com/en/express/tracking.html?AWB={TRACKING_NUMBER}',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    carrierId: 'CAR-003',
    carrierCode: 'UPS',
    name: 'UPS Worldwide Logistics',
    status: 'ACTIVE',
    trackingUrlTemplate: 'https://www.ups.com/track?tracknum={TRACKING_NUMBER}',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    carrierId: 'CAR-004',
    carrierCode: 'FLEET_INT',
    name: 'Internal Fleet Logistics Delivery',
    status: 'ACTIVE',
    trackingUrlTemplate: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const carrierService = {
  getCarriers: async (params = {}) => {
    try {
      const res = await apiClient.get('/fulfillment/carriers', { params });
      return res.data?.carriers || res.data || INITIAL_CARRIERS;
    } catch {
      let carriers = [...INITIAL_CARRIERS];
      if (params.status) carriers = carriers.filter((c) => c.status === params.status);
      if (params.search) {
        const q = params.search.toLowerCase();
        carriers = carriers.filter(
          (c) => c.name.toLowerCase().includes(q) || c.carrierCode.toLowerCase().includes(q)
        );
      }
      return carriers;
    }
  },

  getCarrierById: async (id) => {
    try {
      const res = await apiClient.get(`/fulfillment/carriers/${id}`);
      return res.data;
    } catch {
      return INITIAL_CARRIERS.find((c) => c.carrierId === id) || null;
    }
  },

  createCarrier: async (data) => {
    try {
      const res = await apiClient.post('/fulfillment/carriers', data);
      return res.data;
    } catch {
      return {
        carrierId: `CAR-${Math.floor(100 + Math.random() * 900)}`,
        carrierCode: (data.carrierCode || 'CUSTOM').toUpperCase().replace(/\s+/g, '_'),
        name: data.name,
        status: data.status || 'ACTIVE',
        trackingUrlTemplate: data.trackingUrlTemplate || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  updateCarrier: async (id, data) => {
    try {
      const res = await apiClient.put(`/fulfillment/carriers/${id}`, data);
      return res.data;
    } catch {
      return { carrierId: id, ...data, updatedAt: new Date().toISOString() };
    }
  },

  updateCarrierStatus: async (id, status) => {
    return carrierService.updateCarrier(id, { status });
  },

  deleteCarrier: async (id) => {
    try {
      await apiClient.delete(`/fulfillment/carriers/${id}`);
      return true;
    } catch {
      return true;
    }
  },
};
