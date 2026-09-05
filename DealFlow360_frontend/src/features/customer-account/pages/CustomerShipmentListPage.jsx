import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Search, RefreshCw, Eye } from 'lucide-react';
import { useCustomerShipments } from '../hooks/useCustomerShipments';
import { ShipmentStatusBadge } from '../../fulfillment/components/FulfillmentStatusBadge';

export const CustomerShipmentListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const { shipments, loading, error, refetch, setFilters } = useCustomerShipments({
    search: searchTerm,
    status: selectedStatus,
  });

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    setFilters((prev) => ({ ...prev, search: val }));
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setFilters((prev) => ({ ...prev, status }));
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4 bg-white rounded-2xl border border-slate-200">
        <div className="w-10 h-10 border-4 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading customer shipment consignments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-rose-200 rounded-2xl p-12 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <Truck className="w-6 h-6" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900">Unable to Load Shipments</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">{error}</p>
        <button
          type="button"
          onClick={refetch}
          className="px-4 py-2 bg-[#714B67] text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry Request
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-slate-900">Shipment & Delivery Tracking</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Monitor dispatch waybills, carrier tracking codes, and live package milestones.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by shipment #, order #, or tracking code..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full h-10 pl-9 pr-4 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 overflow-x-auto">
            {['ALL', 'PROCESSING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => handleStatusChange(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-[#714B67] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {st === 'ALL' ? 'All Statuses' : st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shipment Directory Table */}
      {shipments.length > 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Shipment Number</th>
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Carrier</th>
                  <th className="py-3.5 px-4">Tracking Code</th>
                  <th className="py-3.5 px-4">Shipped Date</th>
                  <th className="py-3.5 px-4">Expected Delivery</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {shipments.map((shp) => (
                  <tr key={shp.shipmentId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#714B67]">
                      <button
                        onClick={() => navigate(`/customer/shipments/${shp.shipmentId}`)}
                        className="hover:underline cursor-pointer"
                      >
                        {shp.shipmentNumber || shp.shipmentId}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 font-semibold">{shp.orderId}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-bold">{shp.carrierName || 'Freight Partner'}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 font-semibold">
                      {shp.trackingNumber || 'Pending'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{shp.shippedDate || 'Processing'}</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-bold">
                      {shp.deliveredDate ? `Delivered ${shp.deliveredDate}` : shp.expectedDelivery || 'In Transit'}
                    </td>
                    <td className="py-3.5 px-4">
                      <ShipmentStatusBadge status={shp.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/customer/shipments/${shp.shipmentId}`)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="View Shipment Detail"
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
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
            There are currently no shipment waybills recorded for your account.
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerShipmentListPage;
