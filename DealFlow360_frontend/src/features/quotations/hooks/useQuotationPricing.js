import { useState, useEffect, useCallback } from 'react';
import { quotationService } from '../services/quotationService';
import { calculateSubtotal, calculateDiscountTotal, calculateTaxTotal, calculateGrandTotal, calculateLineSubtotal } from '../utils/quotationCalculations';

/**
 * Custom Hook for managing Quotation Price List binding, Currency Lock, and Recalculations.
 */
export const useQuotationPricing = (initialPriceListId = '', initialCurrency = 'INR') => {
  const [priceListId, setPriceListId] = useState(initialPriceListId);
  const [currency, setCurrency] = useState(initialCurrency);
  const [eligiblePriceLists, setEligiblePriceLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch eligible price lists on mount
  useEffect(() => {
    let isMounted = true;
    const fetchLists = async () => {
      setLoading(true);
      setError(null);
      try {
        const lists = await quotationService.getQuotationEligiblePriceLists();
        if (isMounted) {
          setEligiblePriceLists(lists);
          if (!priceListId && lists.length > 0) {
            setPriceListId(lists[0].id || lists[0].priceListId);
            setCurrency(lists[0].currency || 'INR');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load eligible price lists.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchLists();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update currency when priceListId changes
  const selectPriceList = useCallback(
    (newPriceListId) => {
      setPriceListId(newPriceListId);
      const found = eligiblePriceLists.find(
        (pl) => pl.id === newPriceListId || pl.priceListId === newPriceListId
      );
      if (found && found.currency) {
        setCurrency(found.currency);
      }
    },
    [eligiblePriceLists]
  );

  // Revalidate line items against selected Price List
  const revalidateLineItems = useCallback(
    async (items = []) => {
      if (!priceListId || !items.length) return items;
      setLoading(true);
      try {
        const revalidated = await Promise.all(
          items.map(async (item) => {
            try {
              const basePriceInfo = await quotationService.getProductPrice(priceListId, item.productId);
              const newUnitBasePrice = basePriceInfo.unitBasePrice;
              const newSubtotal = calculateLineSubtotal(item.quantity, newUnitBasePrice);
              return {
                ...item,
                unitBasePrice: newUnitBasePrice,
                lineSubtotal: newSubtotal,
                lineTotal: newSubtotal,
                currency: basePriceInfo.currency || currency,
                priceError: null,
              };
            } catch (err) {
              return {
                ...item,
                priceError: 'Product not priced in selected Price List',
              };
            }
          })
        );
        return revalidated;
      } finally {
        setLoading(false);
      }
    },
    [priceListId, currency]
  );

  // Recalculate totals helper
  const computeTotals = useCallback((items = []) => {
    const subtotal = calculateSubtotal(items);
    const discountTotal = calculateDiscountTotal(items);
    const taxTotal = calculateTaxTotal(items);
    const grandTotal = calculateGrandTotal(subtotal, discountTotal, taxTotal);

    return {
      subtotal,
      discountTotal,
      taxTotal,
      grandTotal,
    };
  }, []);

  return {
    priceListId,
    currency,
    eligiblePriceLists,
    loading,
    error,
    selectPriceList,
    revalidateLineItems,
    computeTotals,
  };
};
