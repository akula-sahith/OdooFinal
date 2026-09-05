import { useState, useEffect, useCallback } from 'react';
import { quotationFinalizationService } from '../services/quotationFinalizationService';

export const useQuotationFinalization = (quotationId) => {
  const [quotation, setQuotation] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [versions, setVersions] = useState([]);
  const [orderReadiness, setOrderReadiness] = useState(null);

  const [loading, setLoading] = useState(true);
  const [finalizing, setFinalizing] = useState(false);
  const [error, setError] = useState(null);

  // Version comparison state
  const [comparison, setComparison] = useState(null);
  const [comparing, setComparing] = useState(false);

  const fetchFinalizationData = useCallback(async () => {
    if (!quotationId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await quotationFinalizationService.getFinalizationDetails(quotationId);
      setQuotation(data.quotation);
      setSnapshot(data.snapshot);
      setVersions(data.versions || []);

      // Fetch order readiness
      const readiness = await quotationFinalizationService.getOrderReadiness(quotationId);
      setOrderReadiness(readiness);
    } catch (err) {
      console.error('[useQuotationFinalization] Error:', err);
      setError(err.message || 'Failed to load quotation finalization details.');
    } finally {
      setLoading(false);
    }
  }, [quotationId]);

  useEffect(() => {
    fetchFinalizationData();
  }, [fetchFinalizationData]);

  const compareVersions = async (versionA, versionB) => {
    if (!quotationId) return;
    setComparing(true);
    try {
      const compRes = await quotationFinalizationService.getVersionComparison(
        quotationId,
        versionA,
        versionB
      );
      setComparison(compRes);
      return compRes;
    } catch (err) {
      setError(err.message || 'Failed to compare versions.');
    } finally {
      setComparing(false);
    }
  };

  const finalizeQuotation = async () => {
    if (!quotationId || finalizing) return;
    setFinalizing(true);
    setError(null);
    try {
      const res = await quotationFinalizationService.finalizeAcceptedQuotation(quotationId);
      setQuotation(res.quotation);
      setSnapshot(res.snapshot);
      await fetchFinalizationData();
      return res;
    } catch (err) {
      setError(err.message || 'Failed to finalize quotation.');
      throw err;
    } finally {
      setFinalizing(false);
    }
  };

  return {
    quotation,
    snapshot,
    versions,
    orderReadiness,
    loading,
    finalizing,
    error,
    comparison,
    comparing,
    compareVersions,
    finalizeQuotation,
    refetch: fetchFinalizationData,
  };
};
