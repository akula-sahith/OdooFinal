import { useState, useEffect, useCallback } from 'react';
import { adminDashboardService } from '../services/adminDashboardService';

/**
 * Custom React Hook for Managing Admin Configuration & Governance Dashboard
 */
export const useAdminDashboard = (initialTimeRange = '30d') => {
  const [timeRange, setTimeRange] = useState(initialTimeRange);
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const [sectionErrors, setSectionErrors] = useState({});

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminDashboardService.getAdminDashboard(timeRange, selectedTeam, selectedCategory);
      setData(result || null);
    } catch (err) {
      setError(err?.message || 'Unable to connect to Admin Governance Service.');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, selectedTeam, selectedCategory]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const refetchSection = useCallback(async (sectionName) => {
    setSectionErrors((prev) => ({ ...prev, [sectionName]: null }));
    try {
      const sectionData = await adminDashboardService.getSectionData(sectionName, timeRange);
      setData((prev) => (prev ? { ...prev, [sectionName]: sectionData } : null));
    } catch (err) {
      setSectionErrors((prev) => ({
        ...prev,
        [sectionName]: err?.message || `Failed to refresh ${sectionName}.`,
      }));
    }
  }, [timeRange]);

  return {
    timeRange,
    setTimeRange,
    selectedTeam,
    setSelectedTeam,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    error,
    data,
    sectionErrors,
    refetch: fetchDashboard,
    refetchSection,
  };
};

export default useAdminDashboard;
