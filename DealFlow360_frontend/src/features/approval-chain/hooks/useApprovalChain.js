import { useState, useEffect, useCallback } from 'react';
import { approvalChainService } from '../services/approvalChainService';

/**
 * Custom hook to fetch and update Admin Approval Chain sequence configuration.
 */
export const useApprovalChain = () => {
  const [levels, setLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const fetchChain = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await approvalChainService.getApprovalChain();
      const list = Array.isArray(response) ? response : (response?.data || response?.levels || []);
      setLevels(list);
    } catch (err) {
      setError(err?.message || 'Failed to load approval chain governance configuration.');
      setLevels([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChain();
  }, [fetchChain]);

  const updateApprovalChain = async (newLevels) => {
    setIsSaving(true);
    setError(null);
    setValidationErrors({});

    try {
      const response = await approvalChainService.updateApprovalChain(newLevels);
      const updatedList = response?.data || response?.levels || newLevels;
      setLevels(updatedList);
      return { success: true, data: updatedList };
    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Failed to update approval chain configuration.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsSaving(false);
    }
  };

  return {
    levels,
    chain: levels,
    isLoading,
    loading: isLoading,
    isSaving,
    saving: isSaving,
    error,
    validationErrors,
    refetch: fetchChain,
    updateApprovalChain,
  };
};

export default useApprovalChain;
