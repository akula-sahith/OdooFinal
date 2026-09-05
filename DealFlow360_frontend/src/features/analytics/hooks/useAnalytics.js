/**
 * Phase 18 — Custom Analytics Hook
 * Manages centralized date range filtering, fetch states, error handling, and role scoping.
 */

import { useState, useEffect, useCallback } from 'react';
import { DATE_RANGES } from '../types/analyticsTypes';

export function useAnalytics(fetcherFn, initialParams = {}) {
  const [dateRange, setDateRange] = useState(DATE_RANGES.THIS_MONTH);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [additionalFilters, setAdditionalFilters] = useState(initialParams);
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateDateBounds = useCallback((rangeKey, customFrom, customTo) => {
    const now = new Date();
    let from = '';
    let to = now.toISOString().split('T')[0];

    if (rangeKey === DATE_RANGES.TODAY) {
      from = to;
    } else if (rangeKey === DATE_RANGES.THIS_WEEK) {
      const day = now.getDay() || 7;
      const monday = new Date(now);
      monday.setDate(now.getDate() - day + 1);
      from = monday.toISOString().split('T')[0];
    } else if (rangeKey === DATE_RANGES.THIS_MONTH) {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      from = firstDay.toISOString().split('T')[0];
    } else if (rangeKey === DATE_RANGES.THIS_QUARTER) {
      const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
      const firstDay = new Date(now.getFullYear(), quarterMonth, 1);
      from = firstDay.toISOString().split('T')[0];
    } else if (rangeKey === DATE_RANGES.THIS_YEAR) {
      const firstDay = new Date(now.getFullYear(), 0, 1);
      from = firstDay.toISOString().split('T')[0];
    } else if (rangeKey === DATE_RANGES.CUSTOM) {
      from = customFrom || '';
      to = customTo || '';
    }

    return { from, to };
  }, []);

  const loadData = useCallback(async () => {
    if (!fetcherFn) return;
    setLoading(true);
    setError(null);
    try {
      const { from, to } = calculateDateBounds(dateRange, fromDate, toDate);
      const params = {
        from,
        to,
        range: dateRange,
        ...additionalFilters,
      };
      const result = await fetcherFn(params);
      setData(result);
    } catch (err) {
      console.error('[useAnalytics] Error fetching analytics:', err);
      setError(err.message || 'Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  }, [fetcherFn, dateRange, fromDate, toDate, additionalFilters, calculateDateBounds]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDateRangeChange = (newRange, customF = '', customT = '') => {
    setDateRange(newRange);
    if (newRange === DATE_RANGES.CUSTOM) {
      setFromDate(customF);
      setToDate(customT);
    }
  };

  const updateFilters = (newFilters) => {
    setAdditionalFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    data,
    loading,
    error,
    dateRange,
    fromDate,
    toDate,
    setDateRange: handleDateRangeChange,
    updateFilters,
    refetch: loadData,
  };
}

export default useAnalytics;
