import { useState, useEffect, useCallback } from 'react';
import { customerQuotationService } from '../services/customerQuotationService';
import { isQuotationActionable } from '../validation/customerQuotationValidation';

export const useCustomerQuotation = (quotationId) => {
  const [quotation, setQuotation] = useState(null);
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const fetchQuotationDetail = useCallback(async () => {
    if (!quotationId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await customerQuotationService.getCustomerQuotationById(quotationId);
      setQuotation(data);
      setSelectedVersion(data.version);

      // Fetch version history
      try {
        const verList = await customerQuotationService.getQuotationVersions(quotationId);
        setVersions(verList);
      } catch (vErr) {
        console.warn('Version list fetch warning:', vErr);
        setVersions([data]);
      }
    } catch (err) {
      console.error('[useCustomerQuotation] Error:', err);
      setError(err.message || 'Failed to load quotation details.');
    } finally {
      setLoading(false);
    }
  }, [quotationId]);

  useEffect(() => {
    fetchQuotationDetail();
  }, [fetchQuotationDetail]);

  const selectVersion = useCallback((verNum) => {
    setSelectedVersion(verNum);
    const targetVer = versions.find((v) => v.version === verNum);
    if (targetVer) {
      setQuotation(targetVer);
    }
  }, [versions]);

  const acceptQuotation = async () => {
    if (!quotationId || submitting) return;
    setSubmitting(true);
    setActionError(null);
    try {
      const updated = await customerQuotationService.acceptQuotation(
        quotationId,
        quotation?.version
      );
      setQuotation(updated);
      await fetchQuotationDetail(); // Refresh state & versions
      return updated;
    } catch (err) {
      setActionError(err.message || 'Failed to accept quotation.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const rejectQuotation = async (reason) => {
    if (!quotationId || submitting) return;
    setSubmitting(true);
    setActionError(null);
    try {
      const updated = await customerQuotationService.rejectQuotation(
        quotationId,
        reason,
        quotation?.version
      );
      setQuotation(updated);
      await fetchQuotationDetail();
      return updated;
    } catch (err) {
      setActionError(err.message || 'Failed to reject quotation.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const requestChanges = async (changeData) => {
    if (!quotationId || submitting) return;
    setSubmitting(true);
    setActionError(null);
    try {
      const updated = await customerQuotationService.requestQuotationChanges(
        quotationId,
        changeData,
        quotation?.version
      );
      setQuotation(updated);
      await fetchQuotationDetail();
      return updated;
    } catch (err) {
      setActionError(err.message || 'Failed to submit change request.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const isActionable = isQuotationActionable(quotation);

  return {
    quotation,
    versions,
    selectedVersion,
    loading,
    submitting,
    error,
    actionError,
    isActionable,
    selectVersion,
    acceptQuotation,
    rejectQuotation,
    requestChanges,
    refetch: fetchQuotationDetail,
  };
};
