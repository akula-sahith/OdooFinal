/**
 * Fulfillment Filters Component
 * Phase 13 — DealFlow360
 */

import React from 'react';
import { Search, Filter, Warehouse, Flag, RefreshCw } from 'lucide-react';
import { FULFILLMENT_STATUS, FULFILLMENT_PRIORITY } from '../types/fulfillmentTypes';

export const FulfillmentFilters = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Fulfillment ID, Order #, or Client..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full h-10 pl-9 pr-4 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="text-xs font-semibold text-slate-700 bg-transparent outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              {Object.values(FULFILLMENT_STATUS).map((st) => (
                <option key={st} value={st}>
                  {st.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Warehouse Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Warehouse className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filters.warehouseId || ''}
              onChange={(e) => onFilterChange({ warehouseId: e.target.value })}
              className="text-xs font-semibold text-slate-700 bg-transparent outline-none cursor-pointer"
            >
              <option value="">All Warehouses</option>
              <option value="WH-MAIN-01">Central Industrial Warehouse</option>
              <option value="WH-EAST-02">East Coast Distribution Center</option>
              <option value="WH-WEST-03">West Coast Fulfillment Hub</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Flag className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filters.priority || ''}
              onChange={(e) => onFilterChange({ priority: e.target.value })}
              className="text-xs font-semibold text-slate-700 bg-transparent outline-none cursor-pointer"
            >
              <option value="">All Priorities</option>
              {Object.values(FULFILLMENT_PRIORITY).map((p) => (
                <option key={p} value={p}>
                  {p} Priority
                </option>
              ))}
            </select>
          </div>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              title="Reset Filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
