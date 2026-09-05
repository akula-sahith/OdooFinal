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

/**
 * Preview store for Master Inventory Records.
 * References existing products (PROD-001, PROD-002, PROD-003, PROD-004).
 */
let mockInventoryRecords = [
  {
    inventoryId: 'inv_101',
    warehouseId: 'WH-VJA-01',
    warehouseCode: 'WH-VJA-01',
    warehouseName: 'Vijayawada Central Logistics Hub',
    productId: 'PROD-001',
    productName: 'Enterprise Server Rack Tier 4',
    sku: 'SKU-SRV-001',
    category: 'Hardware Infrastructure',
    onHandQuantity: 120,
    reservedQuantity: 20,
    availableQuantity: 100,
    reorderLevel: 15,
    status: 'IN_STOCK',
    updatedAt: '2026-09-05T12:00:00.000Z',
  },
  {
    inventoryId: 'inv_102',
    warehouseId: 'WH-HYD-01',
    warehouseCode: 'WH-HYD-01',
    warehouseName: 'Hyderabad Cyberabad Tech Depot',
    productId: 'PROD-001',
    productName: 'Enterprise Server Rack Tier 4',
    sku: 'SKU-SRV-001',
    category: 'Hardware Infrastructure',
    onHandQuantity: 45,
    reservedQuantity: 10,
    availableQuantity: 35,
    reorderLevel: 15,
    status: 'IN_STOCK',
    updatedAt: '2026-09-05T12:00:00.000Z',
  },
  {
    inventoryId: 'inv_103',
    warehouseId: 'WH-VJA-01',
    warehouseCode: 'WH-VJA-01',
    warehouseName: 'Vijayawada Central Logistics Hub',
    productId: 'PROD-002',
    productName: 'Workstation Pro Ultra X9',
    sku: 'SKU-WKS-002',
    category: 'Hardware',
    onHandQuantity: 8,
    reservedQuantity: 0,
    availableQuantity: 8,
    reorderLevel: 10,
    status: 'LOW_STOCK',
    updatedAt: '2026-09-05T12:00:00.000Z',
  },
  {
    inventoryId: 'inv_104',
    warehouseId: 'WH-HYD-01',
    warehouseCode: 'WH-HYD-01',
    warehouseName: 'Hyderabad Cyberabad Tech Depot',
    productId: 'PROD-003',
    productName: 'Managed Fiber Router Array',
    sku: 'SKU-[#714B67]-003',
    category: 'Networking',
    onHandQuantity: 0,
    reservedQuantity: 0,
    availableQuantity: 0,
    reorderLevel: 5,
    status: 'OUT_OF_STOCK',
    updatedAt: '2026-09-05T12:00:00.000Z',
  },
  {
    inventoryId: 'inv_105',
    warehouseId: 'WH-VJA-01',
    warehouseCode: 'WH-VJA-01',
    warehouseName: 'Vijayawada Central Logistics Hub',
    productId: 'PROD-004',
    productName: 'Rugged Handheld Barcode Scanner X-200',
    sku: 'SKU-SCN-004',
    category: 'Peripherals',
    onHandQuantity: 250,
    reservedQuantity: 50,
    availableQuantity: 200,
    reorderLevel: 30,
    status: 'IN_STOCK',
    updatedAt: '2026-09-05T12:00:00.000Z',
  },
];

/**
 * Movement Ledger Preview Store.
 */
let mockMovements = [
  {
    movementId: 'mov_901',
    warehouseId: 'WH-VJA-01',
    warehouseCode: 'WH-VJA-01',
    productId: 'PROD-001',
    productName: 'Enterprise Server Rack Tier 4',
    sku: 'SKU-SRV-001',
    movementType: MOVEMENT_TYPE.STOCK_RECEIPT,
    quantity: 120,
    beforeQuantity: 0,
    afterQuantity: 120,
    referenceType: 'PURCHASE_ORDER',
    referenceId: 'PO-2026-001',
    reason: 'Initial warehouse stock receipt',
    actorName: 'Operations Lead',
    createdAt: '2026-09-04T10:00:00.000Z',
  },
  {
    movementId: 'mov_902',
    warehouseId: 'WH-VJA-01',
    warehouseCode: 'WH-VJA-01',
    productId: 'PROD-001',
    productName: 'Enterprise Server Rack Tier 4',
    sku: 'SKU-SRV-001',
    movementType: MOVEMENT_TYPE.STOCK_RESERVATION,
    quantity: 20,
    beforeQuantity: 120,
    afterQuantity: 120,
    referenceType: 'ORDER',
    referenceId: 'ORD-2026-1001',
    reason: 'Order stock reservation',
    actorName: 'Sales Representative',
    createdAt: '2026-09-05T11:00:00.000Z',
  },
];

