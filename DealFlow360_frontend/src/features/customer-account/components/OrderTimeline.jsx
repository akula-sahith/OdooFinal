import React from 'react';
import { CheckCircle2, Clock, Circle } from 'lucide-react';

/**
 * OrderTimeline Component
 * Renders actual milestones for an order.
 */
export const OrderTimeline = ({ order, fulfillment, shipments = [] }) => {
  // Build milestones strictly from provided backend data
  const milestones = [];

  if (order?.orderDate || order?.createdAt) {
    milestones.push({
      key: 'ACCEPTED',
      label: 'Quotation Accepted & Order Created',
      timestamp: order.orderDate || order.createdAt,
      status: 'COMPLETED',
    });
  }

  if (order?.status && order.status !== 'DRAFT') {
    milestones.push({
      key: 'CONFIRMED',
      label: 'Order Confirmed',
      timestamp: order.orderDate,
      status: 'COMPLETED',
    });
  }

  if (fulfillment?.status) {
    const isFulfilling = ['ALLOCATED', 'PICKING', 'PACKING', 'READY'].includes(fulfillment.status);
    milestones.push({
      key: 'PROCESSING',
      label: `Warehouse Fulfillment (${fulfillment.status})`,
      timestamp: fulfillment.updatedAt || 'In Progress',
      status: isFulfilling ? 'IN_PROGRESS' : 'COMPLETED',
    });
  }

  if (shipments.length > 0) {
    shipments.forEach((shp) => {
      milestones.push({
        key: `SHIPMENT_${shp.shipmentId}`,
        label: `Shipment ${shp.shipmentNumber || shp.shipmentId} (${shp.status})`,
        timestamp: shp.shippedDate || shp.updatedAt || 'Active',
        status: shp.status === 'DELIVERED' ? 'COMPLETED' : 'IN_PROGRESS',
      });
    });
  }

  if (milestones.length === 0) {
    return (
      <div className="p-4 text-xs text-slate-500 italic bg-slate-50 rounded-xl border border-slate-200">
        No tracking milestones recorded yet.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
      <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
        <Clock className="w-4 h-4 text-[#714B67]" />
        Order Execution Milestones
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {milestones.map((ms, idx) => {
          const isDone = ms.status === 'COMPLETED';
          const isCurrent = ms.status === 'IN_PROGRESS';

          return (
            <div key={idx} className="relative flex items-start justify-between text-xs">
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-100 animate-pulse"></div>
                ) : (
                  <Circle className="w-4 h-4 text-slate-300" />
                )}
              </div>

              <div>
                <span className={`font-extrabold block text-sm ${isDone ? 'text-slate-900' : isCurrent ? 'text-amber-800' : 'text-slate-500'}`}>
                  {ms.label}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{ms.timestamp}</span>
              </div>

              <div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isDone
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : isCurrent
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {ms.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
