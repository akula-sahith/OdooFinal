import React, { useEffect, useState } from 'react';
import { Select } from '../../../components/ui/Select/Select';
import { categoryService } from '../services/categoryService';

/**
 * CategorySelector Component
 * Reusable dynamic dropdown component that loads active categories from API.
 */
export const CategorySelector = ({
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder = 'Select product category...',
  label = 'Category',
  helperText,
  className = '',
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const response = await categoryService.getCategories({ status: 'ACTIVE' });
        const list = Array.isArray(response) ? response : (response?.data || response?.categories || []);
        if (isMounted) {
          setCategories(list);
        }
      } catch (err) {
        if (isMounted) {
          setLoadError(err?.message || 'Failed to load categories');
          setCategories([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  return (
    <Select
      label={label}
      value={value ?? ''}
      onChange={onChange}
      options={categoryOptions}
      placeholder={loading ? 'Loading categories...' : placeholder}
      isLoading={loading}
      error={error || loadError}
      required={required}
      disabled={disabled || loading}
      helperText={helperText || (categories.length === 0 && !loading ? 'No active categories found.' : undefined)}
      className={className}
      isClearable
    />
  );
};

export default CategorySelector;
