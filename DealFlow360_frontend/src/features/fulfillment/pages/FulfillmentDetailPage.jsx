/**
 * Comprehensive Fulfillment Detail & Operational Workstation Page
 * Route: /company/fulfillment/:fulfillmentId
 * Phase 13 — DealFlow360
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import {
  ArrowLeft,
  Package,
  Layers,
  PackageCheck,
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useFulfillment } from '../hooks/useFulfillment';
import { FulfillmentStatusBadge } from '../components/FulfillmentStatusBadge';
import { PickingWorkstation } from '../components/PickingWorkstation';
import { PackingWorkstation } from '../components/PackingWorkstation';
import { ShipmentCreationModal } from '../components/ShipmentCreationModal';
import { ShipmentTrackingTimeline } from '../components/ShipmentTrackingTimeline';
import { useShipments } from '../hooks/useShipments';
import { FULFILLMENT_STATUS } from '../types/fulfillmentTypes';

export const FulfillmentDetailPage = () => {
  const { fulfillmentId } = useParams();
  const navigate = useNavigate();
  const { fulfillment, auditLogs, packages, shipments, loading, error, refetch } = useFulfillment(fulfillmentId);
  const { createShipment } = useShipments();

  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading fulfillment record #{fulfillmentId}...</p>
      </div>
    );
  }

  if (error || !fulfillment) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <Package className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">{error || 'Fulfillment Record Not Found'}</h3>
        <button
          onClick={() => navigate('/company/fulfillment')}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const timelineSteps = [
    { label: 'Order Ready', statusKey: FULFILLMENT_STATUS.READY },
    { label: 'Picking', statusKey: FULFILLMENT_STATUS.PICKING },
    { label: 'Picked', statusKey: FULFILLMENT_STATUS.PICKED },
    { label: 'Packing', statusKey: FULFILLMENT_STATUS.PACKING },
    { label: 'Packed', statusKey: FULFILLMENT_STATUS.PACKED },
    { label: 'Shipment Created', statusKey: FULFILLMENT_STATUS.SHIPMENT_CREATED },
    { label: 'Shipped', statusKey: FULFILLMENT_STATUS.COMPLETED },
    { label: 'Delivered', statusKey: FULFILLMENT_STATUS.COMPLETED },
  ];

  const handleShipmentSubmit = async (shipmentData) => {
    try {
      await createShipment(fulfillment.fulfillmentId, shipmentData, 'Logistics Lead');
      setIsShipmentModalOpen(false);
      refetch();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/company/fulfillment')}
          className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <PageHeader
          title={`Fulfillment ${fulfillment.fulfillmentId}`}
          subtitle={`Associated Sales Order #${fulfillment.orderId} — ${fulfillment.customerName}`}
          badgeText={fulfillment.priority + ' PRIORITY'}
          badgeVariant={fulfillment.priority === 'URGENT' ? 'rose' : 'plum'}
        />
      </div>

      {/* Overview Header Info Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-xs">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Current Status</span>
            <div className="mt-1">
              <FulfillmentStatusBadge status={fulfillment.status} />
            </div>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Warehouse</span>
            <span className="font-bold text-slate-900 mt-1 block truncate">
              {fulfillment.warehouseName}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Assigned Staff</span>
            <span className="font-bold text-slate-900 mt-1 block truncate">
              {fulfillment.assignedTo || 'Unassigned'}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Created Date</span>
            <span className="font-bold text-slate-900 mt-1 block">
              {new Date(fulfillment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Containers</span>
            <span className="font-bold text-slate-900 mt-1 block">
              {packages.length} Sealed Package(s)
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Shipment Manifests</span>
            <span className="font-bold text-slate-900 mt-1 block">
              {shipments.length} Active Manifest(s)
            </span>
          </div>
        </div>

        {/* Operational Visual Pipeline Timeline */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
            Fulfillment Stage Pipeline Progress
          </span>
          <div className="flex items-center justify-between text-center overflow-x-auto pb-2">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center min-w-[90px] px-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                    fulfillment.status === step.statusKey
                      ? 'bg-[#714B67] text-white border-[#714B67] ring-4 ring-[#714B67]/20'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {idx + 1}
                </div>
                <span className="text-[10px] font-bold text-slate-700 mt-1.5">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        {[
          { id: 'OVERVIEW', label: 'Items & Address Snapshot', icon: Package },
          { id: 'PICKING', label: 'Picking Workstation', icon: Layers },
          { id: 'PACKING', label: 'Packing Workstation', icon: PackageCheck },
          { id: 'SHIPMENT', label: 'Shipments & Tracking', icon: Truck },
          { id: 'AUDIT', label: 'Operational Audit Trail', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#714B67] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Fulfillment Items Table */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#714B67]" /> Operational Line Items & Progress Quantities
            </h3>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4 text-center">Ordered</th>
                    <th className="py-3 px-4 text-center">Allocated</th>
                    <th className="py-3 px-4 text-center">Picked</th>
                    <th className="py-3 px-4 text-center">Packed</th>
                    <th className="py-3 px-4 text-center">Shipped</th>
                    <th className="py-3 px-4 text-center">Delivered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-800">
                  {fulfillment.items?.map((item) => (
                    <tr key={item.itemId} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{item.productName}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{item.sku}</td>
                      <td className="py-3 px-4 text-center">{item.orderedQuantity}</td>
                      <td className="py-3 px-4 text-center text-emerald-700 font-bold">{item.allocatedQuantity}</td>
                      <td className="py-3 px-4 text-center text-sky-700 font-bold">{item.pickedQuantity}</td>
                      <td className="py-3 px-4 text-center text-purple-700 font-bold">{item.packedQuantity}</td>
                      <td className="py-3 px-4 text-center text-amber-700 font-bold">{item.shippedQuantity}</td>
                      <td className="py-3 px-4 text-center text-emerald-800 font-extrabold">{item.deliveredQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Shipping Address Snapshot Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-6 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" /> Shipping Destination Snapshot
            </h3>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 font-medium text-slate-700">
              <p className="font-bold text-slate-900 text-sm">
                {fulfillment.shippingAddress?.recipientName}
              </p>
              {fulfillment.shippingAddress?.companyName && (
                <p className="font-semibold text-slate-600">{fulfillment.shippingAddress.companyName}</p>
              )}
              <p>{fulfillment.shippingAddress?.addressLine1}</p>
              {fulfillment.shippingAddress?.addressLine2 && <p>{fulfillment.shippingAddress.addressLine2}</p>}
              <p>
                {fulfillment.shippingAddress?.city}, {fulfillment.shippingAddress?.state}{' '}
                {fulfillment.shippingAddress?.postalCode}
              </p>
              <p className="font-bold text-slate-800">{fulfillment.shippingAddress?.country}</p>
              {fulfillment.shippingAddress?.phone && (
                <p className="text-slate-500 font-mono text-[11px] pt-1">Phone: {fulfillment.shippingAddress.phone}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: PICKING */}
      {activeTab === 'PICKING' && (
        <PickingWorkstation fulfillment={fulfillment} onRefresh={refetch} />
      )}

      {/* Tab 3: PACKING */}
      {activeTab === 'PACKING' && (
        <PackingWorkstation fulfillment={fulfillment} packages={packages} onRefresh={refetch} />
      )}

      {/* Tab 4: SHIPMENT */}
      {activeTab === 'SHIPMENT' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Shipment Manifests & Carrier Tracking</h3>
            {fulfillment.status === FULFILLMENT_STATUS.PACKED && (
              <button
                type="button"
                onClick={() => setIsShipmentModalOpen(true)}
                className="px-4 py-2 bg-[#714B67] hover:bg-[#56384E] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Truck className="w-4 h-4 text-white" /> Create Shipment Manifest
              </button>
            )}
          </div>

          {shipments.length > 0 ? (
            shipments.map((shp) => <ShipmentTrackingTimeline key={shp.shipmentId} shipment={shp} />)
          ) : (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center space-y-3">
              <Truck className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">No Shipment Manifest Created Yet</h4>
              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                Once packing container assembly is complete (PACKED), you can create and dispatch shipment manifests.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: AUDIT TRAIL */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Fulfillment Operational Audit Trail
          </h3>

          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.auditId} className="p-4 flex items-start justify-between text-xs bg-white">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md font-mono font-bold text-[10px] bg-slate-100 text-slate-800">
                      {log.action}
                    </span>
                    <span className="font-bold text-slate-900">{log.actor}</span>
                  </div>
                  <p className="text-slate-600 font-medium">{log.details}</p>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shipment Modal */}
      <ShipmentCreationModal
        isOpen={isShipmentModalOpen}
        onClose={() => setIsShipmentModalOpen(false)}
        fulfillment={fulfillment}
        onSubmitShipment={handleShipmentSubmit}
      />
    </div>
  );
};
