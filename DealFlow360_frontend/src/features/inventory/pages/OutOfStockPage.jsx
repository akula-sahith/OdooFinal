import React from 'react';
import { Package, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInventory } from '../hooks/useInventory';
import { InventoryStockTable } from '../components/InventoryStockTable';

export const OutOfStockPage = () => {
  const { stockRecords, loading } = useInventory({ status: 'OUT_OF_STOCK' });

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-5">
        <div className="space-y-1">
          <Link to="/company/inventory" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inventory Control Center</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-rose-600 dark:text-rose-400 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6" />
            <span>Out of Stock Products</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Products with zero physical on-hand stock across warehouse hubs.
          </p>
        </div>
      </div>

      <InventoryStockTable stockRecords={stockRecords} loading={loading} />
    </div>
  );
};
