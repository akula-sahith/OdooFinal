import { useState, useCallback } from 'react';
import { calculateLineSubtotal, calculateSubtotal, calculateGrandTotal } from '../utils/quotationCalculations';

/**
 * Custom Hook for managing Quotation Line Items state & preliminary totals.
 * Handles item addition, duplicate product detection (updates quantity), quantity mutation, and item removal.
 */
export const useQuotationItems = (initialItems = []) => {
  const [items, setItems] = useState(initialItems);

  const addItem = useCallback((product, initialQty = 1) => {
    const targetProductId = product.id || product.productId;
    if (!product || !targetProductId) {
      return { success: false, error: 'Invalid product selected.' };
    }

    if (!product.unitBasePrice && product.unitBasePrice !== 0 && !product.basePrice) {
      return { success: false, error: 'This product does not have a base price in the selected price list.' };
    }

    const unitPrice = Number(product.unitBasePrice ?? product.basePrice);

    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.productId === targetProductId);
      if (existingIdx !== -1) {
        // Prevent duplicate lines: update existing line quantity
        const updated = [...prev];
        const newQty = Number(updated[existingIdx].quantity) + Number(initialQty);
        const sub = calculateLineSubtotal(newQty, updated[existingIdx].unitBasePrice);

        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          lineSubtotal: sub,
          lineTotal: sub,
        };
        return updated;
      }

      const qty = Number(initialQty) > 0 ? Number(initialQty) : 1;
      const sub = calculateLineSubtotal(qty, unitPrice);

      const newItem = {
        quotationItemId: `temp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        productId: targetProductId,
        productName: product.name,
        productNameSnapshot: product.name,
        skuSnapshot: product.sku || product.skuSnapshot || 'SKU-GEN',
        categorySnapshot: product.category || product.categorySnapshot || 'Catalog Product',
        quantity: qty,
        unitBasePrice: unitPrice,
        discountAmount: 0,
        discountPercentage: 0,
        taxAmount: 0,
        lineSubtotal: sub,
        lineTotal: sub,
        currency: product.currency || 'INR',
      };

      return [...prev, newItem];
    });

    return { success: true };
  }, []);

  const updateQuantity = useCallback((productId, newQty) => {
    const qty = Number(newQty);
    if (isNaN(qty) || qty <= 0 || !isFinite(qty)) return;

    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId || item.quotationItemId === productId) {
          const sub = calculateLineSubtotal(qty, item.unitBasePrice);
          return {
            ...item,
            quantity: qty,
            lineSubtotal: sub,
            lineTotal: sub,
          };
        }
        return item;
      })
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId && i.quotationItemId !== productId));
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = calculateSubtotal(items);
  const discountTotal = 0;
  const taxTotal = 0;
  const grandTotal = calculateGrandTotal(subtotal, discountTotal, taxTotal);

  return {
    items,
    setItems,
    addItem,
    updateQuantity,
    removeItem,
    clearItems,
    subtotal,
    discountTotal,
    taxTotal,
    grandTotal,
  };
};

export default useQuotationItems;
