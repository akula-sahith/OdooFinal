/**
 * Customer Portal Order Fulfillment & Delivery Tracking Page
 * Route: /customer/orders/:orderId
 * Phase 13 — DealFlow360
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { fulfillmentService } from '../services/fulfillmentService';
import { ShipmentTrackingTimeline } from '../components/ShipmentTrackingTimeline';
import { FulfillmentStatusBadge } from '../components/FulfillmentStatusBadge';

export const CustomerOrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [fulfillment, setFulfillment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomerData = async () => {
      setLoading(true);
      try {
        const [shpList, fulList] = await Promise.all([
          fulfillmentService.getShipments({ search: orderId }),
          fulfillmentService.getFulfillments({ search: orderId }),
        ]);

        const orderShipments = shpList.filter((s) => s.orderId === orderId);
        const orderFulfillment = fulList.find((f) => f.orderId === orderId);

        setShipments(orderShipments);
        setFulfillment(orderFulfillment);
      } catch (e) {
        console.error('Error loading customer tracking:', e);
      } finally {
        setLoading(false);
      }
    };
    loadCustomerData();
  }, [orderId]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4 bg-white rounded-2xl border border-slate-200">
        <div className="w-10 h-10 border-4 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Retrieving order tracking milestones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/customer/quotations')}
          className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900">Order Delivery & Shipment Tracking</h1>
          <p className="text-xs text-slate-500 font-medium">Order Reference #{orderId}</p>
        </div>
      </div>

      {/* Overview Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Order ID</span>
            <span className="font-mono font-bold text-[#714B67] mt-1 block">{orderId}</span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Fulfillment Status</span>
            <div className="mt-1">
              <FulfillmentStatusBadge status={fulfillment?.status || 'PROCESSING'} />
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Consignments</span>
            <span className="font-bold text-slate-900 mt-1 block">
              {shipments.length} Active Shipment(s)
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Shipping Destination</span>
            <span className="font-bold text-slate-800 mt-1 block truncate">
              {fulfillment?.shippingAddress?.city || 'Customer Destination'}, {fulfillment?.shippingAddress?.country || 'USA'}
            </span>
          </div>
        </div>
      </div>

      {/* Customer Safe Visual Tracking Timeline */}
      {shipments.length > 0 ? (
        <div className="space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#714B67]" /> Shipment Consignment Timeline & Progress
          </h3>
          {shipments.map((shp) => (
            <ShipmentTrackingTimeline key={shp.shipmentId} shipment={shp} isCustomerView={true} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <Package className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">Order Prepared for Dispatch</h3>
          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
            Your order has been allocated and is currently being containerized in our distribution center. Tracking details will update once handed to the carrier.
          </p>
        </div>
      )}
    </div>
  );
};
