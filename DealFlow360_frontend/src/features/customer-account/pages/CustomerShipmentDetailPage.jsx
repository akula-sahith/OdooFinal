import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Truck,
  Package,
  Calendar,
  Building,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShoppingCart,
} from 'lucide-react';
import { customerPortalService } from '../services/customerPortalService';
import { ShipmentStatusBadge } from '../../fulfillment/components/FulfillmentStatusBadge';
import { ShipmentTrackingTimeline } from '../../fulfillment/components/ShipmentTrackingTimeline';

export const CustomerShipmentDetailPage = () => {
  const { shipmentId } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadShipment = async () => {
      if (!shipmentId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await customerPortalService.getShipmentById(shipmentId);
        setShipment(data);
      } catch (err) {
        console.error('Failed to load shipment details:', err);
        setError(err.message || 'Shipment record not found or unauthorized.');
      } finally {
        setLoading(false);
      }
    };
    loadShipment();
  }, [shipmentId]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4 bg-white rounded-2xl border border-slate-200">
        <div className="w-10 h-10 border-4 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Retrieving consignment waybill details...</p>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="bg-white border border-rose-200 rounded-2xl p-12 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-extrabold text-slate-900">Shipment Not Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">{error || 'You are not authorized to view this consignment.'}</p>
        <button
          type="button"
          onClick={() => navigate('/customer/shipments')}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          Back to Shipments
        </button>
      </div>
    );
  }

  const {
    shipmentNumber = shipmentId,
    orderId,
    carrierName,
    trackingNumber,
    status,
    shippedDate,
    expectedDelivery,
    deliveredDate,
    destinationAddress,
    packages = [],
  } = shipment;

  return (
    <div className="space-y-6 pb-16 text-left">
      {/* Top Navigation & Title Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/customer/shipments')}
            className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 font-mono">{shipmentNumber}</h1>
              <ShipmentStatusBadge status={status} />
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Order Ref #{orderId} • Carrier: {carrierName || 'Freight Express'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/customer/orders/${orderId}`)}
          className="px-3 py-1.5 text-xs font-bold bg-[#714B67] hover:bg-[#56384E] text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5" /> View Order #{orderId}
        </button>
      </div>

      {/* Overview Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Tracking Reference</span>
            <span className="font-mono font-bold text-[#714B67] mt-0.5 block">
              {trackingNumber || 'Waybill Pending'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Shipped Date</span>
            <span className="text-slate-800 mt-0.5 block">{shippedDate || 'Dispatch Pending'}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Expected Delivery</span>
            <span className="font-bold text-emerald-700 mt-0.5 block">
              {deliveredDate ? `Delivered: ${deliveredDate}` : expectedDelivery || 'In Transit'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Consignment Packages</span>
            <span className="font-bold text-slate-900 mt-0.5 block">
              {packages.length > 0 ? `${packages.length} Parcel(s)` : '1 Standard Freight Pallet'}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Shipment Milestones Timeline */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#714B67]" /> Consignment Milestones & Waybill Tracking
        </h3>

        <ShipmentTrackingTimeline shipment={shipment} isCustomerView={true} />
      </div>

      {/* Destination Address Card */}
      {destinationAddress && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-2">
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Shipping Destination Address</h4>
          <div className="text-xs text-slate-800 font-medium leading-relaxed">
            <p className="font-bold text-slate-900">{destinationAddress.recipientName || destinationAddress.companyName}</p>
            <p>{destinationAddress.addressLine1}</p>
            {destinationAddress.addressLine2 && <p>{destinationAddress.addressLine2}</p>}
            <p>{destinationAddress.city}, {destinationAddress.state} {destinationAddress.postalCode}, {destinationAddress.country}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerShipmentDetailPage;
