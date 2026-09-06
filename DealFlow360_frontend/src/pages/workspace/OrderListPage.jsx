import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import { Layout } from '../../components/common/Layout';
import {
  ShoppingBag,
  Search,
  RefreshCw,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  FileText,
  DollarSign,
  Layers
} from 'lucide-react';

export const OrderListPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await orderApi.getAllOrders();
      setOrders(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err.message || 'Failed to load sales orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const orderIdStr = String(o.id || '');
    const custStr = String(o.customerId || '');
    const qtnStr = String(o.quotationId || '');
    const matchesSearch =
      orderIdStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      custStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qtnStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'ALL' || o.status === stageFilter;
    return matchesSearch && matchesStage;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-sky-600 font-bold uppercase tracking-wider">SALES ORDERS DIRECTORY</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-sky-50 text-sky-700 border border-sky-200 font-semibold">
                Problem Statement Order Flow
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-sky-600" />
              Confirmed Customer Sales Orders ({orders.length})
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirmed commercial orders created upon quotation acceptance, tracked through fulfillment split, billing, and payment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadOrders}
              className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 transition-colors shadow-xs"
              title="Refresh Orders List"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Total Confirmed Orders</span>
            <div className="text-2xl font-bold text-slate-900">{orders.length} Orders</div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-1">
            <span className="text-[10px] font-mono uppercase text-sky-600 font-bold">Processing Stage</span>
            <div className="text-2xl font-bold text-sky-700">
              {orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'PROCESSING').length} Orders
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-1">
            <span className="text-[10px] font-mono uppercase text-emerald-600 font-bold">Fulfilled Orders</span>
            <div className="text-2xl font-bold text-emerald-700">
              {orders.filter((o) => o.status === 'FULFILLED' || o.status === 'COMPLETED').length} Orders
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Total Order Value</span>
            <div className="text-2xl font-extrabold text-sky-700">
              ${totalRevenue.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order ID, Customer ID, or Quotation Ref..."
              className="w-full bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400 uppercase text-[10px]">Filter Stage:</span>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Stages</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="FULFILLED">FULFILLED</option>
            </select>
          </div>
        </div>

        {/* Orders Table Display */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500 font-mono">Loading Sales Orders Directory...</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Sales Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Quotation Ref</th>
                    <th className="py-3 px-4">Total Amount ($)</th>
                    <th className="py-3 px-4">Order Stage</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400 italic">
                        No sales orders found. Confirm a quotation to automatically generate a sales order.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/60">
                        <td className="py-3.5 px-4 font-bold text-slate-900 font-mono flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-sky-600" />
                          Order #{o.id}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          Customer #{o.customerId}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-sky-700">
                          {o.quotationId ? `QTN-${o.quotationId}` : 'Direct Order'}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-sky-700">
                          ${Number(o.totalAmount || 0).toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              o.status === 'COMPLETED' || o.status === 'FULFILLED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-sky-50 text-sky-700 border-sky-200'
                            }`}
                          >
                            {o.status || 'CONFIRMED'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">
                          {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Today'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => navigate(`/orders/${o.id}`)}
                            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs inline-flex items-center gap-1 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Order Details &amp; Flow
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
