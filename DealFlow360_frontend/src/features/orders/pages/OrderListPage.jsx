/**
 * OrderListPage Component
 * Production Sales Order Directory at /company/orders
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingBag, Search, Plus, CheckCircle2, Clock, Truck, FileText } from 'lucide-react';
import { formatCurrencyUSD } from '../../analytics/types/analyticsTypes';
import { apiClient } from '../../../services/api/apiClient';

export function OrderListPage() {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await apiClient.get('/orders');
        const list = Array.isArray(res) ? res : (res?.data || []);
        const mapped = list.map(o => ({
          id: o.orderNumber || `ORD-${o.id}`,
          rawId: o.id,
          sourceQuotationId: o.quotationId ? `QTN-${o.quotationId}` : 'DIRECT',
          customerName: o.customerName || `Customer #${o.customerId}`,
          customerId: o.customerId,
          totalAmountUSD: Number(o.totalAmount || 0),
          stage: o.status || 'CONFIRMED',
          createdDate: o.createdAt ? new Date(o.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          itemsCount: o.itemsCount || 1,
        }));
        setOrders(mapped);
        if (id) {
          const found = mapped.find((o) => String(o.id) === String(id) || String(o.rawId) === String(id));
          if (found) setSelectedOrder(found);
        }
      } catch (err) {
        console.error('Failed to fetch orders from backend:', err);
        setError(err.message || 'Failed to load sales orders.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [id]);

  const filteredOrders = orders.filter((o) => {
    const name = o.customerName || o.name || '';
    const orderIdStr = o.id || '';
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderIdStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'ALL' || o.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-blue-400" />
            Sales Orders Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Confirmed customer sales orders derived from accepted commercial proposals.
          </p>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Sales Orders</span>
          <div className="text-2xl font-black text-white mt-1">{orders.length} Orders</div>
        </div>
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-[11px] font-semibold text-amber-400 uppercase">In Processing</span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {orders.filter((o) => o.stage === 'PROCESSING' || o.stage === 'Confirmed' || o.stage === 'Processing').length} Active
          </div>
        </div>
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-[11px] font-semibold text-teal-400 uppercase">Fulfilled / Shipped</span>
          <div className="text-2xl font-black text-teal-400 mt-1">
            {orders.filter((o) => o.stage === 'FULFILLED' || o.stage === 'Fulfilled').length} Orders
          </div>
        </div>
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase">Order Revenue Total</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {formatCurrencyUSD(orders.reduce((s, o) => s + (o.totalAmountUSD || o.totalAmount || 0), 0))}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order number or customer name..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Execution Stage:</span>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-medium"
          >
            <option value="ALL">All Stages</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="FULFILLED">FULFILLED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 font-mono">Order Number</th>
                <th className="px-4 py-3">Customer Name</th>
                <th className="px-4 py-3 font-mono">Source Proposal</th>
                <th className="px-4 py-3 text-right">Total Amount (USD)</th>
                <th className="px-4 py-3 text-center">Execution Stage</th>
                <th className="px-4 py-3 text-right">Created Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-bold text-white font-mono">{order.id}</td>
                  <td className="px-4 py-3 font-semibold text-slate-200">{order.customerName || order.name}</td>
                  <td className="px-4 py-3 font-mono text-purple-400">{order.sourceQuotationId || 'QT-2026-0042'}</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-400">
                    {formatCurrencyUSD(order.totalAmountUSD || order.totalAmount || 0)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.stage === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : order.stage === 'FULFILLED'
                          ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {order.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-400">{order.createdDate}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 text-xs font-medium"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-lg w-full shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white font-mono">{selectedOrder.id}</h4>
                <span className="text-[10px] text-slate-400">Customer: {selectedOrder.customerName}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl">
                <span>Source Quotation</span>
                <span className="font-mono text-purple-400 font-bold">{selectedOrder.sourceQuotationId || 'QT-2026-0042'}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl">
                <span>Total Order Value</span>
                <span className="font-bold text-emerald-400">{formatCurrencyUSD(selectedOrder.totalAmountUSD || selectedOrder.totalAmount || 0)}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl">
                <span>Execution Status</span>
                <span className="font-bold text-amber-400">{selectedOrder.stage}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderListPage;
