import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { INVENTORY_STATUS } from '../types/inventoryTypes';

export const InventoryFilters = ({
  filters,
  onFilterChange,
  onReset,
  warehouses = [],
  loading = false,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search by Product Name, SKU, Category, or Warehouse..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Warehouse Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Warehouse:</span>
            <select
              value={filters.warehouseId || 'ALL'}
              onChange={(e) => onFilterChange({ warehouseId: e.target.value })}
              className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-700 dark:text-slate-200 font-medium"
            >
              <option value="ALL">All Warehouses</option>
              {warehouses.map((w) => (
                <option key={w.warehouseId} value={w.warehouseId}>
                  {w.warehouseCode} — {w.city}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Status Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock Status:</span>
            <select
              value={filters.status || 'ALL'}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-700 dark:text-slate-200 font-medium"
            >
              <option value="ALL">All Stock Statuses</option>
              <option value="IN_STOCK">In Stock</option>
              <option value="LOW_STOCK">Low Stock Alert</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>

          {(filters.search || (filters.warehouseId && filters.warehouseId !== 'ALL') || (filters.status && filters.status !== 'ALL')) && (
            <button
              onClick={onReset}
              disabled={loading}
              className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
