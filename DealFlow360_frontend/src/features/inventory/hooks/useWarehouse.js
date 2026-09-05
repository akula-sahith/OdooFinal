import { useState, useEffect, useCallback } from 'react';
import { warehouseService } from '../services/warehouseService';

export const useWarehouse = (warehouseId) => {
  const [warehouse, setWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchWarehouse = useCallback(async () => {
    if (!warehouseId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await warehouseService.getWarehouseById(warehouseId);
      setWarehouse(data);
    } catch (err) {
      console.error('[useWarehouse] Error:', err);
      setError(err.message || 'Failed to load warehouse details.');
    } finally {
      setLoading(false);
    }
  }, [warehouseId]);

  useEffect(() => {
    fetchWarehouse();
  }, [fetchWarehouse]);

  const updateWarehouse = async (data) => {
    if (!warehouseId) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await warehouseService.updateWarehouse(warehouseId, data);
      setWarehouse(updated);
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to update warehouse.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (status) => {
    if (!warehouseId) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await warehouseService.updateWarehouseStatus(warehouseId, status);
      setWarehouse(updated);
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to update warehouse status.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    warehouse,
    loading,
    saving,
    error,
    updateWarehouse,
    updateStatus,
    refetch: fetchWarehouse,
  };
};
