import { useState, useEffect, useCallback } from 'react';
import { quotationService } from '../services/quotationService';

export const useQuotation = (quotationId) => {
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(Boolean(quotationId));
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchQuotation = useCallback(async () => {
    if (!quotationId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await quotationService.getQuotationById(quotationId);
      setQuotation(data);
    } catch (err) {
      console.error(`[useQuotation] Error fetching quotation ${quotationId}:`, err);
      setError(err.message || 'Sales quotation not found or access denied.');
    } finally {
      setLoading(false);
    }
  }, [quotationId]);

  useEffect(() => {
    fetchQuotation();
  }, [fetchQuotation]);

  const saveDraft = async (formData) => {
    setSaving(true);
    try {
      if (quotationId) {
        const updated = await quotationService.updateQuotation(quotationId, formData);
        setQuotation(updated);
        return { success: true, data: updated };
      } else {
        const created = await quotationService.createQuotation(formData);
        setQuotation(created);
        return { success: true, data: created };
      }
    } catch (err) {
      return { success: false, error: err.message || 'Failed to save quotation draft.' };
    } finally {
      setSaving(false);
    }
  };

  return {
    quotation,
    loading,
    error,
    saving,
    refetch: fetchQuotation,
    saveDraft,
  };
};

export default useQuotation;
