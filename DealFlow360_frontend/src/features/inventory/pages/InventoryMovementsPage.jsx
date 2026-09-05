import React from 'react';
import { History, Search, Filter, RefreshCw } from 'lucide-react';
import { useInventoryMovements } from '../hooks/useInventoryMovements';
import { useWarehouses } from '../hooks/useWarehouses';
import { InventoryMovementsTable } from '../components/InventoryMovementsTable';
import { MOVEMENT_TYPE } from '../types/inventoryTypes';

export const InventoryMovementsPage = () => {
  const { movements, meta, loading, error, filters, updateFilters, setPage, refetch } = useInventoryMovements();
  const { warehouses } = useWarehouses();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-primary-500" />
            <span>Inventory Movement Ledger & Audit Trail</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Auditable history of stock receipts, adjustments, order reservations, releases, allocations, and transfers.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={loading}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-xl shadow-2xs transition"
        >
          Refresh Ledger
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 rounded-xl">
          {error}
        </div>
      )}

      {/* Movement Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => updateFilters({ search: e.target.value })}
              placeholder="Search by Product Name, SKU, Reason, or Reference ID..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Movement Type:</span>
              <select
                value={filters.movementType || 'ALL'}
                onChange={(e) => updateFilters({ movementType: e.target.value })}
                className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-medium"
              >
                <option value="ALL">All Movements</option>
                {Object.keys(MOVEMENT_TYPE).map((typeKey) => (
                  <option key={typeKey} value={typeKey}>
                    {typeKey}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Movements Table */}
      <InventoryMovementsTable movements={movements} loading={loading} />
    </div>
  );
};
