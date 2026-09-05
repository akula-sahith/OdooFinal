import { useState, useEffect, useCallback } from 'react';
import { salespersonRequestService } from '../services/salespersonRequestService';

export const useSalespersonRequest = (requestId) => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequest = useCallback(async () => {
    if (!requestId) return;
    setLoading(true);
    setError(null);
    try {
      const record = await salespersonRequestService.getRequestById(requestId);
      setRequest(record);
    } catch (err) {
      console.error(`[useSalespersonRequest] Error fetching request ${requestId}:`, err);
      setError(err.message || 'Requirement request not found or access denied.');
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  const claimRequest = async (salespersonInfo) => {
    setActionLoading(true);
    try {
      const updated = await salespersonRequestService.claimRequest(requestId, salespersonInfo);
      setRequest({ ...updated });
      return updated;
    } finally {
      setActionLoading(false);
    }
  };

  const startReview = async () => {
    setActionLoading(true);
    try {
      const updated = await salespersonRequestService.startReview(requestId);
      setRequest({ ...updated });
      return updated;
    } finally {
      setActionLoading(false);
    }
  };

  const requestClarification = async (messageContent, salespersonInfo) => {
    setActionLoading(true);
    try {
      const updated = await salespersonRequestService.requestClarification(requestId, messageContent, salespersonInfo);
      setRequest({ ...updated });
      return updated;
    } finally {
      setActionLoading(false);
    }
  };

  const confirmRequirement = async (notes) => {
    setActionLoading(true);
    try {
      const updated = await salespersonRequestService.confirmRequirement(requestId, notes);
      setRequest({ ...updated });
      return updated;
    } finally {
      setActionLoading(false);
    }
  };

  const closeRequest = async (reason) => {
    setActionLoading(true);
    try {
      const updated = await salespersonRequestService.closeRequest(requestId, reason);
      setRequest({ ...updated });
      return updated;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    request,
    loading,
    error,
    actionLoading,
    refetch: fetchRequest,
    claimRequest,
    startReview,
    requestClarification,
    confirmRequirement,
    closeRequest,
  };
};

export default useSalespersonRequest;
