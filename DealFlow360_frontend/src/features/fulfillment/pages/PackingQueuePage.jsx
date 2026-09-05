/**
 * Warehouse Packing Station Queue & Assembly Page
 * Route: /company/fulfillment/packing
 * Phase 13 — DealFlow360
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import { PackageCheck, ArrowLeft, Package } from 'lucide-react';
import { useFulfillments } from '../hooks/useFulfillments';
import { useFulfillment } from '../hooks/useFulfillment';
import { PackingWorkstation } from '../components/PackingWorkstation';
import { FULFILLMENT_STATUS } from '../types/fulfillmentTypes';

export const PackingQueuePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedIdFromUrl = searchParams.get('id');

  const { fulfillments, refetch: refetchList } = useFulfillments();
  const [selectedFulfillmentId, setSelectedFulfillmentId] = useState(selectedIdFromUrl || '');

  const { fulfillment, packages, refetch: refetchDetail } = useFulfillment(selectedFulfillmentId);

  useEffect(() => {
    if (selectedIdFromUrl) {
      setSelectedFulfillmentId(selectedIdFromUrl);
    } else if (fulfillments.length > 0 && !selectedFulfillmentId) {
      const active = fulfillments.find(
        (f) => f.status === FULFILLMENT_STATUS.PICKED || f.status === FULFILLMENT_STATUS.PACKING
      );
      if (active) setSelectedFulfillmentId(active.fulfillmentId);
    }
  }, [selectedIdFromUrl, fulfillments]);

  const packingQueue = fulfillments.filter(
    (f) =>
      f.status === FULFILLMENT_STATUS.PICKED ||
      f.status === FULFILLMENT_STATUS.PACKING ||
      f.status === FULFILLMENT_STATUS.PACKED
  );

  const handleRefresh = () => {
    refetchList();
    refetchDetail();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Bar */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/company/fulfillment')}
          className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <PageHeader
          title="Packing Station Queue & Assembly"
          subtitle="Assemble multi-package containers, calculate dimensions and weights, and seal dispatch cartons."
          badgeText={`${packingQueue.length} Orders Ready to Pack`}
          badgeVariant="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Queue Selector */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-4 space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Packing Queue Orders
          </span>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {packingQueue.map((item) => {
              const isSelected = item.fulfillmentId === selectedFulfillmentId;

              return (
                <div
                  key={item.fulfillmentId}
                  onClick={() => setSelectedFulfillmentId(item.fulfillmentId)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-purple-50/70 border-purple-600 ring-1 ring-purple-600/30'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-purple-900">
                      {item.fulfillmentId}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        item.status === 'PACKING'
                          ? 'bg-purple-100 text-purple-800'
                          : item.status === 'PACKED'
                          ? 'bg-fuchsia-100 text-fuchsia-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900 truncate">{item.customerName}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>{item.warehouseName}</span>
                    <span className="font-bold text-slate-700">{item.items?.length || 0} Items</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Workstation */}
        <div className="lg:col-span-2">
          {fulfillment ? (
            <PackingWorkstation
              fulfillment={fulfillment}
              packages={packages}
              onRefresh={handleRefresh}
              onPackingComplete={handleRefresh}
            />
          ) : (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-16 text-center space-y-3">
              <Package className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">Select an Order to Begin Packing</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Choose an order from the queue to assemble packages and assign picked quantities.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
