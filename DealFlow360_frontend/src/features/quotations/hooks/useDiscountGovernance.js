import { useState, useEffect, useCallback } from 'react';
import { discountGovernanceService } from '../services/discountGovernanceService';

/**
 * Custom Hook for evaluating Quotation Discount Governance and Risk Classification.
 */
export const useDiscountGovernance = (
  initialDiscountPct = 0,
  subtotal = 0,
  userRole = 'Salesperson',
  userId = 'SP-014'
) => {
  const [requestedDiscountPercentage, setRequestedDiscountPercentage] = useState(initialDiscountPct);
  const [governanceResult, setGovernanceResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const evaluateGovernance = useCallback(
    async (pctToEvaluate = requestedDiscountPercentage, currentSubtotal = subtotal) => {
      setLoading(true);
      setError(null);
      try {
        const result = await discountGovernanceService.evaluateDiscount({
          requestedDiscountPercentage: pctToEvaluate,
          subtotal: currentSubtotal,
          userId,
          userRole,
        });
        setGovernanceResult(result);
        return result;
      } catch (err) {
        setError(err.message || 'Failed to evaluate discount governance.');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [requestedDiscountPercentage, subtotal, userId, userRole]
  );

  // Re-evaluate on requested discount or subtotal change with debounce
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(async () => {
      if (isMounted) {
        await evaluateGovernance(requestedDiscountPercentage, subtotal);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      isMounted = false;
    };
  }, [requestedDiscountPercentage, subtotal, evaluateGovernance]);

  return {
    requestedDiscountPercentage,
    setRequestedDiscountPercentage,
    governanceResult,
    loading,
    error,
    evaluateGovernance,
  };
};
