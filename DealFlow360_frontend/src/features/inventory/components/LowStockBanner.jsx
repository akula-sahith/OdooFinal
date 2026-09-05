import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LowStockBanner = ({ lowStockCount = 0, outOfStockCount = 0 }) => {
  const navigate = useNavigate();

  if (lowStockCount === 0 && outOfStockCount === 0) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs mb-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-950 dark:text-amber-200">
            Stock Replenishment Attention Required
          </h4>
          <p className="text-xs text-amber-800 dark:text-amber-300">
            {outOfStockCount > 0 && <strong className="text-rose-600 dark:text-rose-400">{outOfStockCount} Out-of-Stock Item(s)</strong>}
            {outOfStockCount > 0 && lowStockCount > 0 && ' and '}
            {lowStockCount > 0 && <strong>{lowStockCount} Low-Stock Alert(s)</strong>} detected below reorder thresholds.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {outOfStockCount > 0 && (
          <button
            onClick={() => navigate('/company/inventory/out-of-stock')}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-2xs transition"
          >
            View Out of Stock
          </button>
        )}
        {lowStockCount > 0 && (
          <button
            onClick={() => navigate('/company/inventory/low-stock')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-2xs transition flex items-center gap-1"
          >
            <span>View Low Stock</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
