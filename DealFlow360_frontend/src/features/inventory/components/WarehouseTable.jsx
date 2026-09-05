import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, ArrowRight, ShieldCheck, Power } from 'lucide-react';

export const WarehouseTable = ({
  warehouses = [],
  loading = false,
  onToggleStatus,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-slate-100 dark:bg-slate-700/40 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!warehouses || warehouses.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
        <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No Warehouses Configured</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
          No active or inactive warehouse locations found matching your search parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Warehouse Code / Name</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4">Address</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
            {warehouses.map((w) => (
              <tr
                key={w.warehouseId}
                onClick={() => navigate(`/company/inventory/warehouses/${w.warehouseId}`)}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 cursor-pointer transition"
              >
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary-500 shrink-0" />
                    <div>
                      <span className="font-mono text-xs font-bold text-primary-600 dark:text-primary-400 block">
                        {w.warehouseCode}
                      </span>
                      <span>{w.name}</span>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 text-xs">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{w.city}, {w.state}</span>
                  </div>
                </td>

                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs max-w-xs truncate">
                  {w.address || 'Standard Hub Address'}
                </td>

                <td className="py-3.5 px-4 text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    w.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {w.status}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleStatus && onToggleStatus(w.warehouseId, w.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                      title={w.status === 'ACTIVE' ? 'Deactivate Warehouse' : 'Activate Warehouse'}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/company/inventory/warehouses/${w.warehouseId}`)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      <span>View Stock</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
