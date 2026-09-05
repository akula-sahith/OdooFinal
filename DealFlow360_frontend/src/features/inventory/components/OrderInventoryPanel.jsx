import React, { useState, useEffect } from 'react';
import { Package, CheckCircle2, AlertTriangle, Building2, Lock, RotateCcw } from 'lucide-react';
import { useOrderInventory } from '../hooks/useOrderInventory';

export const OrderInventoryPanel = ({ order, onInventoryReserved }) => {
  const { report, loading, reserving, error, checkInventory, reserveInventory, releaseReservation } = useOrderInventory(order);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('WH-VJA-01');

  useEffect(() => {
    if (order) {
      checkInventory();
    }
  }, [order, checkInventory]);

  if (!order) return null;

  const handleReserveClick = async () => {
    try {
      const res = await reserveInventory({
        warehouseId: selectedWarehouseId,
        productId: order.items?.[0]?.productId || 'PROD-001',
        quantity: order.items?.[0]?.quantity || 10,
      });
      if (onInventoryReserved) onInventoryReserved(res);
    } catch (err) {
      // Handled by hook
    }
  };

  const handleReleaseClick = async () => {
    try {
      await releaseReservation(`res_${order.id || order.orderId}`);
    } catch (err) {
      // Handled
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary-500" />
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Order Physical Inventory & Stock Allocation</h3>
            <p className="text-xs text-slate-500">
              Verify stock availability, select fulfillment warehouse, and reserve physical inventory for this order.
            </p>
          </div>
        </div>

        {report && (
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
            report.readinessStatus === 'RESERVED' || report.readinessStatus === 'ALLOCATED' || report.readinessStatus === 'AVAILABLE'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
              : report.readinessStatus === 'PARTIALLY_AVAILABLE'
              ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400'
              : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400'
          }`}>
            Status: {report.readinessStatus}
          </span>
        )}
      </div>

      {loading ? (
        <div className="h-24 bg-slate-100 dark:bg-slate-700/40 animate-pulse rounded-xl" />
      ) : error ? (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : report ? (
        <div className="space-y-4">
          {/* Itemized Stock Availability Report */}
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
            {report.items.map((item, idx) => (
              <div key={idx} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{item.productName}</div>
                  <div className="text-slate-500 font-mono text-[11px]">
                    SKU: {item.sku} • Required: <strong className="text-slate-900 dark:text-white">{item.requiredQuantity} units</strong>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Available Stock</span>
                    <span className={`font-extrabold text-sm ${item.isSufficient ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.totalAvailable} units
                    </span>
                  </div>

                  {item.shortage > 0 && (
                    <div className="bg-rose-50 text-rose-700 px-2.5 py-1 rounded-lg border border-rose-200 font-bold">
                      Shortage: -{item.shortage}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Fulfillment Warehouse Selector & Actions */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Building2 className="w-4 h-4 text-slate-400" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Select Fulfillment Warehouse Hub
                </span>
                <select
                  value={selectedWarehouseId}
                  onChange={(e) => setSelectedWarehouseId(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-800 dark:text-slate-200"
                >
                  <option value="WH-VJA-01">WH-VJA-01 — Vijayawada Hub</option>
                  <option value="WH-HYD-01">WH-HYD-01 — Hyderabad Depot</option>
                  <option value="WH-BLR-01">WH-BLR-01 — Bengaluru Center</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {report.readinessStatus === 'RESERVED' ? (
                <button
                  onClick={handleReleaseClick}
                  disabled={reserving}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Release Stock Reservation</span>
                </button>
              ) : (
                <button
                  onClick={handleReserveClick}
                  disabled={reserving || !report.allSufficient}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{reserving ? 'Reserving Stock...' : 'Reserve Physical Stock'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
