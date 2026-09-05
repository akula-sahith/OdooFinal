import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Package, Calendar, ExternalLink } from 'lucide-react';
import { ShipmentStatusBadge } from '../../fulfillment/components/FulfillmentStatusBadge';

export const ShipmentTrackingCard = ({ shipment }) => {
  const navigate = useNavigate();

  if (!shipment) return null;

  const {
    shipmentId,
    shipmentNumber,
    orderId,
    carrierName,
    trackingNumber,
    status,
    shippedDate,
    expectedDelivery,
    deliveredDate,
    packagesCount,
  } = shipment;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#714B67] flex items-center justify-center font-bold border border-purple-200">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 font-mono">
              {shipmentNumber || shipmentId}
            </h4>
            <p className="text-xs text-slate-500 font-medium">Order Ref #{orderId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ShipmentStatusBadge status={status} />
          <button
            type="button"
            onClick={() => navigate(`/customer/shipments/${shipmentId}`)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
            title="View Full Shipment Details"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Logistics Carrier</span>
          <span className="font-extrabold text-slate-800 mt-0.5 block">{carrierName || 'Freight Partner'}</span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Tracking Reference</span>
          <span className="font-mono font-bold text-[#714B67] mt-0.5 block">
            {trackingNumber || 'Pending Waybill'}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Dispatch Date</span>
          <span className="text-slate-700 mt-0.5 block">{shippedDate || 'Processing'}</span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Expected Delivery</span>
          <span className="font-bold text-emerald-700 mt-0.5 block">
            {deliveredDate ? `Delivered: ${deliveredDate}` : expectedDelivery || 'In Transit'}
          </span>
        </div>
      </div>
    </div>
  );
};
