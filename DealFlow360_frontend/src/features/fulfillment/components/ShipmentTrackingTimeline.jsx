/**
 * Customer & Internal Visual Shipment Tracking Timeline Component
 * Safe for Customer Portal (Excludes internal warehouse logs & stock)
 * Phase 13 — DealFlow360
 */

import React from 'react';
import {
  Package,
  Truck,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { SHIPMENT_STATUS } from '../types/fulfillmentTypes';

export const ShipmentTrackingTimeline = ({ shipment, isCustomerView = false }) => {
  if (!shipment) return null;

  const steps = [
    {
      key: SHIPMENT_STATUS.SHIPMENT_CREATED,
      label: 'Shipment Manifest Created',
      description: 'Shipment record generated and carrier manifest assigned.',
      icon: Package,
    },
    {
      key: SHIPMENT_STATUS.SHIPPED,
      label: 'Dispatched to Carrier',
      description: 'Package handed over to shipping provider at warehouse dock.',
      icon: Truck,
    },
    {
      key: SHIPMENT_STATUS.IN_TRANSIT,
      label: 'In Transit',
      description: 'Parcel in transit through logistics sorting hub.',
      icon: Truck,
    },
    {
      key: SHIPMENT_STATUS.OUT_FOR_DELIVERY,
      label: 'Out for Delivery',
      description: 'Courier assigned and out for final destination delivery.',
      icon: MapPin,
    },
    {
      key: SHIPMENT_STATUS.DELIVERED,
      label: 'Delivered',
      description: 'Package successfully delivered and confirmed.',
      icon: CheckCircle2,
    },
  ];

  const statusOrder = [
    SHIPMENT_STATUS.SHIPMENT_CREATED,
    SHIPMENT_STATUS.SHIPPED,
    SHIPMENT_STATUS.IN_TRANSIT,
    SHIPMENT_STATUS.OUT_FOR_DELIVERY,
    SHIPMENT_STATUS.DELIVERED,
  ];

  const currentIndex = statusOrder.indexOf(shipment.status);
  const isFailed = shipment.status === SHIPMENT_STATUS.DELIVERY_FAILED;
  const isReturned = shipment.status === SHIPMENT_STATUS.RETURNED;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-6 space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Carrier Tracking Number
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-base font-mono font-extrabold text-slate-900">
              {shipment.trackingNumber}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-slate-100 text-slate-700 rounded-md border border-slate-200">
              {shipment.carrierName} ({shipment.carrierCode})
            </span>
          </div>
        </div>

        {/* Tracking URL Link */}
        {shipment.trackingNumber && (
          <a
            href={`https://www.google.com/search?q=${shipment.trackingNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Track with Carrier</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Exception Warning Banner */}
      {isFailed && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-xs font-semibold">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <p className="font-bold">Delivery Exception Encountered</p>
            <p className="text-[11px] text-rose-600 font-medium">
              The carrier attempted delivery but was unsuccessful. Customer support is coordinating re-attempt.
            </p>
          </div>
        </div>
      )}

      {isReturned && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-3 text-orange-800 text-xs font-semibold">
          <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0" />
          <div>
            <p className="font-bold">Shipment Returned to Sender</p>
            <p className="text-[11px] text-orange-600 font-medium">
              This package has been returned to the fulfillment origin warehouse.
            </p>
          </div>
        </div>
      )}

      {/* Step Progress Bar */}
      <div className="relative py-4">
        <div className="hidden md:flex items-center justify-between relative z-10">
          {steps.map((step, idx) => {
            const isCompleted = currentIndex >= idx;
            const isCurrent = currentIndex === idx;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex flex-col items-center text-center max-w-[140px]">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? 'bg-[#714B67] border-[#714B67] text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-300'
                  } ${isCurrent ? 'ring-4 ring-[#714B67]/20' : ''}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs font-bold mt-2 ${
                    isCompleted ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit History Timeline */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Tracking Milestone History
        </h4>

        <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
          {shipment.history?.map((h, i) => (
            <div key={i} className="p-3.5 flex items-start gap-3 bg-white text-xs">
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-[#714B67]">
                <Clock className="w-4 h-4" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    {h.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {new Date(h.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium mt-0.5">{h.notes}</p>
                {!isCustomerView && h.actor && (
                  <span className="text-[10px] text-slate-400 mt-1 block">Source: {h.actor}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
