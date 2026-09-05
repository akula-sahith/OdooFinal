import React, { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { SearchInput } from '../../../components/ui/SearchInput/SearchInput';
import { Select } from '../../../components/ui/Select/Select';
import { Button } from '../../../components/ui/Button/Button';
import { categoryService } from '../services/categoryService';

/**
 * ProductFilters Component
 * Compact filter bar with aligned search, category filter, status filter, and clear filter controls.
 */
export const ProductFilters = ({
  filters = {},
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onClearFilters,
  className = '',
}) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchCats = async () => {
      setLoadingCategories(true);
      try {
        const response = await categoryService.getCategories();
        const list = Array.isArray(response) ? response : (response?.data || response?.categories || []);
        if (isMounted) setCategories(list);
      } catch {
        if (isMounted) setCategories([]);
      } finally {
        if (isMounted) setLoadingCategories(false);
      }
    };
    fetchCats();
    return () => {
      isMounted = false;
    };
  }, []);

  const hasActiveFilters = Boolean(
    filters.search || filters.categoryId || filters.status
  );

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
  ];

  return (
    <div className={`p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3 ${className}`}>
      {/* Search Bar */}
      <div className="flex-1 min-w-[220px]">
        <SearchInput
          value={filters.search || ''}
          onSearch={(val) => onSearchChange && onSearchChange(val)}
          placeholder="Search product name or SKU..."
        />
      </div>

      {/* Category Filter */}
      <div className="w-full sm:w-52 shrink-0">
        <Select
          value={filters.categoryId || ''}
          onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
          options={categoryOptions}
          isLoading={loadingCategories}
          placeholder="All Categories"
        />
      </div>

      {/* Status Filter */}
      <div className="w-full sm:w-40 shrink-0">
        <Select
          value={filters.status || ''}
          onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
          options={statusOptions}
          placeholder="All Statuses"
        />
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="w-full sm:w-auto h-10 text-xs font-semibold text-slate-600 border-slate-300 hover:bg-slate-50 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset
        </Button>
      )}
    </div>
  );
};

export default ProductFilters;
