/**
 * Logistics Shipments Management List Page
 * Route: /company/fulfillment/shipments
 * Phase 13 — DealFlow360
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import {
  Truck,
  Search,
  Eye,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Barcode,
  ExternalLink,
} from 'lucide-react';
import { useShipments } from '../hooks/useShipments';
import { FulfillmentStatusBadge } from '../components/FulfillmentStatusBadge';
import { SHIPMENT_STATUS } from '../types/fulfillmentTypes';

export const ShipmentListPage = () => {
  const navigate = useNavigate();
  const { shipments, loading, params, updateFilters, refetch } = useShipments();

  return (
    <div className="space-y-6 pb-12">
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
          title="Outbound Shipments & Carrier Logistics"
          subtitle="Monitor active carrier consignments, tracking numbers, and delivery milestones."
          badgeText={`${shipments.length} Total Shipments`}
          badgeVariant="amber"
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Tracking #, Shipment ID, Order #, or Recipient..."
            value={params.search || ''}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="w-full h-10 pl-9 pr-4 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={params.status || ''}
            onChange={(e) => updateFilters({ status: e.target.value })}
            className="h-10 px-3 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none cursor-pointer"
          >
            <option value="">All Shipment Statuses</option>
            {Object.values(SHIPMENT_STATUS).map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white border border-slate-200 p-12 text-center shadow-2xs rounded-2xl">
          <div className="w-8 h-8 border-4 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-500 mt-2">Loading shipment manifests...</p>
        </div>
      ) : shipments.length > 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Shipment Number</th>
                  <th className="py-3.5 px-4">Order Number</th>
                  <th className="py-3.5 px-4">Carrier & Tracking</th>
                  <th className="py-3.5 px-4">Recipient Destination</th>
                  <th className="py-3.5 px-4">Shipment Status</th>
                  <th className="py-3.5 px-4">Est. Delivery</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {shipments.map((shp) => (
                  <tr key={shp.shipmentId} className="hover:bg-slate-50/80 transition-colors">
                    {/* Shipment Number */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#714B67]">
                      <button
                        onClick={() => navigate(`/company/fulfillment/shipments/${shp.shipmentId}`)}
                        className="hover:underline cursor-pointer"
                      >
                        {shp.shipmentNumber}
                      </button>
                    </td>

                    {/* Order Number */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                      {shp.orderId}
                    </td>

                    {/* Carrier & Tracking */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{shp.carrierName}</div>
                      <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                        <Barcode className="w-3 h-3 text-slate-400" />
                        <span>{shp.trackingNumber}</span>
                      </div>
                    </td>

                    {/* Recipient */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block truncate max-w-[160px]">
                        {shp.shippingAddress?.recipientName}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        {shp.shippingAddress?.city}, {shp.shippingAddress?.country}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <FulfillmentStatusBadge status={shp.status} type="SHIPMENT" />
                    </td>

                    {/* Est Delivery */}
                    <td className="py-3.5 px-4 text-slate-600 font-semibold">
                      {shp.estimatedDeliveryAt
                        ? new Date(shp.estimatedDeliveryAt).toLocaleDateString()
                        : 'N/A'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/company/fulfillment/shipments/${shp.shipmentId}`)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="View Detailed Shipment Tracking & Control"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-16 text-center space-y-3">
          <Truck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Shipments Found</h3>
          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
            No active shipment manifests exist. Complete container packing to generate shipments.
          </p>
        </div>
      )}
    </div>
  );
};
