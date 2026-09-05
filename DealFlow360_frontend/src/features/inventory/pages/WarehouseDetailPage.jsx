import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, MapPin, Package, Edit, Power, AlertCircle } from 'lucide-react';
import { useWarehouse } from '../hooks/useWarehouse';
import { useInventory } from '../hooks/useInventory';
import { InventoryStockTable } from '../components/InventoryStockTable';

export const WarehouseDetailPage = () => {
  const { warehouseId } = useParams();
  const navigate = useNavigate();

  const { warehouse, loading: whLoading, error: whError, updateStatus } = useWarehouse(warehouseId);
  const { stockRecords, loading: stockLoading } = useInventory({ warehouseId });

  if (whLoading) {
    return (
      <div className="space-y-6 md:space-y-8">
        <div className="h-6 w-36 bg-slate-200 animate-pulse rounded" />
        <div className="h-32 bg-slate-100 animate-pulse rounded-2xl" />
        <div className="h-64 bg-slate-100 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (whError || !warehouse) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Warehouse Not Found</h2>
        <p className="text-xs text-slate-500">{whError || 'The requested warehouse location does not exist.'}</p>
        <Link to="/company/inventory/warehouses" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl font-semibold text-xs">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Warehouses</span>
        </Link>
      </div>
    );
  }

  const totalSKUs = stockRecords.length;
  const totalUnits = stockRecords.reduce((sum, r) => sum + r.onHandQuantity, 0);
  const reservedUnits = stockRecords.reduce((sum, r) => sum + r.reservedQuantity, 0);
  const availableUnits = stockRecords.reduce((sum, r) => sum + r.availableQuantity, 0);

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn">
      {/* Top Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link to="/company/inventory/warehouses" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Warehouse Facilities</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => updateStatus(warehouse.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition ${
              warehouse.status === 'ACTIVE'
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{warehouse.status === 'ACTIVE' ? 'Deactivate Hub' : 'Activate Hub'}</span>
          </button>
        </div>
      </div>

      {/* Warehouse Info Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold px-2.5 py-1 bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400 rounded-lg border border-primary-200">
                {warehouse.warehouseCode}
              </span>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                {warehouse.name}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                warehouse.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {warehouse.status}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{warehouse.address}, {warehouse.city}, {warehouse.state}, {warehouse.country} {warehouse.postalCode}</span>
            </div>

            <p className="text-xs text-slate-500 max-w-2xl">{warehouse.description || 'Regional inventory fulfillment facility.'}</p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 text-center shrink-0">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total SKUs</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">{totalSKUs}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">On Hand</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">{totalUnits}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Reserved</span>
              <span className="text-base font-bold text-amber-600">{reservedUnits}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Available</span>
              <span className="text-base font-extrabold text-emerald-600">{availableUnits}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Table inside Warehouse */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Physical Stock in {warehouse.warehouseCode}</h2>
        <InventoryStockTable stockRecords={stockRecords} loading={stockLoading} />
      </div>
    </div>
  );
};
