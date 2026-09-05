import React from 'react';
import { Package, Building2, Sliders, ArrowRightLeft } from 'lucide-react';
import { InventoryStatusBadge } from './InventoryStatusBadge';

export const InventoryStockTable = ({
  stockRecords = [],
  loading = false,
  onOpenAdjust,
  onOpenTransfer,
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-slate-100 dark:bg-slate-700/40 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!stockRecords || stockRecords.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
        <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No Inventory Stock Records</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
          No stock records match the selected warehouse, product search, or status filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Product Name / SKU</th>
              <th className="py-3.5 px-4">Warehouse Location</th>
              <th className="py-3.5 px-4 text-center">On Hand</th>
              <th className="py-3.5 px-4 text-center">Reserved</th>
              <th className="py-3.5 px-4 text-center">Available Stock</th>
              <th className="py-3.5 px-4 text-center">Reorder Lvl</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Stock Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
            {stockRecords.map((r) => (
              <tr key={r.inventoryId} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {r.productName}
                  </div>
                  <div className="text-xs font-mono text-slate-500">
                    {r.sku} • <span className="text-slate-400 font-sans">{r.category}</span>
                  </div>
                </td>

                <td className="py-3.5 px-4 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                    <div>
                      <span className="font-bold font-mono text-primary-600 dark:text-primary-400 block">
                        {r.warehouseCode}
                      </span>
                      <span className="text-slate-500 text-[11px] truncate max-w-xs block">{r.warehouseName}</span>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4 text-center font-bold text-slate-900 dark:text-white">
                  {r.onHandQuantity}
                </td>

                <td className="py-3.5 px-4 text-center text-amber-600 dark:text-amber-400 font-medium text-xs">
                  {r.reservedQuantity > 0 ? `${r.reservedQuantity} reserved` : '0'}
                </td>

                <td className="py-3.5 px-4 text-center font-extrabold text-emerald-600 dark:text-emerald-400 text-base">
                  {r.availableQuantity}
                </td>

                <td className="py-3.5 px-4 text-center text-xs font-mono text-slate-500">
                  {r.reorderLevel}
                </td>

                <td className="py-3.5 px-4 text-center">
                  <InventoryStatusBadge status={r.status} />
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onOpenTransfer && onOpenTransfer(r)}
                      disabled={r.availableQuantity <= 0}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition disabled:opacity-40"
                      title="Transfer Stock to another Warehouse"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Transfer</span>
                    </button>

                    <button
                      onClick={() => onOpenAdjust && onOpenAdjust(r)}
                      className="px-3 py-1 text-xs font-semibold bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 hover:bg-primary-100 border border-primary-200 dark:border-primary-800 rounded-lg flex items-center gap-1 transition"
                      title="Manually adjust physical stock"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Adjust Stock</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
