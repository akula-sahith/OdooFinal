/**
 * Packing Station Workstation Component
 * Phase 13 — DealFlow360
 */

import React, { useState } from 'react';
import {
  PackageCheck,
  Package,
  Plus,
  CheckCircle2,
  ShieldAlert,
  Layers,
  Scale,
  Ruler,
} from 'lucide-react';
import { usePacking } from '../hooks/usePacking';
import { PackageFormModal } from './PackageFormModal';
import { FulfillmentStatusBadge } from './FulfillmentStatusBadge';

export const PackingWorkstation = ({ fulfillment, packages = [], onPackingComplete, onRefresh }) => {
  const { startPacking, createPackage, completePacking, processing, error, clearError } = usePacking(
    fulfillment?.fulfillmentId,
    onRefresh
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localError, setLocalError] = useState(null);

  if (!fulfillment) return null;

  const isPackingActive = fulfillment.status === 'PACKING';
  const isPackedDone =
    fulfillment.status === 'PACKED' ||
    fulfillment.status === 'SHIPMENT_CREATED' ||
    fulfillment.status === 'COMPLETED';

  const allItemsPacked = fulfillment.items?.every((i) => i.packedQuantity >= i.pickedQuantity);

  const handleStartPacking = async () => {
    try {
      setLocalError(null);
      await startPacking();
    } catch (e) {
      setLocalError(e.message);
    }
  };

  const handlePackageSubmit = async (packageData) => {
    try {
      setLocalError(null);
      await createPackage(packageData);
      setIsModalOpen(false);
    } catch (e) {
      setLocalError(e.message);
    }
  };

  const handleCompletePacking = async () => {
    try {
      setLocalError(null);
      await completePacking();
      if (onPackingComplete) onPackingComplete();
    } catch (e) {
      setLocalError(e.message);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-purple-700" />
            <h3 className="text-base font-extrabold text-slate-900">
              Packing Station Workstation — {fulfillment.fulfillmentId}
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Customer: <span className="font-bold text-slate-800">{fulfillment.customerName}</span> | Packages Sealed:{' '}
            <span className="font-bold text-slate-800">{packages.length} Containers</span>
          </p>
        </div>

        {/* Workflow State Action */}
        {!isPackingActive && !isPackedDone && (
          <button
            type="button"
            disabled={processing}
            onClick={handleStartPacking}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <PackageCheck className="w-4 h-4" /> Begin Packing Station
          </button>
        )}

        {isPackingActive && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-2 bg-[#714B67] hover:bg-[#56384E] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" /> Create Container
            </button>

            {allItemsPacked && (
              <button
                type="button"
                disabled={processing}
                onClick={handleCompletePacking}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" /> Complete Packing
              </button>
            )}
          </div>
        )}

        {isPackedDone && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-fuchsia-50 text-fuchsia-800 text-xs font-bold rounded-full border border-fuchsia-200">
            <CheckCircle2 className="w-4 h-4" /> All Packages Sealed & Complete
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

      {/* Grid Layout: Picked Items Status + Created Packages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Picked Items Packing Progress */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-600" /> Picked Line Items Status
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs font-medium">
            {fulfillment.items?.map((item) => {
              const unpacked = item.pickedQuantity - item.packedQuantity;
              const isItemPacked = unpacked === 0;

              return (
                <div key={item.itemId} className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">{item.productName}</span>
                    <span className="text-[11px] text-slate-400 font-mono">SKU: {item.sku}</span>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-extrabold text-slate-800">
                      Packed: <span className="text-purple-700">{item.packedQuantity}</span> / {item.pickedQuantity}
                    </div>
                    {isItemPacked ? (
                      <span className="text-[10px] font-bold text-emerald-600 inline-flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Fully Containerized
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-600 mt-0.5 block">
                        {unpacked} units unassigned
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Created Packages */}
        <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-purple-600" /> Sealed Package Containers ({packages.length})
            </span>
          </div>

          <div className="p-4 flex-1 space-y-3 max-h-80 overflow-y-auto">
            {packages.length > 0 ? (
              packages.map((pkg) => (
                <div
                  key={pkg.packageId}
                  className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-purple-900">{pkg.packageNumber}</span>
                    <FulfillmentStatusBadge status={pkg.status} type="PACKAGE" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-600 text-[11px]">
                    <div className="flex items-center gap-1">
                      <Scale className="w-3 h-3 text-slate-400" />
                      <span>
                        Weight: <strong>{pkg.weight} {pkg.weightUnit}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Ruler className="w-3 h-3 text-slate-400" />
                      <span>
                        Dim: <strong>{pkg.length}×{pkg.width}×{pkg.height} {pkg.dimensionUnit}</strong>
                      </span>
                    </div>
                  </div>

                  {pkg.notes && <p className="text-[11px] text-slate-500 italic">"{pkg.notes}"</p>}
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <Package className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-medium">No packages created yet for this order.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Package Form Modal */}
      <PackageFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fulfillment={fulfillment}
        onSubmitPackage={handlePackageSubmit}
      />
    </div>
  );
};
