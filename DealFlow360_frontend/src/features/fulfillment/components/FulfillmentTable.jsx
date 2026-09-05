/**
 * Comprehensive Fulfillment Orders Data Table Component
 * Phase 13 — DealFlow360
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  Layers,
  PackageCheck,
  Truck,
  UserCheck,
  Clock,
  ChevronLeft,
  ChevronRight,
  Package,
} from 'lucide-react';
import { FulfillmentStatusBadge } from './FulfillmentStatusBadge';
import { FULFILLMENT_STATUS } from '../types/fulfillmentTypes';

export const FulfillmentTable = ({
  fulfillments = [],
  loading = false,
  onCreateShipmentClick,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(fulfillments.length / itemsPerPage) || 1;
  const paginatedData = fulfillments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center space-y-4 shadow-2xs">
        <div className="w-8 h-8 border-4 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading fulfillment pipeline...</p>
      </div>
    );
  }

  if (fulfillments.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center space-y-3">
        <div className="w-12 h-12 bg-[#F7F2F5] text-[#714B67] rounded-2xl flex items-center justify-center mx-auto border border-[#714B67]/20">
          <Package className="w-6 h-6 text-[#714B67]" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">No Fulfillment Orders Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
          There are currently no operational fulfillment records matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Fulfillment ID</th>
              <th className="py-3.5 px-4">Order Number</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Warehouse</th>
              <th className="py-3.5 px-4">Items / Qty</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Assigned User</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium">
            {paginatedData.map((item) => {
              const totalOrdered = item.items?.reduce((acc, i) => acc + i.orderedQuantity, 0) || 0;
              const totalPicked = item.items?.reduce((acc, i) => acc + i.pickedQuantity, 0) || 0;

              return (
                <tr key={item.fulfillmentId} className="hover:bg-slate-50/80 transition-colors">
                  {/* Fulfillment ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-[#714B67]">
                    <button
                      onClick={() => navigate(`/company/fulfillment/${item.fulfillmentId}`)}
                      className="hover:underline cursor-pointer"
                    >
                      {item.fulfillmentId}
                    </button>
                  </td>

                  {/* Order Number */}
                  <td className="py-3.5 px-4 font-mono text-slate-700 font-semibold">{item.orderId}</td>

                  {/* Customer */}
                  <td className="py-3.5 px-4 font-bold text-slate-900">{item.customerName}</td>

                  {/* Warehouse */}
                  <td className="py-3.5 px-4 text-slate-600 font-medium truncate max-w-[140px]">
                    {item.warehouseName || item.warehouseId}
                  </td>

                  {/* Items / Qty */}
                  <td className="py-3.5 px-4 text-slate-700">
                    <span className="font-bold text-slate-900">{item.items?.length || 0} Products</span>
                    <span className="text-[11px] text-slate-400 block font-normal">
                      Picked: {totalPicked} / {totalOrdered}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-extrabold rounded-md ${
                        item.priority === 'URGENT'
                          ? 'bg-rose-100 text-rose-800'
                          : item.priority === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <FulfillmentStatusBadge status={item.status} />
                  </td>

                  {/* Assigned User */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[120px]">{item.assignedTo || 'Unassigned'}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Workflow state dependent primary action */}
                      {item.status === FULFILLMENT_STATUS.READY && (
                        <button
                          type="button"
                          onClick={() => navigate(`/company/fulfillment/picking?id=${item.fulfillmentId}`)}
                          className="px-2.5 py-1.5 text-xs font-bold bg-[#714B67] hover:bg-[#56384E] text-white rounded-xl shadow-2xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Layers className="w-3.5 h-3.5" /> Start Picking
                        </button>
                      )}

                      {item.status === FULFILLMENT_STATUS.PICKING && (
                        <button
                          type="button"
                          onClick={() => navigate(`/company/fulfillment/picking?id=${item.fulfillmentId}`)}
                          className="px-2.5 py-1.5 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-2xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Layers className="w-3.5 h-3.5" /> Continue Picking
                        </button>
                      )}

                      {item.status === FULFILLMENT_STATUS.PICKED && (
                        <button
                          type="button"
                          onClick={() => navigate(`/company/fulfillment/packing?id=${item.fulfillmentId}`)}
                          className="px-2.5 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-2xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <PackageCheck className="w-3.5 h-3.5" /> Start Packing
                        </button>
                      )}

                      {item.status === FULFILLMENT_STATUS.PACKING && (
                        <button
                          type="button"
                          onClick={() => navigate(`/company/fulfillment/packing?id=${item.fulfillmentId}`)}
                          className="px-2.5 py-1.5 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-2xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <PackageCheck className="w-3.5 h-3.5" /> Continue Packing
                        </button>
                      )}

                      {item.status === FULFILLMENT_STATUS.PACKED && (
                        <button
                          type="button"
                          onClick={() => onCreateShipmentClick && onCreateShipmentClick(item)}
                          className="px-2.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-2xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" /> Create Shipment
                        </button>
                      )}

                      {/* View Details button */}
                      <button
                        type="button"
                        onClick={() => navigate(`/company/fulfillment/${item.fulfillmentId}`)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="View Full Detail & Timeline"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="font-bold text-slate-900">
            {Math.min(currentPage * itemsPerPage, fulfillments.length)}
          </span>{' '}
          of <span className="font-bold text-slate-900">{fulfillments.length}</span> orders
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="p-1.5 text-slate-600 disabled:text-slate-300 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="p-1.5 text-slate-600 disabled:text-slate-300 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
