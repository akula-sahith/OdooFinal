import React from 'react';
import { History, Building2, User } from 'lucide-react';
import { MOVEMENT_TYPE_LABELS } from '../types/inventoryTypes';

export const InventoryMovementsTable = ({ movements = [], loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 bg-slate-100 dark:bg-slate-700/40 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!movements || movements.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
        <History className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No Inventory Movements Recorded</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
          No inventory movements found matching the current search parameters.
        </p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4">Product / SKU</th>
              <th className="py-3.5 px-4">Warehouse Hub</th>
              <th className="py-3.5 px-4">Movement Type</th>
              <th className="py-3.5 px-4 text-center">Qty Change</th>
              <th className="py-3.5 px-4 text-center">Before $\rightarrow$ After</th>
              <th className="py-3.5 px-4">Reason / Reference</th>
              <th className="py-3.5 px-4 text-right">Operator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
            {movements.map((m) => {
              const isPositive = Number(m.quantity) > 0;
              const label = MOVEMENT_TYPE_LABELS[m.movementType] || m.movementType;

              return (
                <tr key={m.movementId} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition">
                  <td className="py-3 px-4 text-slate-500 font-mono">
                    {formatDate(m.createdAt)}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {m.productName}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">{m.sku}</div>
                  </td>

                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-primary-500" />
                      <span className="font-mono font-bold text-primary-600 dark:text-primary-400">
                        {m.warehouseCode || m.warehouseId}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    {label}
                  </td>

                  <td className={`py-3 px-4 text-center font-extrabold text-sm font-mono ${
                    isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {isPositive ? `+${m.quantity}` : m.quantity}
                  </td>

                  <td className="py-3 px-4 text-center text-slate-500 font-mono">
                    {m.beforeQuantity} $\rightarrow$ <strong className="text-slate-900 dark:text-white">{m.afterQuantity}</strong>
                  </td>

                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    <span>{m.reason}</span>
                    {m.referenceId && (
                      <span className="block text-[10px] font-mono text-slate-400">Ref: {m.referenceId}</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right text-slate-500">
                    <div className="flex items-center justify-end gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{m.actorName || 'System Operator'}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