/**
 * Reservation Preview Store.
 */
let mockReservations = [];

/**
 * Inventory API Service
 */
export const inventoryService = {
  /**
   * Fetch paginated list of inventory stock records.
   */
  async getInventory(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('limit', params.pageSize);
      if (params.search) queryParams.append('search', params.search);
      if (params.warehouseId) queryParams.append('warehouseId', params.warehouseId);
      if (params.status) queryParams.append('status', params.status);

      return await apiClient.get(`/company/inventory/stock?${queryParams.toString()}`);
    } catch (err) {
      console.warn('[inventoryService] Backend API offline. Returning preview inventory stock.');
      return this.handleFallbackGetInventory(params);
    }
  },

  /**
   * Fetch stock records for a specific product across all warehouses.
   */
  async getInventoryByProduct(productId) {
    if (!productId) throw new Error('Product ID is required.');
    try {
      return await apiClient.get(`/company/inventory/product/${productId}`);
    } catch (err) {
      return mockInventoryRecords.filter((r) => r.productId === productId);
    }
  },

  /**
   * Adjust physical stock quantity (creates an auditable movement).
   */
  async adjustStock(data) {
    const validation = validateStockAdjustment(data);
    if (!validation.isValid) throw new Error(validation.error);

    try {
      return await apiClient.post('/company/inventory/adjustments', data);
    } catch (err) {
      console.warn('[inventoryService] Backend API offline. Processing stock adjustment in preview store.');

      const recordIndex = mockInventoryRecords.findIndex(
        (r) => r.productId === data.productId && (r.warehouseId === data.warehouseId || r.warehouseCode === data.warehouseId)
      );

      if (recordIndex === -1) {
        throw new Error('No inventory record found for the specified product and warehouse.');
      }

      const existing = mockInventoryRecords[recordIndex];
      const change = Number(data.quantityChange);
      const beforeQty = existing.onHandQuantity;
      const newOnHand = Math.max(0, beforeQty + change);
      const newAvailable = calculateAvailableQuantity(newOnHand, existing.reservedQuantity);
      const newStatus = calculateInventoryStatus(newOnHand, existing.reorderLevel);

      const updatedRecord = {
        ...existing,
        onHandQuantity: newOnHand,
        availableQuantity: newAvailable,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };

      mockInventoryRecords[recordIndex] = updatedRecord;

      // Append auditable movement record
      const movement = {
        movementId: `mov_${Date.now()}`,
        warehouseId: existing.warehouseId,
        warehouseCode: existing.warehouseCode,
        productId: existing.productId,
        productName: existing.productName,
        sku: existing.sku,
        movementType: MOVEMENT_TYPE.STOCK_ADJUSTMENT,
        quantity: change,
        beforeQuantity: beforeQty,
        afterQuantity: newOnHand,
        referenceType: 'MANUAL_ADJUSTMENT',
        referenceId: data.reference || `ADJ-${Date.now()}`,
        reason: data.reason.trim(),
        actorName: 'Authorized Operator',
        createdAt: new Date().toISOString(),
      };

      mockMovements.unshift(movement);
      return { record: updatedRecord, movement };
    }
  },

  /**
   * Fetch inventory movement audit ledger.
   */
  async getInventoryMovements(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('limit', params.pageSize);
      if (params.search) queryParams.append('search', params.search);
      if (params.movementType) queryParams.append('movementType', params.movementType);
      if (params.warehouseId) queryParams.append('warehouseId', params.warehouseId);

      return await apiClient.get(`/company/inventory/movements?${queryParams.toString()}`);
    } catch (err) {
      let list = [...mockMovements];
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (m) =>
            m.productName.toLowerCase().includes(q) ||
            m.sku.toLowerCase().includes(q) ||
            m.reason.toLowerCase().includes(q)
        );
      }
      if (params.movementType && params.movementType !== 'ALL') {
        list = list.filter((m) => m.movementType === params.movementType);
      }

      const page = parseInt(params.page || 1, 10);
      const limit = parseInt(params.pageSize || 10, 10);
      const startIndex = (page - 1) * limit;

      return {
        data: list.slice(startIndex, startIndex + limit),
        meta: {
          total: list.length,
          page,
          limit,
          totalPages: Math.ceil(list.length / limit) || 1,
        },
      };
    }
  },

  /**
   * Check stock availability for an Order.
   */
  async checkOrderInventory(orderData) {
    if (!orderData) throw new Error('Order data is required for inventory check.');

    try {
      return await apiClient.post(`/company/orders/${orderData.id || orderData.orderId}/inventory-check`, orderData);
    } catch (err) {
      console.warn('[inventoryService] Backend API offline. Evaluating order stock availability locally.');

      const items = orderData.items || orderData.lineItems || [
        { productId: 'PROD-001', productName: 'Enterprise Server Rack Tier 4', quantity: 10 },
      ];

      const availabilityReport = items.map((item) => {
        const reqQty = Number(item.quantity || 1);
        const matchingRecords = mockInventoryRecords.filter((r) => r.productId === item.productId);

        const totalOnHand = matchingRecords.reduce((sum, r) => sum + r.onHandQuantity, 0);
        const totalReserved = matchingRecords.reduce((sum, r) => sum + r.reservedQuantity, 0);
        const totalAvailable = calculateAvailableQuantity(totalOnHand, totalReserved);

        const isSufficient = totalAvailable >= reqQty;
        const shortage = isSufficient ? 0 : reqQty - totalAvailable;

        return {
          productId: item.productId,
          productName: item.productNameSnapshot || item.productName || 'Product',
          sku: item.skuSnapshot || item.sku || 'SKU-001',
          requiredQuantity: reqQty,
          totalOnHand,
          totalReserved,
          totalAvailable,
          isSufficient,
          shortage,
          eligibleWarehouses: matchingRecords.map((r) => ({
            warehouseId: r.warehouseId,
            warehouseCode: r.warehouseCode,
            warehouseName: r.warehouseName,
            onHand: r.onHandQuantity,
            reserved: r.reservedQuantity,
            available: r.availableQuantity,
            canFulfillEntirely: r.availableQuantity >= reqQty,
          })),
        };
      });

      const allSufficient = availabilityReport.every((r) => r.isSufficient);
      const noneSufficient = availabilityReport.every((r) => !r.isSufficient || r.totalAvailable === 0);

      let readinessStatus = INVENTORY_READINESS_STATUS.AVAILABLE;
      if (!allSufficient) {
        readinessStatus = noneSufficient
          ? INVENTORY_READINESS_STATUS.INSUFFICIENT_STOCK
          : INVENTORY_READINESS_STATUS.PARTIALLY_AVAILABLE;
      }

      return {
        orderId: orderData.id || orderData.orderId,
        readinessStatus,
        allSufficient,
        items: availabilityReport,
      };
    }
  },

  /**
   * Reserve stock for an Order from a selected warehouse.
   */
  async reserveInventory(orderId, reservationData = {}) {
    if (!orderId) throw new Error('Order ID is required.');

    try {
      return await apiClient.post(`/company/orders/${orderId}/reserve-inventory`, reservationData);
    } catch (err) {
      console.warn('[inventoryService] Processing stock reservation in preview store.');

      const targetWarehouseId = reservationData.warehouseId || 'WH-VJA-01';
      const productId = reservationData.productId || 'PROD-001';
      const reqQty = Number(reservationData.quantity || 10);

      const recordIndex = mockInventoryRecords.findIndex(
        (r) => r.productId === productId && (r.warehouseId === targetWarehouseId || r.warehouseCode === targetWarehouseId)
      );

      if (recordIndex === -1) {
        throw new Error('Inventory record not found for selected product and warehouse.');
      }

      const rec = mockInventoryRecords[recordIndex];
      const validation = validateStockReservation(reqQty, rec.availableQuantity);
      if (!validation.isValid) throw new Error(validation.error);

      // Mutate reservation count
      const newReserved = rec.reservedQuantity + reqQty;
      const newAvailable = calculateAvailableQuantity(rec.onHandQuantity, newReserved);

      mockInventoryRecords[recordIndex] = {
        ...rec,
        reservedQuantity: newReserved,
        availableQuantity: newAvailable,
        updatedAt: new Date().toISOString(),
      };

      const reservation = {
        reservationId: `res_${Date.now()}`,
        orderId,
        productId,
        warehouseId: rec.warehouseId,
        warehouseCode: rec.warehouseCode,
        quantity: reqQty,
        status: RESERVATION_STATUS.ACTIVE,
        reservedAt: new Date().toISOString(),
      };

      mockReservations.unshift(reservation);

      // Log movement
      mockMovements.unshift({
        movementId: `mov_${Date.now()}`,
        warehouseId: rec.warehouseId,
        warehouseCode: rec.warehouseCode,
        productId,
        productName: rec.productName,
        sku: rec.sku,
        movementType: MOVEMENT_TYPE.STOCK_RESERVATION,
        quantity: reqQty,
        beforeQuantity: rec.onHandQuantity,
        afterQuantity: rec.onHandQuantity,
        referenceType: 'ORDER',
        referenceId: orderId,
        reason: `Reserved ${reqQty} units for Order ${orderId}`,
        actorName: 'Authorized Operator',
        createdAt: new Date().toISOString(),
      });

      return {
        reservation,
        updatedRecord: mockInventoryRecords[recordIndex],
        readinessStatus: INVENTORY_READINESS_STATUS.RESERVED,
      };
    }
  },

  /**
   * Release an active stock reservation (e.g. on order cancellation).
   */
  async releaseReservation(reservationId) {
    if (!reservationId) throw new Error('Reservation ID is required.');

    try {
      return await apiClient.post(`/company/inventory/reservations/${reservationId}/release`);
    } catch (err) {
      console.warn('[inventoryService] Releasing reservation in preview store.');

      const resIndex = mockReservations.findIndex((r) => r.reservationId === reservationId);
      if (resIndex !== -1) {
        const res = mockReservations[resIndex];
        mockReservations[resIndex].status = RESERVATION_STATUS.RELEASED;

        // Restore available stock
        const recIndex = mockInventoryRecords.findIndex((r) => r.warehouseId === res.warehouseId && r.productId === res.productId);
        if (recIndex !== -1) {
          const rec = mockInventoryRecords[recIndex];
          const newReserved = Math.max(0, rec.reservedQuantity - res.quantity);
          const newAvail = calculateAvailableQuantity(rec.onHandQuantity, newReserved);

          mockInventoryRecords[recIndex] = {
            ...rec,
            reservedQuantity: newReserved,
            availableQuantity: newAvail,
            updatedAt: new Date().toISOString(),
          };

          // Movement
          mockMovements.unshift({
            movementId: `mov_${Date.now()}`,
            warehouseId: rec.warehouseId,
            warehouseCode: rec.warehouseCode,
            productId: rec.productId,
            productName: rec.productName,
            sku: rec.sku,
            movementType: MOVEMENT_TYPE.STOCK_RELEASE,
            quantity: res.quantity,
            beforeQuantity: rec.onHandQuantity,
            afterQuantity: rec.onHandQuantity,
            referenceType: 'RESERVATION_RELEASE',
            referenceId: reservationId,
            reason: `Released ${res.quantity} units for Order ${res.orderId}`,
            actorName: 'Authorized Operator',
            createdAt: new Date().toISOString(),
          });
        }
      }
      return { success: true, releasedId: reservationId };
    }
  },

  /**
   * Warehouse-to-Warehouse Stock Transfer.
   */
  async transferInventory(data) {
    const validation = validateStockTransfer(data);
    if (!validation.isValid) throw new Error(validation.error);

    try {
      return await apiClient.post('/company/inventory/transfers', data);
    } catch (err) {
      console.warn('[inventoryService] Processing warehouse stock transfer in preview store.');

      const qty = Number(data.quantity);
      const srcIndex = mockInventoryRecords.findIndex(
        (r) => r.productId === data.productId && (r.warehouseId === data.sourceWarehouseId || r.warehouseCode === data.sourceWarehouseId)
      );

      if (srcIndex === -1) throw new Error('Source warehouse inventory record not found.');
      const srcRec = mockInventoryRecords[srcIndex];

      if (qty > srcRec.availableQuantity) {
        throw new Error(`Insufficient available stock in source warehouse (${srcRec.availableQuantity} available).`);
      }

      // Deduct source
      const srcNewOnHand = srcRec.onHandQuantity - qty;
      const srcNewAvail = calculateAvailableQuantity(srcNewOnHand, srcRec.reservedQuantity);
      mockInventoryRecords[srcIndex] = {
        ...srcRec,
        onHandQuantity: srcNewOnHand,
        availableQuantity: srcNewAvail,
        status: calculateInventoryStatus(srcNewOnHand, srcRec.reorderLevel),
        updatedAt: new Date().toISOString(),
      };

      // Add destination
      let destIndex = mockInventoryRecords.findIndex(
        (r) => r.productId === data.productId && (r.warehouseId === data.destinationWarehouseId || r.warehouseCode === data.destinationWarehouseId)
      );

      if (destIndex === -1) {
        // Create destination record if missing
        const newDest = {
          inventoryId: `inv_${Date.now()}`,
          warehouseId: data.destinationWarehouseId,
          warehouseCode: data.destinationWarehouseId,
          warehouseName: 'Destination Hub',
          productId: srcRec.productId,
          productName: srcRec.productName,
          sku: srcRec.sku,
          category: srcRec.category,
          onHandQuantity: qty,
          reservedQuantity: 0,
          availableQuantity: qty,
          reorderLevel: 10,
          status: calculateInventoryStatus(qty, 10),
          updatedAt: new Date().toISOString(),
        };
        mockInventoryRecords.push(newDest);
      } else {
        const destRec = mockInventoryRecords[destIndex];
        const destNewOnHand = destRec.onHandQuantity + qty;
        const destNewAvail = calculateAvailableQuantity(destNewOnHand, destRec.reservedQuantity);

        mockInventoryRecords[destIndex] = {
          ...destRec,
          onHandQuantity: destNewOnHand,
          availableQuantity: destNewAvail,
          status: calculateInventoryStatus(destNewOnHand, destRec.reorderLevel),
          updatedAt: new Date().toISOString(),
        };
      }

      // Log linked movements
      const transferRef = `TRF-${Date.now()}`;
      mockMovements.unshift({
        movementId: `mov_out_${Date.now()}`,
        warehouseId: srcRec.warehouseId,
        warehouseCode: srcRec.warehouseCode,
        productId: srcRec.productId,
        productName: srcRec.productName,
        sku: srcRec.sku,
        movementType: MOVEMENT_TYPE.STOCK_TRANSFER_OUT,
        quantity: -qty,
        beforeQuantity: srcRec.onHandQuantity,
        afterQuantity: srcNewOnHand,
        referenceType: 'TRANSFER',
        referenceId: transferRef,
        reason: `Inter-warehouse transfer out to ${data.destinationWarehouseId}`,
        actorName: 'Operations Lead',
        createdAt: new Date().toISOString(),
      });

      return { success: true, transferRef, quantity: qty };
    }
  },

  /**
   * Fallback query handler for getInventory.
   */
  handleFallbackGetInventory(params) {
    let list = [...mockInventoryRecords];

    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (r) =>
          r.productName.toLowerCase().includes(q) ||
          r.sku.toLowerCase().includes(q) ||
          r.warehouseCode.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }

    if (params.warehouseId && params.warehouseId !== 'ALL') {
      list = list.filter((r) => r.warehouseId === params.warehouseId || r.warehouseCode === params.warehouseId);
    }

    if (params.status && params.status !== 'ALL') {
      list = list.filter((r) => r.status === params.status);
    }

    const page = parseInt(params.page || 1, 10);
    const limit = parseInt(params.pageSize || 10, 10);
    const startIndex = (page - 1) * limit;

    return {
      data: list.slice(startIndex, startIndex + limit),
      meta: {
        total: list.length,
        page,
        limit,
        totalPages: Math.ceil(list.length / limit) || 1,
      },
    };
  },
};
