/**
 * Centralized Fulfillment, Packing & Shipment Operational Service
 * Phase 13 — DealFlow360
 */

import { FULFILLMENT_STATUS, SHIPMENT_STATUS, PICK_LIST_STATUS, PACKAGE_STATUS } from '../types/fulfillmentTypes';
import {
  validatePickQuantity,
  validatePackageDimensions,
  validatePackageItemQuantity,
  validateShippingAddressSnapshot,
  validateFulfillmentStatusTransition,
  validateShipmentStatusTransition,
} from '../validation/fulfillmentValidation';

const FULFILLMENT_KEY = 'dealflow360_fulfillments';
const SHIPMENT_KEY = 'dealflow360_shipments';
const PICK_LIST_KEY = 'dealflow360_picklists';
const PACKAGE_KEY = 'dealflow360_packages';
const AUDIT_KEY = 'dealflow360_fulfillment_audit';

// Initial Sample Data for instant operational demonstration
const SEED_FULFILLMENTS = [
  {
    fulfillmentId: 'FUL-2026-001',
    orderId: 'ORD-2026-8912',
    customerName: 'Apex Global Logistics',
    customerId: 'CUST-001',
    status: FULFILLMENT_STATUS.READY,
    warehouseId: 'WH-MAIN-01',
    warehouseName: 'Central Industrial Warehouse',
    priority: 'HIGH',
    assignedTo: 'Marcus Vance (Warehouse Ops)',
    shippingAddress: {
      recipientName: 'Apex Logistics Receivings',
      companyName: 'Apex Global',
      addressLine1: '742 Commerce Blvd, Suite 400',
      addressLine2: 'Dock 12',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      postalCode: '60607',
      phone: '+1 (312) 555-0199',
    },
    items: [
      {
        itemId: 'FITEM-101',
        productId: 'PROD-001',
        productName: 'Enterprise Server Blade X9',
        sku: 'SKU-SRV-X9',
        orderedQuantity: 50,
        allocatedQuantity: 50,
        pickedQuantity: 0,
        packedQuantity: 0,
        shippedQuantity: 0,
        deliveredQuantity: 0,
        location: 'Aisle 4, Shelf B-12',
      },
      {
        itemId: 'FITEM-102',
        productId: 'PROD-002',
        productName: '100Gbps Fibre Channel Switch',
        sku: 'SKU-[#SW-100G]',
        orderedQuantity: 20,
        allocatedQuantity: 20,
        pickedQuantity: 0,
        packedQuantity: 0,
        shippedQuantity: 0,
        deliveredQuantity: 0,
        location: 'Aisle 2, Rack C-04',
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    fulfillmentId: 'FUL-2026-002',
    orderId: 'ORD-2026-4410',
    customerName: 'Titan Enterprise Tech',
    customerId: 'CUST-002',
    status: FULFILLMENT_STATUS.PACKED,
    warehouseId: 'WH-EAST-02',
    warehouseName: 'East Coast Distribution Center',
    priority: 'URGENT',
    assignedTo: 'Elena Rostova (Picker Lead)',
    shippingAddress: {
      recipientName: 'Titan Data Depot',
      companyName: 'Titan Enterprise Tech',
      addressLine1: '1200 Innovation Way',
      addressLine2: 'Building B',
      city: 'Boston',
      state: 'MA',
      country: 'USA',
      postalCode: '02110',
      phone: '+1 (617) 555-4321',
    },
    items: [
      {
        itemId: 'FITEM-201',
        productId: 'PROD-003',
        productName: 'Rack Cabinet 42U Heavy Duty',
        sku: 'SKU-RCK-42U',
        orderedQuantity: 10,
        allocatedQuantity: 10,
        pickedQuantity: 10,
        packedQuantity: 10,
        shippedQuantity: 0,
        deliveredQuantity: 0,
        location: 'Bay 9, Floor 1',
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

const SEED_PACKAGES = [
  {
    packageId: 'PKG-1001',
    fulfillmentId: 'FUL-2026-002',
    packageNumber: 'PKG-42U-CRATE-1',
    weight: 120.5,
    weightUnit: 'kg',
    length: 120,
    width: 80,
    height: 200,
    dimensionUnit: 'cm',
    status: PACKAGE_STATUS.PACKED,
    items: [
      {
        packageItemId: 'PKGI-2001',
        packageId: 'PKG-1001',
        fulfillmentItemId: 'FITEM-201',
        productId: 'PROD-003',
        quantity: 10,
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    packedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

const SEED_SHIPMENTS = [
  {
    shipmentId: 'SHP-2026-901',
    shipmentNumber: 'SHIP-FEDEX-901',
    fulfillmentId: 'FUL-2026-002',
    orderId: 'ORD-2026-4410',
    warehouseId: 'WH-EAST-02',
    carrierId: 'CAR-001',
    carrierCode: 'FEDEX',
    carrierName: 'FedEx Express',
    trackingNumber: 'FX-8829-1092-8821',
    status: SHIPMENT_STATUS.IN_TRANSIT,
    shippingAddress: {
      recipientName: 'Titan Data Depot',
      companyName: 'Titan Enterprise Tech',
      addressLine1: '1200 Innovation Way',
      addressLine2: 'Building B',
      city: 'Boston',
      state: 'MA',
      country: 'USA',
      postalCode: '02110',
      phone: '+1 (617) 555-4321',
    },
    shippedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    estimatedDeliveryAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    deliveredAt: null,
    history: [
      {
        status: SHIPMENT_STATUS.SHIPMENT_CREATED,
        timestamp: new Date(Date.now() - 3600000 * 16).toISOString(),
        actor: 'System Admin',
        notes: 'Shipment manifest created for FedEx Express pickup.',
      },
      {
        status: SHIPMENT_STATUS.SHIPPED,
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        actor: 'Dispatch Manager',
        notes: 'Package handed over to FedEx Courier at Dock 4.',
      },
      {
        status: SHIPMENT_STATUS.IN_TRANSIT,
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        actor: 'FedEx Carrier Webhook',
        notes: 'Departed Sorting Facility (Hub - Newark NJ).',
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 16).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

const SEED_AUDIT = [
  {
    auditId: 'AUD-001',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    action: 'FULFILLMENT_CREATED',
    fulfillmentId: 'FUL-2026-001',
    orderId: 'ORD-2026-8912',
    actor: 'Sales Order Processing',
    role: 'SYSTEM',
    details: 'Fulfillment order created from ALLOCATED inventory state.',
  },
];

// LocalStorage Helper Getters
const getStoredFulfillments = () => {
  try {
    const data = localStorage.getItem(FULFILLMENT_KEY);
    if (data) return JSON.parse(data);
    localStorage.setItem(FULFILLMENT_KEY, JSON.stringify(SEED_FULFILLMENTS));
    return SEED_FULFILLMENTS;
  } catch (e) {
    return SEED_FULFILLMENTS;
  }
};

const saveFulfillments = (data) => {
  try {
    localStorage.setItem(FULFILLMENT_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save fulfillments', e);
  }
};

const getStoredShipments = () => {
  try {
    const data = localStorage.getItem(SHIPMENT_KEY);
    if (data) return JSON.parse(data);
    localStorage.setItem(SHIPMENT_KEY, JSON.stringify(SEED_SHIPMENTS));
    return SEED_SHIPMENTS;
  } catch (e) {
    return SEED_SHIPMENTS;
  }
};

const saveShipments = (data) => {
  try {
    localStorage.setItem(SHIPMENT_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save shipments', e);
  }
};

const getStoredPackages = () => {
  try {
    const data = localStorage.getItem(PACKAGE_KEY);
    if (data) return JSON.parse(data);
    localStorage.setItem(PACKAGE_KEY, JSON.stringify(SEED_PACKAGES));
    return SEED_PACKAGES;
  } catch (e) {
    return SEED_PACKAGES;
  }
};

const savePackages = (data) => {
  try {
    localStorage.setItem(PACKAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save packages', e);
  }
};

const getStoredAuditLogs = () => {
  try {
    const data = localStorage.getItem(AUDIT_KEY);
    if (data) return JSON.parse(data);
    localStorage.setItem(AUDIT_KEY, JSON.stringify(SEED_AUDIT));
    return SEED_AUDIT;
  } catch (e) {
    return SEED_AUDIT;
  }
};

const logAudit = (action, fulfillmentId, orderId, actor, details = '', shipmentId = null) => {
  const logs = getStoredAuditLogs();
  const entry = {
    auditId: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    action,
    fulfillmentId,
    orderId,
    shipmentId,
    actor: actor || 'Operational User',
    details,
  };
  const updated = [entry, ...logs];
  try {
    localStorage.setItem(AUDIT_KEY, JSON.stringify(updated));
  } catch (e) {
    // ignore
  }
  return entry;
};

// Exported Fulfillment Service
export const fulfillmentService = {
  // 1. Query Fulfillments
  getFulfillments: async (params = {}) => {
    let list = getStoredFulfillments();
    if (params.status) {
      list = list.filter((f) => f.status === params.status);
    }
    if (params.warehouseId) {
      list = list.filter((f) => f.warehouseId === params.warehouseId);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (f) =>
          f.fulfillmentId.toLowerCase().includes(q) ||
          f.orderId.toLowerCase().includes(q) ||
          f.customerName.toLowerCase().includes(q)
      );
    }
    return list;
  },

  getFulfillmentById: async (fulfillmentId) => {
    const list = getStoredFulfillments();
    return list.find((f) => f.fulfillmentId === fulfillmentId) || null;
  },

  // 2. Fulfillment Creation from Order
  createFulfillment: async (orderData) => {
    if (!orderData || !orderData.id) {
      throw new Error('Order details are required to create a fulfillment.');
    }
    const list = getStoredFulfillments();
    const existing = list.find((f) => f.orderId === orderData.id && f.status !== FULFILLMENT_STATUS.CANCELLED);
    if (existing) {
      return existing; // Idempotency check
    }

    const newFulfillment = {
      fulfillmentId: `FUL-2026-${Math.floor(100 + Math.random() * 900)}`,
      orderId: orderData.id,
      customerName: orderData.customerName || orderData.clientName || 'Customer Account',
      customerId: orderData.customerId || 'CUST-GENERIC',
      status: FULFILLMENT_STATUS.READY,
      warehouseId: orderData.warehouseId || 'WH-MAIN-01',
      warehouseName: orderData.warehouseName || 'Central Industrial Warehouse',
      priority: orderData.priority || 'NORMAL',
      assignedTo: orderData.assignedTo || 'Unassigned Picker',
      shippingAddress: orderData.shippingAddress || {
        recipientName: orderData.customerName || 'Customer Recipient',
        companyName: orderData.customerName || 'Enterprise Account',
        addressLine1: '100 Industrial Parkway',
        addressLine2: '',
        city: 'Dallas',
        state: 'TX',
        country: 'USA',
        postalCode: '75201',
        phone: '+1 (214) 555-0188',
      },
      items: (orderData.items || [
        {
          productId: 'PROD-001',
          productName: 'Industrial Controller Unit M3',
          sku: 'SKU-MCU-03',
          orderedQuantity: 25,
          allocatedQuantity: 25,
          location: 'Aisle 1, Bin 10',
        },
      ]).map((item, idx) => ({
        itemId: `FITEM-${Date.now()}-${idx}`,
        productId: item.productId || `PROD-${idx + 1}`,
        productName: item.productName || item.name || `Line Item ${idx + 1}`,
        sku: item.sku || `SKU-${idx + 1}`,
        orderedQuantity: Number(item.orderedQuantity || item.quantity || 10),
        allocatedQuantity: Number(item.allocatedQuantity || item.quantity || 10),
        pickedQuantity: 0,
        packedQuantity: 0,
        shippedQuantity: 0,
        deliveredQuantity: 0,
        location: item.location || 'Bin A-1',
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newFulfillment, ...list];
    saveFulfillments(updated);
    logAudit('FULFILLMENT_CREATED', newFulfillment.fulfillmentId, newFulfillment.orderId, 'Operations Team');
    return newFulfillment;
  },

  // 3. Picking Operations
  startPicking: async (fulfillmentId, user = 'Ops Picker') => {
    const list = getStoredFulfillments();
    const index = list.findIndex((f) => f.fulfillmentId === fulfillmentId);
    if (index === -1) throw new Error('Fulfillment record not found.');

    const f = list[index];
    const check = validateFulfillmentStatusTransition(f.status, FULFILLMENT_STATUS.PICKING);
    if (!check.isValid) throw new Error(check.error);

    f.status = FULFILLMENT_STATUS.PICKING;
    f.startedAt = f.startedAt || new Date().toISOString();
    f.updatedAt = new Date().toISOString();
    list[index] = f;
    saveFulfillments(list);

    logAudit('PICK_STARTED', fulfillmentId, f.orderId, user, 'Picker initiated item retrieval.');
    return f;
  },

  pickItem: async (fulfillmentId, itemId, quantityToPick, user = 'Ops Picker') => {
    const list = getStoredFulfillments();
    const index = list.findIndex((f) => f.fulfillmentId === fulfillmentId);
    if (index === -1) throw new Error('Fulfillment record not found.');

    const f = list[index];
    const item = f.items.find((i) => i.itemId === itemId);
    if (!item) throw new Error('Fulfillment line item not found.');

    const remainingToPick = item.allocatedQuantity - item.pickedQuantity;
    const check = validatePickQuantity(quantityToPick, item.allocatedQuantity, remainingToPick);
    if (!check.isValid) throw new Error(check.errors.join(' '));

    item.pickedQuantity += Number(quantityToPick);
    f.updatedAt = new Date().toISOString();
    list[index] = f;
    saveFulfillments(list);

    logAudit(
      'ITEM_PICKED',
      fulfillmentId,
      f.orderId,
      user,
      `Picked ${quantityToPick} units of ${item.productName} (${item.sku}). Total picked: ${item.pickedQuantity}/${item.allocatedQuantity}.`
    );
    return f;
  },

  completePicking: async (fulfillmentId, user = 'Ops Picker') => {
    const list = getStoredFulfillments();
    const index = list.findIndex((f) => f.fulfillmentId === fulfillmentId);
    if (index === -1) throw new Error('Fulfillment record not found.');

    const f = list[index];

    // Ensure all items picked
    const unpicked = f.items.some((i) => i.pickedQuantity < i.allocatedQuantity);
    if (unpicked) {
      throw new Error('All allocated item quantities must be picked before completing picking.');
    }

    const check = validateFulfillmentStatusTransition(f.status, FULFILLMENT_STATUS.PICKED);
    if (!check.isValid) throw new Error(check.error);

    f.status = FULFILLMENT_STATUS.PICKED;
    f.updatedAt = new Date().toISOString();
    list[index] = f;
    saveFulfillments(list);

    logAudit('PICK_COMPLETED', fulfillmentId, f.orderId, user, 'All line items successfully picked and validated.');
    return f;
  },

  // 4. Packing Operations
  startPacking: async (fulfillmentId, user = 'Packing Ops') => {
    const list = getStoredFulfillments();
    const index = list.findIndex((f) => f.fulfillmentId === fulfillmentId);
    if (index === -1) throw new Error('Fulfillment record not found.');

    const f = list[index];
    const check = validateFulfillmentStatusTransition(f.status, FULFILLMENT_STATUS.PACKING);
    if (!check.isValid) throw new Error(check.error);

    f.status = FULFILLMENT_STATUS.PACKING;
    f.updatedAt = new Date().toISOString();
    list[index] = f;
    saveFulfillments(list);

    logAudit('PACK_STARTED', fulfillmentId, f.orderId, user, 'Packing station initiated container packing.');
    return f;
  },

  getPackagesByFulfillmentId: async (fulfillmentId) => {
    const pkgs = getStoredPackages();
    return pkgs.filter((p) => p.fulfillmentId === fulfillmentId && p.status !== PACKAGE_STATUS.CANCELLED);
  },

  createPackage: async (fulfillmentId, packageData, user = 'Packing Ops') => {
    const dimCheck = validatePackageDimensions(packageData);
    if (!dimCheck.isValid) throw new Error(dimCheck.errors.join(' '));

    const packages = getStoredPackages();
    const fulfillments = getStoredFulfillments();
    const f = fulfillments.find((x) => x.fulfillmentId === fulfillmentId);
    if (!f) throw new Error('Fulfillment order not found.');

    const newPackage = {
      packageId: `PKG-${Date.now()}-${Math.floor(Math.random() * 100)}`,
      fulfillmentId,
      packageNumber: packageData.packageNumber.trim(),
      weight: Number(packageData.weight),
      weightUnit: packageData.weightUnit || 'kg',
      length: Number(packageData.length),
      width: Number(packageData.width),
      height: Number(packageData.height),
      dimensionUnit: packageData.dimensionUnit || 'cm',
      notes: packageData.notes || '',
      status: PACKAGE_STATUS.PACKED,
      items: packageData.items || [],
      createdAt: new Date().toISOString(),
      packedAt: new Date().toISOString(),
    };

    // Update packedQuantity on fulfillment items
    if (packageData.items && packageData.items.length > 0) {
      packageData.items.forEach((pItem) => {
        const fItem = f.items.find((i) => i.itemId === pItem.fulfillmentItemId || i.productId === pItem.productId);
        if (fItem) {
          const itemCheck = validatePackageItemQuantity(pItem.quantity, fItem.pickedQuantity - fItem.packedQuantity);
          if (!itemCheck.isValid) throw new Error(itemCheck.errors.join(' '));
          fItem.packedQuantity += Number(pItem.quantity);
        }
      });
      f.updatedAt = new Date().toISOString();
      saveFulfillments(fulfillments);
    }

    const updatedPkgs = [newPackage, ...packages];
    savePackages(updatedPkgs);

    logAudit('PACKAGE_CREATED', fulfillmentId, f.orderId, user, `Package ${newPackage.packageNumber} created (${newPackage.weight} ${newPackage.weightUnit}).`);
    return newPackage;
  },

  completePacking: async (fulfillmentId, user = 'Packing Ops') => {
    const list = getStoredFulfillments();
    const index = list.findIndex((f) => f.fulfillmentId === fulfillmentId);
    if (index === -1) throw new Error('Fulfillment record not found.');

    const f = list[index];

    // Ensure all picked items are assigned to packages
    const unpacked = f.items.some((i) => i.packedQuantity < i.pickedQuantity);
    if (unpacked) {
      throw new Error('All picked items must be assigned to packages before completing packing.');
    }

    const check = validateFulfillmentStatusTransition(f.status, FULFILLMENT_STATUS.PACKED);
    if (!check.isValid) throw new Error(check.error);

    f.status = FULFILLMENT_STATUS.PACKED;
    f.updatedAt = new Date().toISOString();
    list[index] = f;
    saveFulfillments(list);

    logAudit('PACKAGE_PACKED', fulfillmentId, f.orderId, user, 'All packages sealed and ready for dispatch manifest creation.');
    return f;
  },

  // 5. Shipment Operations
  getShipments: async (params = {}) => {
    let shipments = getStoredShipments();
    if (params.status) {
      shipments = shipments.filter((s) => s.status === params.status);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      shipments = shipments.filter(
        (s) =>
          s.shipmentId.toLowerCase().includes(q) ||
          s.trackingNumber.toLowerCase().includes(q) ||
          s.orderId.toLowerCase().includes(q) ||
          s.shippingAddress.recipientName.toLowerCase().includes(q)
      );
    }
    return shipments;
  },

  getShipmentById: async (shipmentId) => {
    const shipments = getStoredShipments();
    return shipments.find((s) => s.shipmentId === shipmentId) || null;
  },

  getShipmentByOrderId: async (orderId) => {
    const shipments = getStoredShipments();
    return shipments.filter((s) => s.orderId === orderId);
  },

  createShipment: async (fulfillmentId, shipmentData, user = 'Logistics Lead') => {
    const list = getStoredFulfillments();
    const fIndex = list.findIndex((f) => f.fulfillmentId === fulfillmentId);
    if (fIndex === -1) throw new Error('Fulfillment record not found.');

    const f = list[fIndex];
    if (f.status !== FULFILLMENT_STATUS.PACKED && f.status !== FULFILLMENT_STATUS.SHIPMENT_CREATED) {
      throw new Error('Shipment cannot be created until fulfillment state is PACKED.');
    }

    // Check address snapshot
    const addrCheck = validateShippingAddressSnapshot(shipmentData.shippingAddress || f.shippingAddress);
    if (!addrCheck.isValid) throw new Error(addrCheck.errors.join(' '));

    const shipments = getStoredShipments();
    // Prevent duplicate active shipment for same fulfillment if single-shipment
    const existing = shipments.find((s) => s.fulfillmentId === fulfillmentId && s.status !== SHIPMENT_STATUS.CANCELLED);
    if (existing) {
      return existing; // Idempotent return
    }

    const tracking = shipmentData.trackingNumber || `DF360-TRK-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newShipment = {
      shipmentId: `SHP-2026-${Math.floor(100 + Math.random() * 900)}`,
      shipmentNumber: `SHIP-${shipmentData.carrierCode || 'CAR'}-${Math.floor(1000 + Math.random() * 9000)}`,
      fulfillmentId,
      orderId: f.orderId,
      warehouseId: f.warehouseId,
      carrierId: shipmentData.carrierId || 'CAR-001',
      carrierCode: shipmentData.carrierCode || 'FEDEX',
      carrierName: shipmentData.carrierName || 'FedEx Express',
      trackingNumber: tracking,
      shippingAddress: { ...(shipmentData.shippingAddress || f.shippingAddress) }, // SNAPSHOT Address
      status: SHIPMENT_STATUS.SHIPMENT_CREATED,
      shippedAt: null,
      estimatedDeliveryAt: shipmentData.estimatedDeliveryAt || new Date(Date.now() + 86400000 * 3).toISOString(),
      deliveredAt: null,
      history: [
        {
          status: SHIPMENT_STATUS.SHIPMENT_CREATED,
          timestamp: new Date().toISOString(),
          actor: user,
          notes: `Shipment label & tracking manifest generated (${tracking}).`,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update fulfillment status to SHIPMENT_CREATED
    f.status = FULFILLMENT_STATUS.SHIPMENT_CREATED;
    f.updatedAt = new Date().toISOString();
    list[fIndex] = f;
    saveFulfillments(list);

    const updatedShipments = [newShipment, ...shipments];
    saveShipments(updatedShipments);

    logAudit(
      'SHIPMENT_CREATED',
      fulfillmentId,
      f.orderId,
      user,
      `Shipment manifest ${newShipment.shipmentNumber} created with tracking #${tracking}.`,
      newShipment.shipmentId
    );
    return newShipment;
  },

  shipShipment: async (shipmentId, user = 'Dispatch Lead') => {
    const shipments = getStoredShipments();
    const index = shipments.findIndex((s) => s.shipmentId === shipmentId);
    if (index === -1) throw new Error('Shipment record not found.');

    const s = shipments[index];
    const check = validateShipmentStatusTransition(s.status, SHIPMENT_STATUS.SHIPPED);
    if (!check.isValid) throw new Error(check.error);

    s.status = SHIPMENT_STATUS.SHIPPED;
    s.shippedAt = new Date().toISOString();
    s.updatedAt = new Date().toISOString();
    s.history.push({
      status: SHIPMENT_STATUS.SHIPPED,
      timestamp: new Date().toISOString(),
      actor: user,
      notes: 'Carrier pickup complete. Handed over to shipping provider.',
    });

    shipments[index] = s;
    saveShipments(shipments);

    // Update fulfillment shipped quantity
    const list = getStoredFulfillments();
    const f = list.find((x) => x.fulfillmentId === s.fulfillmentId);
    if (f) {
      f.items.forEach((i) => {
        i.shippedQuantity = i.packedQuantity;
      });
      f.updatedAt = new Date().toISOString();
      saveFulfillments(list);
    }

    logAudit('SHIPMENT_SHIPPED', s.fulfillmentId, s.orderId, user, `Shipment dispatched via carrier ${s.carrierName}.`, s.shipmentId);
    return s;
  },

  updateShipmentStatus: async (shipmentId, targetStatus, notes = '', user = 'Carrier Integration') => {
    const shipments = getStoredShipments();
    const index = shipments.findIndex((s) => s.shipmentId === shipmentId);
    if (index === -1) throw new Error('Shipment record not found.');

    const s = shipments[index];
    const check = validateShipmentStatusTransition(s.status, targetStatus);
    if (!check.isValid) throw new Error(check.error);

    s.status = targetStatus;
    s.updatedAt = new Date().toISOString();
    if (targetStatus === SHIPMENT_STATUS.DELIVERED) {
      s.deliveredAt = new Date().toISOString();
    }

    s.history.push({
      status: targetStatus,
      timestamp: new Date().toISOString(),
      actor: user,
      notes: notes || `Shipment transition to ${targetStatus}.`,
    });

    shipments[index] = s;
    saveShipments(shipments);

    // Update fulfillment state if delivered
    const list = getStoredFulfillments();
    const f = list.find((x) => x.fulfillmentId === s.fulfillmentId);
    if (f) {
      if (targetStatus === SHIPMENT_STATUS.DELIVERED) {
        f.items.forEach((i) => {
          i.deliveredQuantity = i.shippedQuantity;
        });
        f.status = FULFILLMENT_STATUS.COMPLETED;
        f.completedAt = new Date().toISOString();
      }
      f.updatedAt = new Date().toISOString();
      saveFulfillments(list);
    }

    let auditAction = `SHIPMENT_${targetStatus}`;
    if (targetStatus === SHIPMENT_STATUS.DELIVERY_FAILED) auditAction = 'DELIVERY_FAILED';
    if (targetStatus === SHIPMENT_STATUS.RETURNED) auditAction = 'SHIPMENT_RETURNED';

    logAudit(auditAction, s.fulfillmentId, s.orderId, user, notes || `Shipment reached status ${targetStatus}`, s.shipmentId);
    return s;
  },

  getAuditTrail: async (fulfillmentId = null) => {
    const logs = getStoredAuditLogs();
    if (fulfillmentId) {
      return logs.filter((l) => l.fulfillmentId === fulfillmentId);
    }
    return logs;
  },
};
