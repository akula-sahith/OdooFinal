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
   * Prevents adding duplicate products if already present.
   */
  const addItem = async (itemData) => {
    setSaving(true);
    setError(null);
    setFieldErrors({});

    // Check client-side if product is already in the item list
    const existing = items.find((i) => (i.product_id || i.product?.id) === itemData.product_id);
    if (existing) {
      const msg = 'This product is already included in this price list.';
      setFieldErrors({ product_id: msg });
      setError(msg);
      setSaving(false);
      return { success: false, error: msg, fieldErrors: { product_id: msg } };
    }

    try {
      const response = await priceListService.addPriceListItem(priceListId, itemData);
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
   */
  const updateItem = async (itemId, itemData) => {
    setSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await priceListService.updatePriceListItem(priceListId, itemId, itemData);
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
    saving,
    error,
    fieldErrors,
    actions: {
      refetch: fetchItems,
      addItem,
      updateItem,
      removeItem,
      clearErrors: () => {
        setError(null);
        setFieldErrors({});
      },
    },
  };
};

export default usePriceListItems;
