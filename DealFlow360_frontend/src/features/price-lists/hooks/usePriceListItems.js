import { useState, useEffect, useCallback } from 'react';
import { priceListService } from '../services/priceListService';

/**
 * Custom hook to manage item entries (Product Base Prices) inside a Price List.
 *
 * @param {string} priceListId
 * @returns {Object} Price list items state and actions
 */
export const usePriceListItems = (priceListId) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(Boolean(priceListId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const fetchItems = useCallback(async () => {
    if (!priceListId) {
      setLoading(false);
      setItems([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await priceListService.getPriceListItems(priceListId);
      const list = Array.isArray(response) ? response : (response?.data || response?.items || []);
      setItems(list);
    } catch (err) {
      setError(err?.message || 'Failed to load price list items.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [priceListId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  /**
   * Add a product item entry to the price list.
   * Accepts normalized payload { productId, basePrice } or positional arguments (productId, basePrice).
   */
  const addItem = async (itemData, optionalBasePrice) => {
    let payload = itemData;
    if (typeof itemData === 'string' || typeof itemData === 'number') {
      payload = { productId: itemData, basePrice: optionalBasePrice };
    }
    const targetProductId = payload.productId || payload.product_id;
    const targetBasePrice = payload.basePrice !== undefined ? payload.basePrice : payload.base_price;

    const normalizedPayload = {
      productId: targetProductId,
      basePrice: Number(targetBasePrice),
    };

    setSaving(true);
    setError(null);
    setFieldErrors({});

    // Check client-side if product is already in the item list
    const existing = items.find((i) => {
      const pid = i.productId || i.product_id || i.product?.id;
      return pid === targetProductId;
    });

    if (existing) {
      const msg = 'This product is already included in this price list.';
      setFieldErrors({ productId: msg, product_id: msg });
      setError(msg);
      setSaving(false);
      return { success: false, error: msg, fieldErrors: { productId: msg } };
    }

    try {
      const response = await priceListService.addPriceListItem(priceListId, normalizedPayload);
      const newItem = response?.data || response;
      setItems((prev) => [newItem, ...prev]);
      return { success: true, data: newItem };
    } catch (err) {
      const serverMsg = err?.data?.message || err?.message || 'Failed to add product to price list.';
      if (err?.data?.errors) setFieldErrors(err.data.errors);
      setError(serverMsg);
      return { success: false, error: serverMsg };
    } finally {
      setSaving(false);
    }
  };

  /**
   * Update base price of an existing item in the price list.
   * Accepts { itemId, basePrice } or positional arguments (itemId, basePrice).
   */
  const updateItem = async (itemIdOrData, optionalBasePrice) => {
    let itemId;
    let basePrice;

    if (typeof itemIdOrData === 'object' && itemIdOrData !== null) {
      itemId = itemIdOrData.itemId || itemIdOrData.id;
      basePrice = itemIdOrData.basePrice !== undefined ? itemIdOrData.basePrice : itemIdOrData.base_price;
    } else {
      itemId = itemIdOrData;
      basePrice = optionalBasePrice;
    }

    const normalizedPayload = {
      itemId,
      basePrice: Number(basePrice),
    };

    setSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await priceListService.updatePriceListItem(priceListId, itemId, normalizedPayload);
      const updatedItem = response?.data || response;
      setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, ...updatedItem } : item)));
      return { success: true, data: updatedItem };
    } catch (err) {
      const serverMsg = err?.data?.message || err?.message || 'Failed to update base price.';
      if (err?.data?.errors) setFieldErrors(err.data.errors);
      setError(serverMsg);
      return { success: false, error: serverMsg };
    } finally {
      setSaving(false);
    }
  };

  /**
   * Remove a product item entry from the price list.
   */
  const removeItem = async (itemId) => {
    setSaving(true);
    setError(null);

    try {
      await priceListService.removePriceListItem(priceListId, itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      return { success: true };
    } catch (err) {
      const serverMsg = err?.data?.message || err?.message || 'Failed to remove product from price list.';
      setError(serverMsg);
      return { success: false, error: serverMsg };
    } finally {
      setSaving(false);
    }
  };

  return {
    items,
    loading,
    isLoading: loading,
    saving,
    isSaving: saving,
    error,
    fieldErrors,
    refetch: fetchItems,
    addItem,
    updateItem,
    updateItemPrice: updateItem,
    removeItem,
    actions: {
      refetch: fetchItems,
      addItem,
      updateItem,
      updateItemPrice: updateItem,
      removeItem,
      clearErrors: () => {
        setError(null);
        setFieldErrors({});
      },
    },
  };
};

export default usePriceListItems;
