/**
 * Warehouse Picking Workstation Queue & Execution Page
 * Route: /company/fulfillment/picking
 * Phase 13 — DealFlow360
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Layers, ArrowLeft, CheckCircle2, Warehouse, Search } from 'lucide-react';
import { useFulfillments } from '../hooks/useFulfillments';
import { PickingWorkstation } from '../components/PickingWorkstation';
import { FULFILLMENT_STATUS } from '../types/fulfillmentTypes';

export const PickingQueuePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedIdFromUrl = searchParams.get('id');

  const { fulfillments, loading, refetch } = useFulfillments();
  const [selectedFulfillmentId, setSelectedFulfillmentId] = useState(selectedIdFromUrl || '');

  useEffect(() => {
    if (selectedIdFromUrl) {
      setSelectedFulfillmentId(selectedIdFromUrl);
    } else if (fulfillments.length > 0 && !selectedFulfillmentId) {
      // Pick first ready or picking fulfillment
      const active = fulfillments.find(
        (f) => f.status === FULFILLMENT_STATUS.READY || f.status === FULFILLMENT_STATUS.PICKING
      );
      if (active) setSelectedFulfillmentId(active.fulfillmentId);
    }
  }, [selectedIdFromUrl, fulfillments]);

  const activeFulfillment = fulfillments.find((f) => f.fulfillmentId === selectedFulfillmentId);

  const pickingQueue = fulfillments.filter(
    (f) =>
      f.status === FULFILLMENT_STATUS.READY ||
      f.status === FULFILLMENT_STATUS.PICKING ||
      f.status === FULFILLMENT_STATUS.PICKED
  );

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
          title="Warehouse Picking Queue & Workstation"
          subtitle="Retrieve allocated line items from warehouse bin locations and confirm picked quantities."
          badgeText={`${pickingQueue.length} Orders in Queue`}
          badgeVariant="sky"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Queue Selector List */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-4 space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Picking Queue Orders
          </span>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {pickingQueue.map((item) => {
              const isSelected = item.fulfillmentId === selectedFulfillmentId;
              const totalItems = item.items?.length || 0;

              return (
                <div
                  key={item.fulfillmentId}
                  onClick={() => setSelectedFulfillmentId(item.fulfillmentId)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-[#714B67]/5 border-[#714B67] ring-1 ring-[#714B67]/30'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#714B67]">
                      {item.fulfillmentId}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        item.status === 'PICKING'
                          ? 'bg-sky-100 text-sky-800'
                          : item.status === 'PICKED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900 truncate">{item.customerName}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>{item.warehouseName}</span>
                    <span className="font-bold text-slate-700">{totalItems} Line Items</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Workstation */}
        <div className="lg:col-span-2">
          {activeFulfillment ? (
            <PickingWorkstation
              fulfillment={activeFulfillment}
              onRefresh={refetch}
              onPickingComplete={() => refetch()}
            />
          ) : (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-16 text-center space-y-3">
              <Layers className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">Select an Order to Start Picking</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Choose an order from the queue on the left to begin item retrieval at bin locations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
