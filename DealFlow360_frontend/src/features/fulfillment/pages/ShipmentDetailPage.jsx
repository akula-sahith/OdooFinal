/**
 * Detailed Shipment Management & Lifecycle Control Page
 * Route: /company/fulfillment/shipments/:shipmentId
 * Phase 13 — DealFlow360
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import {
  ArrowLeft,
  Truck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Send,
  MapPin,
} from 'lucide-react';
import { useShipment } from '../hooks/useShipment';
import { ShipmentTrackingTimeline } from '../components/ShipmentTrackingTimeline';
import { FulfillmentStatusBadge } from '../components/FulfillmentStatusBadge';
import { SHIPMENT_STATUS } from '../types/fulfillmentTypes';

export const ShipmentDetailPage = () => {
  const { shipmentId } = useParams();
  const navigate = useNavigate();
  const { shipment, loading, error, refetch, shipShipment, updateStatus } = useShipment(shipmentId);

  const [notesInput, setNotesInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [actionError, setActionError] = useState(null);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading shipment #{shipmentId}...</p>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <Truck className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">{error || 'Shipment Manifest Not Found'}</h3>
        <button
          onClick={() => navigate('/company/fulfillment/shipments')}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          Return to Shipments List
        </button>
      </div>
    );
  }

  const handleShipAction = async () => {
    setProcessing(true);
    setActionError(null);
    try {
      await shipShipment('Dispatch Ops Lead');
      refetch();
    } catch (e) {
      setActionError(e.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleStatusTransition = async (targetStatus) => {
    setProcessing(true);
    setActionError(null);
    try {
      await updateStatus(targetStatus, notesInput || `Transitioned to ${targetStatus}`, 'Ops Manager');
      setNotesInput('');
      refetch();
    } catch (e) {
      setActionError(e.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/company/fulfillment/shipments')}
          className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <PageHeader
          title={`Shipment ${shipment.shipmentNumber}`}
          subtitle={`Fulfillment ID #${shipment.fulfillmentId} — Order #${shipment.orderId}`}
          badgeText={shipment.carrierName}
          badgeVariant="amber"
        />
      </div>

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-xs font-semibold">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <p>{actionError}</p>
        </div>
      )}

      {/* Control Banner & Quick Action Workflow */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Current Shipment Status
            </span>
            <div className="mt-1">
              <FulfillmentStatusBadge status={shipment.status} type="SHIPMENT" />
            </div>
          </div>

          {/* Workflow Transitions Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {shipment.status === SHIPMENT_STATUS.SHIPMENT_CREATED && (
              <button
                type="button"
                disabled={processing}
                onClick={handleShipAction}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> Dispatch / Mark Shipped
              </button>
            )}

            {shipment.status === SHIPMENT_STATUS.SHIPPED && (
              <button
                type="button"
                disabled={processing}
                onClick={() => handleStatusTransition(SHIPMENT_STATUS.IN_TRANSIT)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Truck className="w-4 h-4" /> Mark In Transit
              </button>
            )}

            {shipment.status === SHIPMENT_STATUS.IN_TRANSIT && (
              <button
                type="button"
                disabled={processing}
                onClick={() => handleStatusTransition(SHIPMENT_STATUS.OUT_FOR_DELIVERY)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <MapPin className="w-4 h-4" /> Mark Out For Delivery
              </button>
            )}

            {shipment.status === SHIPMENT_STATUS.OUT_FOR_DELIVERY && (
              <>
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => handleStatusTransition(SHIPMENT_STATUS.DELIVERED)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirm Delivered
                </button>
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => handleStatusTransition(SHIPMENT_STATUS.DELIVERY_FAILED)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <AlertTriangle className="w-4 h-4" /> Report Delivery Failed
                </button>
              </>
            )}

            {shipment.status === SHIPMENT_STATUS.DELIVERY_FAILED && (
              <button
                type="button"
                disabled={processing}
                onClick={() => handleStatusTransition(SHIPMENT_STATUS.RETURNED)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" /> Process Carrier Return
              </button>
            )}
          </div>
        </div>

        {/* Optional Transition Notes Field */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add optional operational notes for this status change..."
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
            className="flex-1 h-9 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
        </div>
      </div>

      {/* Visual Shipment Timeline */}
      <ShipmentTrackingTimeline shipment={shipment} />
    </div>
  );
};
