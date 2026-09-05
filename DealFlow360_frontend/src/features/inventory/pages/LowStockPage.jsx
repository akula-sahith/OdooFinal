import React from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInventory } from '../hooks/useInventory';
import { InventoryStockTable } from '../components/InventoryStockTable';

export const LowStockPage = () => {
  const { stockRecords, loading, refetch } = useInventory({ status: 'LOW_STOCK' });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-5">
        <div className="space-y-1">
          <Link to="/company/inventory" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inventory Control Center</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-400 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            <span>Low Stock Replenishment Alerts</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Products whose physical on-hand quantity has fallen below configured warehouse reorder thresholds.
          </p>
        </div>
      </div>

      <InventoryStockTable stockRecords={stockRecords} loading={loading} />
    </div>
  );
};
