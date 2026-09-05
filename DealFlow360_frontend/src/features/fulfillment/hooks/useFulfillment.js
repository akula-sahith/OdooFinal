/**
 * Custom hook for single fulfillment order detail and audit trail
 * Phase 13 — DealFlow360
 */

import { useState, useEffect, useCallback } from 'react';
import { fulfillmentService } from '../services/fulfillmentService';

export const useFulfillment = (fulfillmentId) => {
  const [fulfillment, setFulfillment] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [packages, setPackages] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    if (!fulfillmentId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fulfillmentService.getFulfillmentById(fulfillmentId);
      if (!data) {
        setError('Fulfillment record not found.');
      } else {
        setFulfillment(data);
        const [logs, pkgs, shps] = await Promise.all([
          fulfillmentService.getAuditTrail(fulfillmentId),
          fulfillmentService.getPackagesByFulfillmentId(fulfillmentId),
          fulfillmentService.getShipments({ search: fulfillmentId }),
        ]);
        setAuditLogs(logs);
        setPackages(pkgs);
        setShipments(shps.filter((s) => s.fulfillmentId === fulfillmentId));
      }
    } catch (err) {
      setError(err.message || 'Failed to load fulfillment detail');
    } finally {
      setLoading(false);
    }
  }, [fulfillmentId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    fulfillment,
    auditLogs,
    packages,
    shipments,
    loading,
    error,
    refetch: fetchDetail,
  };
};
