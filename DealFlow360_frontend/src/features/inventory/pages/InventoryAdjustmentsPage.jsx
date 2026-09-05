import React from 'react';
import { Sliders, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInventoryMovements } from '../hooks/useInventoryMovements';
import { InventoryMovementsTable } from '../components/InventoryMovementsTable';

export const InventoryAdjustmentsPage = () => {
  const { movements, loading } = useInventoryMovements({ movementType: 'STOCK_ADJUSTMENT' });

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-5">
        <div className="space-y-1">
          <Link to="/company/inventory" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inventory Control Center</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-primary-500" />
            <span>Manual Stock Adjustments History</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Log of authorized physical stock receipts, damage write-offs, and count corrections.
          </p>
        </div>
      </div>

      <InventoryMovementsTable movements={movements} loading={loading} />
    </div>
  );
};
