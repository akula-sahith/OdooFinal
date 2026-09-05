import { useState, useEffect, useCallback } from 'react';
import { discountTierService } from '../services/discountTierService';

/**
 * Custom hook to fetch a single discount tier by ID and perform mutation actions (create, update, status toggle).
 */
export const useDiscountTier = (discountTierId) => {
  const [discountTier, setDiscountTier] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(discountTierId));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const fetchTier = useCallback(async () => {
    if (!discountTierId) {
      setIsLoading(false);
      setDiscountTier(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await discountTierService.getDiscountTierById(discountTierId);
      const record = data?.data || data;
      setDiscountTier(record);
    } catch (err) {
      setError(err?.message || 'Failed to load discount tier details.');
      setDiscountTier(null);
    } finally {
      setIsLoading(false);
    }
  }, [discountTierId]);

  useEffect(() => {
    fetchTier();
  }, [fetchTier]);

  const createDiscountTier = async (formData) => {
    setIsSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await discountTierService.createDiscountTier(formData);
      const created = response?.data || response;
      setDiscountTier(created);
      return { success: true, data: created };
    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Failed to create discount tier.';
      if (err?.errors || err?.data?.errors) {
        setFieldErrors(err.errors || err.data.errors);
      }
      setError(msg);
      return { success: false, error: msg, fieldErrors: err?.errors || err?.data?.errors };
    } finally {
      setIsSaving(false);
    }
  };

  const updateDiscountTier = async (formData) => {
    if (!discountTierId) return { success: false, error: 'Discount tier ID is missing.' };

    setIsSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await discountTierService.updateDiscountTier(discountTierId, formData);
      const updated = response?.data || response;
      setDiscountTier(updated);
      return { success: true, data: updated };
    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Failed to update discount tier.';
      if (err?.errors || err?.data?.errors) {
        setFieldErrors(err.errors || err.data.errors);
      }
      setError(msg);
      return { success: false, error: msg, fieldErrors: err?.errors || err?.data?.errors };
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async () => {
    if (!discountTier) return { success: false, error: 'No discount tier loaded.' };
    const targetStatus = discountTier.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    setIsSaving(true);
    try {
      const response = await discountTierService.updateDiscountTierStatus(discountTier.id, targetStatus);
      const updated = response?.data || response;
      setDiscountTier((prev) => ({ ...prev, status: targetStatus }));
      return { success: true, data: updated, newStatus: targetStatus };
    } catch (err) {
      const msg = err?.message || 'Failed to update status.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsSaving(false);
    }
  };

  return {
    discountTier,
    tier: discountTier,
    isLoading,
    loading: isLoading,
    isSaving,
    saving: isSaving,
    error,
    fieldErrors,
    refetch: fetchTier,
    createDiscountTier,
    updateDiscountTier,
    toggleStatus,
  };
};

export default useDiscountTier;
