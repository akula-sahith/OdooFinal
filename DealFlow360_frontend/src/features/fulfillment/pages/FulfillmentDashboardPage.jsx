/**
 * Main Fulfillment Operational Dashboard Page
 * Route: /company/fulfillment
 * Phase 13 — DealFlow360
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import {
  Package,
  Layers,
  PackageCheck,
  Truck,
  CheckCircle2,
  Settings,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useFulfillments } from '../hooks/useFulfillments';
import { useShipments } from '../hooks/useShipments';
import { FulfillmentFilters } from '../components/FulfillmentFilters';
import { FulfillmentTable } from '../components/FulfillmentTable';
import { ShipmentCreationModal } from '../components/ShipmentCreationModal';
import { FULFILLMENT_STATUS, SHIPMENT_STATUS } from '../types/fulfillmentTypes';

export const FulfillmentDashboardPage = () => {
  const navigate = useNavigate();
  const { fulfillments, loading, params, updateFilters, refetch } = useFulfillments();
  const { shipments, createShipment } = useShipments();

  const [selectedFulfillmentForShipment, setSelectedFulfillmentForShipment] = useState(null);

  // Authoritative calculated metrics from real domain state (no fabricated data)
  const readyCount = fulfillments.filter((f) => f.status === FULFILLMENT_STATUS.READY).length;
  const pickingCount = fulfillments.filter((f) => f.status === FULFILLMENT_STATUS.PICKING).length;
  const packingCount = fulfillments.filter((f) => f.status === FULFILLMENT_STATUS.PACKING).length;
  const readyToShipCount = fulfillments.filter((f) => f.status === FULFILLMENT_STATUS.PACKED).length;
  const activeShipmentsCount = shipments.filter(
    (s) =>
      s.status === SHIPMENT_STATUS.SHIPMENT_CREATED ||
      s.status === SHIPMENT_STATUS.SHIPPED ||
      s.status === SHIPMENT_STATUS.IN_TRANSIT ||
      s.status === SHIPMENT_STATUS.OUT_FOR_DELIVERY
  ).length;
  const deliveredCount = fulfillments.filter((f) => f.status === FULFILLMENT_STATUS.COMPLETED).length;

  const handleShipmentSubmit = async (shipmentData) => {
    if (!selectedFulfillmentForShipment) return;
    try {
      await createShipment(selectedFulfillmentForShipment.fulfillmentId, shipmentData, 'Logistics Lead');
      setSelectedFulfillmentForShipment(null);
      refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Fulfillment, Packing & Logistics Workspace"
        subtitle="Manage warehouse picking queues, packing container assembly, carrier manifests, and shipment delivery tracking."
        badgeText={`${fulfillments.length} Active Orders`}
        badgeVariant="plum"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/company/fulfillment/picking')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#714B67]" /> Picking Queue
          </button>
          <button
            type="button"
            onClick={() => navigate('/company/fulfillment/packing')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PackageCheck className="w-4 h-4 text-purple-700" /> Packing Queue
          </button>
          <button
            type="button"
            onClick={() => navigate('/company/fulfillment/shipments')}
            className="px-3.5 py-2 bg-[#714B67] hover:bg-[#56384E] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Truck className="w-4 h-4 text-white" /> Shipments
          </button>
          <button
            type="button"
            onClick={() => navigate('/company/fulfillment/carriers')}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
            title="Configure Shipping Carriers"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </PageHeader>

      {/* Authoritative Dashboard Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Ready for Pick
            </span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{readyCount}</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Currently Picking
            </span>
            <Layers className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{pickingCount}</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Currently Packing
            </span>
            <PackageCheck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{packingCount}</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Ready to Ship
            </span>
            <Truck className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{readyToShipCount}</p>
        </div>

        {/* Metric 5 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Active Shipments
            </span>
            <Truck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{activeShipmentsCount}</p>
        </div>

        {/* Metric 6 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Delivered
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{deliveredCount}</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <FulfillmentFilters
        filters={params}
        onFilterChange={updateFilters}
        onReset={() => updateFilters({ status: '', search: '', warehouseId: '', priority: '' })}
      />

      {/* Main Fulfillment Data Table */}
      <FulfillmentTable
        fulfillments={fulfillments}
        loading={loading}
        onCreateShipmentClick={(item) => setSelectedFulfillmentForShipment(item)}
      />

      {/* Create Shipment Modal */}
      <ShipmentCreationModal
        isOpen={Boolean(selectedFulfillmentForShipment)}
        onClose={() => setSelectedFulfillmentForShipment(null)}
        fulfillment={selectedFulfillmentForShipment}
        onSubmitShipment={handleShipmentSubmit}
      />
    </div>
  );
};
