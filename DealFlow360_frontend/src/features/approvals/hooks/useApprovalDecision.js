import { useState, useCallback } from 'react';
import { approvalService } from '../services/approvalService';
import { usePermissions } from '../../../hooks/auth/usePermissions';

/**
 * Custom Hook for executing Approval Decision actions (Approve, Reject, Request Revision).
 */
export const useApprovalDecision = (quotationId) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { user } = usePermissions();

  const userContext = {
    id: user?.id || 'MGR-007',
    fullName: user?.fullName || 'Marcus Vance',
    role: user?.roleName || user?.role || 'Sales Manager',
  };

  const approve = useCallback(
    async (comment = '') => {
      setSubmitting(true);
      setError(null);
      try {
        const result = await approvalService.approveQuotation(quotationId, comment, userContext);
        return { success: true, data: result };
      } catch (err) {
        const msg = err.message || 'Failed to approve quotation.';
        setError(msg);
        return { success: false, error: msg, status: err.status };
      } finally {
        setSubmitting(false);
      }
    },
    [quotationId, userContext]
  );

  const reject = useCallback(
    async (reason = '') => {
      setSubmitting(true);
      setError(null);
      try {
        const result = await approvalService.rejectQuotation(quotationId, reason, userContext);
        return { success: true, data: result };
      } catch (err) {
        const msg = err.message || 'Failed to reject quotation.';
        setError(msg);
        return { success: false, error: msg, status: err.status };
      } finally {
        setSubmitting(false);
      }
    },
    [quotationId, userContext]
  );

  const requestRevision = useCallback(
    async (reason = '') => {
      setSubmitting(true);
      setError(null);
      try {
        const result = await approvalService.requestRevision(quotationId, reason, userContext);
        return { success: true, data: result };
      } catch (err) {
        const msg = err.message || 'Failed to request quotation revision.';
        setError(msg);
        return { success: false, error: msg, status: err.status };
      } finally {
        setSubmitting(false);
      }
    },
    [quotationId, userContext]
  );

  return {
    approve,
    reject,
    requestRevision,
    submitting,
    error,
    setError,
  };
};
