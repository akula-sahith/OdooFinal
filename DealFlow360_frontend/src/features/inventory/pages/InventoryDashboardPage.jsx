import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Building2, AlertTriangle, ArrowRight, History, Sliders, ArrowRightLeft } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { useWarehouses } from '../hooks/useWarehouses';
import { LowStockBanner } from '../components/LowStockBanner';
import { InventoryStockTable } from '../components/InventoryStockTable';

export const InventoryDashboardPage = () => {
  const navigate = useNavigate();
  const { stockRecords, loading: stockLoading, refetch } = useInventory();
  const { warehouses, loading: whLoading } = useWarehouses();

  // Summary Metrics
  const totalWarehouses = warehouses.length;
  const activeWarehouses = warehouses.filter((w) => w.status === 'ACTIVE').length;

  const totalOnHand = stockRecords.reduce((sum, r) => sum + r.onHandQuantity, 0);
  const totalReserved = stockRecords.reduce((sum, r) => sum + r.reservedQuantity, 0);
  const totalAvailable = stockRecords.reduce((sum, r) => sum + r.availableQuantity, 0);

  const lowStockItems = stockRecords.filter((r) => r.status === 'LOW_STOCK');
  const outOfStockItems = stockRecords.filter((r) => r.status === 'OUT_OF_STOCK');

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span>Inventory & Warehouse Control Center</span>
            <span className="px-3 py-1 bg-purple-100 text-[#714B67] text-xs font-bold rounded-full border border-purple-200">
              Phase 12
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Physical stock monitoring, warehouse management, stock movements, and order inventory allocation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/company/inventory/warehouses"
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-xl shadow-2xs transition flex items-center gap-1.5"
          >
            <Building2 className="w-4 h-4 text-primary-500" />
            <span>Manage Warehouses ({totalWarehouses})</span>
          </Link>

          <Link
            to="/company/inventory/movements"
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-xl shadow-2xs transition flex items-center gap-1.5"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>Audit Movements</span>
          </Link>
        </div>
      </div>

      {/* Low Stock Alert Banner if any */}
      <LowStockBanner lowStockCount={lowStockItems.length} outOfStockCount={outOfStockItems.length} />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Warehouses */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Warehouses</span>
            <Building2 className="w-5 h-5 text-primary-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{activeWarehouses}</div>
          <div className="text-[11px] text-slate-500">{totalWarehouses} total registered hubs</div>
        </div>

        {/* Total Physical Stock On Hand */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total On Hand Stock</span>
            <Package className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalOnHand}</div>
          <div className="text-[11px] text-slate-500">Physical units across all hubs</div>
        </div>

        {/* Reserved Stock */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Reserved Units</span>
            <Sliders className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{totalReserved}</div>
          <div className="text-[11px] text-slate-500">Committed to confirmed orders</div>
        </div>

        {/* Net Available Stock */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Available Stock</span>
            <Package className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{totalAvailable}</div>
          <div className="text-[11px] text-slate-500">Uncommitted & ready to reserve</div>
        </div>
      </div>

      {/* Stock Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Master Stock Catalog Overview</h2>
          <Link
            to="/company/inventory/stock"
            className="text-xs font-semibold text-primary-600 hover:underline flex items-center gap-1"
          >
            <span>View Full Stock Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <InventoryStockTable stockRecords={stockRecords} loading={stockLoading} />
      </div>
    </div>
  );
};
