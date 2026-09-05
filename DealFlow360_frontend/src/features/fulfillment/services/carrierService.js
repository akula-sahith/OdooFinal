/**
 * Carrier Management Service
 * Phase 13 — DealFlow360
 */

const STORAGE_KEY = 'dealflow360_carriers';

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

const getStoredCarriers = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CARRIERS));
    return INITIAL_CARRIERS;
  } catch (e) {
    return INITIAL_CARRIERS;
  }
};

const saveCarriers = (carriers) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carriers));
  } catch (e) {
    console.error('Failed to store carriers', e);
  }
};

export const carrierService = {
  getCarriers: async (params = {}) => {
    let carriers = getStoredCarriers();
    if (params.status) {
      carriers = carriers.filter((c) => c.status === params.status);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      carriers = carriers.filter(
        (c) => c.name.toLowerCase().includes(q) || c.carrierCode.toLowerCase().includes(q)
      );
    }
    return carriers;
  },

  getCarrierById: async (id) => {
    const carriers = getStoredCarriers();
    return carriers.find((c) => c.carrierId === id) || null;
  },

  createCarrier: async (data) => {
    const carriers = getStoredCarriers();
    const newCarrier = {
      carrierId: `CAR-${Math.floor(100 + Math.random() * 900)}`,
      carrierCode: (data.carrierCode || 'CUSTOM').toUpperCase().replace(/\s+/g, '_'),
      name: data.name,
      status: data.status || 'ACTIVE',
      trackingUrlTemplate: data.trackingUrlTemplate || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newCarrier, ...carriers];
    saveCarriers(updated);
    return newCarrier;
  },

  updateCarrier: async (id, data) => {
    const carriers = getStoredCarriers();
    const index = carriers.findIndex((c) => c.carrierId === id);
    if (index === -1) throw new Error('Carrier not found');

    const updatedCarrier = {
      ...carriers[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    carriers[index] = updatedCarrier;
    saveCarriers(carriers);
    return updatedCarrier;
  },

  updateCarrierStatus: async (id, status) => {
    return carrierService.updateCarrier(id, { status });
  },

  deleteCarrier: async (id, activeShipmentCount = 0) => {
    if (activeShipmentCount > 0) {
      throw new Error(`Cannot delete carrier ${id} because it is referenced by active shipments.`);
    }
    const carriers = getStoredCarriers();
    const filtered = carriers.filter((c) => c.carrierId !== id);
    saveCarriers(filtered);
    return true;
  },
};
