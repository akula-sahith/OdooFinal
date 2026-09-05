import { useState, useEffect, useCallback } from 'react';
import { customerRequestService } from '../services/customerRequestService';

/**
 * Custom Hook for fetching and mutating a single customer requirement request.
 */
export const useCustomerRequest = (requestId) => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchRequest = useCallback(async () => {
    if (!requestId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await customerRequestService.getRequestById(requestId);
      setRequest(data);
    } catch (err) {
      console.error('[useCustomerRequest] Failed to fetch requirement request:', err);
      setError(err.message || 'Requirement request not found or access denied.');
      setRequest(null);
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  const createRequest = async (formData, isSubmit = false) => {
    setSaving(true);
    try {
      const created = await customerRequestService.createRequest({ ...formData, isSubmit });
      setSaving(false);
      return { success: true, data: created };
    } catch (err) {
      setSaving(false);
      return { success: false, error: err.message || 'Failed to create requirement request.' };
    }
  };

  const updateRequest = async (formData) => {
    if (!requestId) return { success: false, error: 'Request ID is required.' };
    setSaving(true);
    try {
      const updated = await customerRequestService.updateRequest(requestId, formData);
      setRequest((prev) => ({ ...prev, ...updated }));
      setSaving(false);
      return { success: true, data: updated };
    } catch (err) {
      setSaving(false);
      return { success: false, error: err.message || 'Failed to update requirement request.' };
    }
  };

  const submitRequest = async () => {
    if (!requestId) return { success: false, error: 'Request ID is required.' };
    setSaving(true);
    try {
      const updated = await customerRequestService.submitRequest(requestId);
      setRequest((prev) => ({ ...prev, status: 'SUBMITTED', updatedAt: updated.updatedAt }));
      setSaving(false);
      return { success: true, data: updated };
    } catch (err) {
      setSaving(false);
      return { success: false, error: err.message || 'Failed to submit requirement request.' };
    }
  };

  const cancelRequest = async () => {
    if (!requestId) return { success: false, error: 'Request ID is required.' };
    setSaving(true);
    try {
      const updated = await customerRequestService.cancelRequest(requestId);
      setRequest((prev) => ({ ...prev, status: 'CANCELLED', updatedAt: updated.updatedAt }));
      setSaving(false);
      return { success: true, data: updated };
    } catch (err) {
      setSaving(false);
      return { success: false, error: err.message || 'Failed to cancel requirement request.' };
    }
  };

  return {
    request,
    loading,
    saving,
    error,
    fetchRequest,
    createRequest,
    updateRequest,
    submitRequest,
    cancelRequest,
  };
};

export default useCustomerRequest;
