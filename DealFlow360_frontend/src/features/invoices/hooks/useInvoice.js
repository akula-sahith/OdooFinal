/**
 * Custom hook for single invoice lifecycle, issuing, voiding & audit trail
 * Phase 14 — DealFlow360
 */

import { useState, useEffect, useCallback } from 'react';
import { invoiceService } from '../services/invoiceService';

export const useInvoice = (invoiceId) => {
  const [invoice, setInvoice] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoice = useCallback(async () => {
    if (!invoiceId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await invoiceService.getInvoiceById(invoiceId);
      if (!data) {
        setError('Invoice record not found.');
      } else {
        setInvoice(data);
        const logs = await invoiceService.getInvoiceAuditLogs(invoiceId);
        setAuditLogs(logs);
      }
    } catch (err) {
      setError(err.message || 'Failed to load invoice detail');
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  const updateDraft = async (updateData, user) => {
    try {
      const updated = await invoiceService.updateDraftInvoice(invoiceId, updateData, user);
      await fetchInvoice();
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const issueInvoice = async (user) => {
    try {
      const issued = await invoiceService.issueInvoice(invoiceId, user);
      await fetchInvoice();
      return issued;
    } catch (err) {
      throw err;
    }
  };

  const voidInvoice = async (reason, user) => {
    try {
      const voided = await invoiceService.voidInvoice(invoiceId, reason, user);
      await fetchInvoice();
      return voided;
    } catch (err) {
      throw err;
    }
  };

  const cancelInvoice = async (reason, user) => {
    try {
      const cancelled = await invoiceService.cancelInvoice(invoiceId, reason, user);
      await fetchInvoice();
      return cancelled;
    } catch (err) {
      throw err;
    }
  };

  return {
    invoice,
    auditLogs,
    loading,
    error,
    refetch: fetchInvoice,
    updateDraft,
    issueInvoice,
    voidInvoice,
    cancelInvoice,
  };
};
