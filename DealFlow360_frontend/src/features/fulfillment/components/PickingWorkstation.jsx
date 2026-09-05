/**
 * Interactive Warehouse Picking Workstation Component
 * Phase 13 — DealFlow360
 */

import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Barcode,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { usePicking } from '../hooks/usePicking';

export const PickingWorkstation = ({ fulfillment, onPickingComplete, onRefresh }) => {
  const { startPicking, pickItem, completePicking, processing, error, clearError } = usePicking(
    fulfillment?.fulfillmentId,
    onRefresh
  );

  const [pickInputs, setPickInputs] = useState({});
  const [localError, setLocalError] = useState(null);

  if (!fulfillment) return null;

  const isPickingActive = fulfillment.status === 'PICKING';
  const isPickedDone = fulfillment.status === 'PICKED' || fulfillment.status === 'PACKING' || fulfillment.status === 'PACKED' || fulfillment.status === 'SHIPMENT_CREATED' || fulfillment.status === 'COMPLETED';

  const handleStartPicking = async () => {
    try {
      setLocalError(null);
      await startPicking();
    } catch (e) {
      setLocalError(e.message);
    }
  };

  const handlePickItemSubmit = async (itemId) => {
    const qty = Number(pickInputs[itemId]);
    if (!qty || isNaN(qty) || qty <= 0) {
      setLocalError('Please enter a valid pick quantity greater than 0.');
      return;
    }

    try {
      setLocalError(null);
      await pickItem(itemId, qty);
      setPickInputs((prev) => ({ ...prev, [itemId]: '' }));
    } catch (e) {
      setLocalError(e.message);
    }
  };

  const handleCompletePicking = async () => {
    try {
      setLocalError(null);
      await completePicking();
      if (onPickingComplete) onPickingComplete();
    } catch (e) {
      setLocalError(e.message);
    }
  };

  const allItemsPicked = fulfillment.items?.every((i) => i.pickedQuantity >= i.allocatedQuantity);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#714B67]" />
            <h3 className="text-base font-extrabold text-slate-900">
              Warehouse Picking Workstation — {fulfillment.fulfillmentId}
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Order: <span className="font-bold text-slate-800">{fulfillment.orderId}</span> | Warehouse:{' '}
            <span className="font-bold text-slate-800">{fulfillment.warehouseName}</span>
          </p>
        </div>

        {/* Workflow State Action */}
        {!isPickingActive && !isPickedDone && (
          <button
            type="button"
            disabled={processing}
            onClick={handleStartPicking}
            className="px-4 py-2 bg-[#714B67] hover:bg-[#56384E] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Layers className="w-4 h-4" /> Begin Picking Session
          </button>
        )}

        {allItemsPicked && isPickingActive && (
          <button
            type="button"
            disabled={processing}
            onClick={handleCompletePicking}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" /> Complete & Verify Picking
          </button>
        )}

        {isPickedDone && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> Picking Complete
          </span>
        )}
      </div>

      {/* Error Alert */}
      {(error || localError) && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <div className="flex-1">
            <p>{error || localError}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              clearError();
              setLocalError(null);
            }}
            className="text-rose-500 hover:text-rose-700 underline font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Items Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Warehouse Location</th>
              <th className="py-3 px-4">Product Details</th>
              <th className="py-3 px-4 text-center">Allocated Qty</th>
              <th className="py-3 px-4 text-center">Picked Qty</th>
              <th className="py-3 px-4 text-center">Remaining</th>
              <th className="py-3 px-4 text-right">Pick Input Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium">
            {fulfillment.items?.map((item) => {
              const remaining = item.allocatedQuantity - item.pickedQuantity;
              const isItemDone = remaining === 0;

              return (
                <tr
                  key={item.itemId}
                  className={`transition-colors ${
                    isItemDone ? 'bg-emerald-50/40' : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Location */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{item.location || 'Bin A-1'}</span>
                    </div>
                  </td>

                  {/* Product */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.productName}</div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <Barcode className="w-3 h-3" />
                      <span>{item.sku}</span>
                    </div>
                  </td>

                  {/* Allocated */}
                  <td className="py-3 px-4 text-center font-bold text-slate-800">
                    {item.allocatedQuantity}
                  </td>

                  {/* Picked */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-extrabold px-2 py-0.5 rounded-full ${
                        isItemDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.pickedQuantity}
                    </span>
                  </td>

                  {/* Remaining */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-bold ${
                        remaining > 0 ? 'text-amber-600' : 'text-emerald-600'
                      }`}
                    >
                      {remaining}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    {isItemDone ? (
                      <span className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Fully Picked
                      </span>
                    ) : isPickingActive ? (
                      <div className="flex items-center justify-end gap-2">
                        <input
                          type="number"
                          min="1"
                          max={remaining}
                          placeholder={`Max ${remaining}`}
                          value={pickInputs[item.itemId] || ''}
                          onChange={(e) =>
                            setPickInputs({ ...pickInputs, [item.itemId]: e.target.value })
                          }
                          className="w-24 h-8 px-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#714B67] outline-none"
                        />
                        <button
                          type="button"
                          disabled={processing}
                          onClick={() => handlePickItemSubmit(item.itemId)}
                          className="h-8 px-3 bg-[#714B67] hover:bg-[#56384E] text-white text-xs font-bold rounded-lg shadow-2xs transition-all inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          Confirm <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic font-normal">
                        Click 'Begin Picking' to enable
                      </span>
                    )}
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
