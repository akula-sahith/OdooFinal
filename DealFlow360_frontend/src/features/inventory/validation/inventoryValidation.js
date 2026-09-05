/**
 * Phase 12 Inventory & Warehouse Validation Rules
 */

export const validateWarehouse = (data = {}) => {
  const { warehouseCode, name, city, state, country } = data;

  if (!warehouseCode || typeof warehouseCode !== 'string' || !warehouseCode.trim()) {
    return { isValid: false, error: 'Warehouse code is required (e.g. WH-VJA-01).' };
  }
  if (warehouseCode.trim().length < 3) {
    return { isValid: false, error: 'Warehouse code must be at least 3 characters long.' };
  }

  if (!name || typeof name !== 'string' || !name.trim()) {
    return { isValid: false, error: 'Warehouse name is required.' };
  }

  if (!city || !city.trim()) {
    return { isValid: false, error: 'Warehouse city is required.' };
  }

  return { isValid: true, error: null };
};

export const validateStockAdjustment = (data = {}) => {
  const { productId, warehouseId, quantityChange, reason } = data;

  if (!productId) return { isValid: false, error: 'Product selection is required.' };
  if (!warehouseId) return { isValid: false, error: 'Warehouse selection is required.' };

  const qty = Number(quantityChange);
  if (isNaN(qty) || qty === 0) {
    return { isValid: false, error: 'Quantity change must be a non-zero number.' };
  }

  if (!reason || !reason.trim()) {
    return { isValid: false, error: 'Adjustment reason is required (e.g. Stock Receipt, Damaged Goods).' };
  }

  return { isValid: true, error: null };
};

export const validateStockReservation = (requestedQty, availableQty) => {
  const req = Number(requestedQty || 0);
  const avail = Number(availableQty || 0);

  if (req <= 0) {
    return { isValid: false, error: 'Requested reservation quantity must be greater than zero.' };
  }

  if (req > avail) {
    return {
      isValid: false,
      error: `Insufficient available stock. Requested: ${req}, Available: ${avail}.`,
    };
  }

  return { isValid: true, error: null };
};

export const validateStockTransfer = (data = {}) => {
  const { sourceWarehouseId, destinationWarehouseId, productId, quantity, availableQuantity } = data;

  if (!productId) return { isValid: false, error: 'Product selection is required.' };
  if (!sourceWarehouseId) return { isValid: false, error: 'Source warehouse selection is required.' };
  if (!destinationWarehouseId) return { isValid: false, error: 'Destination warehouse selection is required.' };

  if (sourceWarehouseId === destinationWarehouseId) {
    return { isValid: false, error: 'Source and destination warehouses cannot be the same.' };
  }

  const qty = Number(quantity);
  if (isNaN(qty) || qty <= 0) {
    return { isValid: false, error: 'Transfer quantity must be greater than zero.' };
  }

  const avail = Number(availableQuantity || 0);
  if (qty > avail) {
    return {
      isValid: false,
      error: `Transfer quantity (${qty}) exceeds available stock (${avail}) in source warehouse.`,
    };
  }

  return { isValid: true, error: null };
};
