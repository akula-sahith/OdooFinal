import { useState, useEffect, useCallback } from 'react';
import { priceListService } from '../services/priceListService';

/**
 * Custom hook to manage single Price List record fetching, saving, and status updates.
 *
 * @param {string} priceListId
 * @returns {Object} Single price list state and actions
 */
export const usePriceList = (priceListId) => {
  const [priceList, setPriceList] = useState(null);
  const [loading, setLoading] = useState(Boolean(priceListId && priceListId !== 'new'));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const fetchPriceList = useCallback(async () => {
    if (!priceListId || priceListId === 'new') {
      setLoading(false);
      setPriceList(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await priceListService.getPriceListById(priceListId);
      const data = response?.data || response;
      setPriceList(data);
    } catch (err) {
      setError(err?.message || 'Failed to fetch price list details.');
      setPriceList(null);
    } finally {
      setLoading(false);
    }
  }, [priceListId]);

  useEffect(() => {
    fetchPriceList();
  }, [fetchPriceList]);

  /**
   * Save (create or update) Price List record.
   * Handles 409 duplicate name/code error status codes cleanly.
   */
  const savePriceList = async (formData) => {
    setSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      let savedRecord;
      if (priceListId && priceListId !== 'new') {
        savedRecord = await priceListService.updatePriceList(priceListId, formData);
      } else {
        savedRecord = await priceListService.createPriceList(formData);
      }
      const record = savedRecord?.data || savedRecord;
      setPriceList(record);
      return { success: true, data: record };
    } catch (err) {
      const serverMessage = err?.data?.message || err?.message || 'Failed to save price list.';

      // Handle 409 Duplicate Name/Code
      if (
        err?.status === 409 ||
        serverMessage.toLowerCase().includes('already exists') ||
        serverMessage.toLowerCase().includes('duplicate')
      ) {
        const customMsg = 'Price list already exists.';
        setFieldErrors({ name: customMsg, code: customMsg });
        setError(customMsg);
        return { success: false, error: customMsg, fieldErrors: { name: customMsg, code: customMsg } };
      }

      if (err?.data?.errors && typeof err.data.errors === 'object') {
        setFieldErrors(err.data.errors);
      }

      setError(serverMessage);
      return { success: false, error: serverMessage };
    } finally {
      setSaving(false);
    }
  };

  /**
   * Toggle or update Price List status (ACTIVE / INACTIVE).
   */
  const updateStatus = async (newStatus) => {
    if (!priceListId) return { success: false, error: 'Price list ID is missing.' };
    setSaving(true);
    setError(null);

    try {
      const updated = await priceListService.updatePriceListStatus(priceListId, newStatus);
      const record = updated?.data || updated;
      setPriceList((prev) => (prev ? { ...prev, status: newStatus } : record));
      return { success: true, data: record };
    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Failed to update price list status.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setSaving(false);
    }
  };

  return {
    priceList,
    loading,
    saving,
    error,
    fieldErrors,
    actions: {
      refetch: fetchPriceList,
      savePriceList,
      updateStatus,
      clearErrors: () => {
        setError(null);
        setFieldErrors({});
      },
    },
  };
};

export default usePriceList;
