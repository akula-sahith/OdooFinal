import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../services/categoryService';

/**
 * Custom hook to manage category list state, creation, editing, and status updates.
 *
 * @param {Object} [initialParams={}]
 * @returns {Object} Category management state and actions
 */
export const useCategories = (initialParams = {}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Filter params
  const [search, setSearch] = useState(initialParams.search || '');
  const [status, setStatus] = useState(initialParams.status || '');

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getCategories({ search, status });
      const dataList = Array.isArray(response) ? response : (response?.data || response?.categories || []);
      setCategories(dataList);
    } catch (err) {
      setError(err?.message || 'Failed to load categories.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /**
   * Create or update category record
   */
  const saveCategory = async (categoryData, categoryId = null) => {
    setSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      let savedRecord;
      if (categoryId) {
        savedRecord = await categoryService.updateCategory(categoryId, categoryData);
      } else {
        savedRecord = await categoryService.createCategory(categoryData);
      }
      const record = savedRecord?.data || savedRecord;
      
      // Update local state list cleanly
      setCategories(prev => {
        if (categoryId) {
          return prev.map(c => (c.id === categoryId ? { ...c, ...record } : c));
        }
        return [record, ...prev];
      });

      return { success: true, data: record };
    } catch (err) {
      const serverMessage = err?.data?.message || err?.message || 'Failed to save category.';
      
      // Handle 409 Duplicate Category Name
      if (err?.status === 409 || serverMessage.toLowerCase().includes('already exists') || serverMessage.toLowerCase().includes('duplicate')) {
        const customMsg = 'Category name already exists.';
        setFieldErrors({ name: customMsg });
        setError(customMsg);
        return { success: false, error: customMsg, fieldErrors: { name: customMsg } };
      }

      if (err?.data?.errors && typeof err.data.errors === 'object') {
        setFieldErrors(err.data.errors);
      }

      setError(serverMessage);
      return { success: false, error: serverMessage };
    } finally {
      setSaving(false);
    }
  };

  /**
   * Update status of category (ACTIVE / INACTIVE)
   */
  const updateCategoryStatus = async (categoryId, newStatus) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await categoryService.updateCategoryStatus(categoryId, newStatus);
      const record = updated?.data || updated;

      setCategories(prev =>
        prev.map(c => (c.id === categoryId ? { ...c, status: newStatus } : c))
      );

      return { success: true, data: record };
    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Failed to update category status.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setSaving(false);
    }
  };

  return {
    categories,
    loading,
    saving,
    error,
    fieldErrors,
    filters: { search, status },
    actions: {
      setSearch,
      setStatus,
      saveCategory,
      updateCategoryStatus,
      refetch: fetchCategories,
      clearErrors: () => {
        setError(null);
        setFieldErrors({});
      },
    },
  };
};

export default useCategories;
