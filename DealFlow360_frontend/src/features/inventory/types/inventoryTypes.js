/**
 * Phase 12 — Inventory & Warehouse Management Data Types and Enums
 */

export const WAREHOUSE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export const INVENTORY_STATUS = {
  IN_STOCK: 'IN_STOCK',
  LOW_STOCK: 'LOW_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  INACTIVE: 'INACTIVE',
};

export const MOVEMENT_TYPE = {
  STOCK_RECEIPT: 'STOCK_RECEIPT',
  STOCK_ADJUSTMENT: 'STOCK_ADJUSTMENT',
  STOCK_RESERVATION: 'STOCK_RESERVATION',
  STOCK_RELEASE: 'STOCK_RELEASE',
  STOCK_ALLOCATION: 'STOCK_ALLOCATION',
  STOCK_TRANSFER_IN: 'STOCK_TRANSFER_IN',
  STOCK_TRANSFER_OUT: 'STOCK_TRANSFER_OUT',
};

export const RESERVATION_STATUS = {
  ACTIVE: 'ACTIVE',
  RELEASED: 'RELEASED',
  CANCELLED: 'CANCELLED',
};

export const ALLOCATION_STATUS = {
  ALLOCATED: 'ALLOCATED',
  RELEASED: 'RELEASED',
  CANCELLED: 'CANCELLED',
};

export const TRANSFER_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const INVENTORY_READINESS_STATUS = {
  PENDING_CHECK: 'PENDING_CHECK',
  AVAILABLE: 'AVAILABLE',
  PARTIALLY_AVAILABLE: 'PARTIALLY_AVAILABLE',
  INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
  RESERVED: 'RESERVED',
  ALLOCATED: 'ALLOCATED',
};

export const INVENTORY_STATUS_LABELS = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock Alert',
  OUT_OF_STOCK: 'Out of Stock',
  INACTIVE: 'Inactive',
};

export const INVENTORY_STATUS_VARIANTS = {
  IN_STOCK: 'success',
  LOW_STOCK: 'warning',
  OUT_OF_STOCK: 'danger',
  INACTIVE: 'neutral',
};

export const MOVEMENT_TYPE_LABELS = {
  STOCK_RECEIPT: 'Stock Receipt (+)',
  STOCK_ADJUSTMENT: 'Manual Adjustment (+/-)',
  STOCK_RESERVATION: 'Order Reservation (-Avail)',
  STOCK_RELEASE: 'Reservation Release (+Avail)',
  STOCK_ALLOCATION: 'Warehouse Allocation',
  STOCK_TRANSFER_IN: 'Transfer Receipt (+)',
  STOCK_TRANSFER_OUT: 'Transfer Dispatch (-)',
};

/**
 * Calculates stock status derived from quantity and configured reorder level.
 */
export const calculateInventoryStatus = (onHandQuantity, reorderLevel = 10) => {
  const qty = Number(onHandQuantity || 0);
  const reorder = Number(reorderLevel || 10);

  if (qty <= 0) return INVENTORY_STATUS.OUT_OF_STOCK;
  if (qty <= reorder) return INVENTORY_STATUS.LOW_STOCK;
  return INVENTORY_STATUS.IN_STOCK;
};

/**
 * Calculates available stock quantity. Formula: Available = On Hand - Reserved
 */
export const calculateAvailableQuantity = (onHandQuantity, reservedQuantity) => {
  const onHand = Math.max(0, Number(onHandQuantity || 0));
  const reserved = Math.max(0, Number(reservedQuantity || 0));
  return Math.max(0, onHand - reserved);
};
