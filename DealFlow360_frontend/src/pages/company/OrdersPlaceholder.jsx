import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import {
  ShoppingCart,
  Search,
  Plus,
  X,
  Trash2,
  Package,
} from 'lucide-react';
import { OrderInventoryPanel } from '../../features/inventory/components/OrderInventoryPanel';

export const OrdersPlaceholder = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    orderTotal: '15000',
    fulfillmentStage: 'Processing',
  });
  const [selectedOrderForInventory, setSelectedOrderForInventory] = useState(null);

  // Load from Backend REST API
  useEffect(() => {
    async function fetchBackendOrders() {
      try {
        const { apiClient } = await import('../../services/api/apiClient');
        const res = await apiClient.get('/orders');
        const list = Array.isArray(res) ? res : (res?.data || []);
        const mapped = list.map(o => ({
          id: o.orderNumber || `ORD-${o.id}`,
          customerName: o.customerName || `Customer #${o.customerId}`,
          totalAmount: Number(o.totalAmount || 0),
          stage: o.status || 'Processing',
          createdDate: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        }));
        setOrders(mapped);
      } catch (e) {
        console.error('Failed fetching orders in OrdersPlaceholder:', e);
        setOrders([]);
      }
    }
    fetchBackendOrders();
  }, []);

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!formData.customerName) return;

    const newOrder = {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: formData.customerName,
      totalAmount: parseFloat(formData.orderTotal) || 15000,
      stage: formData.fulfillmentStage,
      createdDate: new Date().toLocaleDateString(),
    };

    saveOrders([newOrder, ...orders]);
    setIsModalOpen(false);
    setFormData({ customerName: '', orderTotal: '15000', fulfillmentStage: 'Processing' });
  };

  const handleDelete = (id) => {
    saveOrders(orders.filter((o) => o.id !== id));
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || o.stage === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Sales Orders & Fulfillment"
        subtitle="Manage confirmed client orders, delivery milestones, and invoice fulfillments."
        badgeText={`${orders.length} Active Orders`}
        badgeVariant="plum"
      />

      {/* Unified Enterprise Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden space-y-4 p-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by order #, client name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {['All', 'Processing', 'Fulfilling', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab ? 'bg-[#714B67] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="h-9 px-4 bg-[#714B67] hover:bg-[#56384E] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-white" /> Create Order
            </button>
          </div>
        </div>

        {/* Data Table or Zero State */}
        {filteredOrders.length > 0 ? (
          <div className="rounded-xl border border-slate-200/80 overflow-hidden pt-2">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Order Number</th>
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Grand Total</th>
                    <th className="py-3 px-4">Fulfillment Stage</th>
                    <th className="py-3 px-4">Order Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#714B67]">{o.id}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{o.customerName}</td>
                      <td className="py-3 px-4 font-extrabold text-slate-900">${o.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#F7F2F5] text-[#714B67] border border-[#714B67]/30">
                          {o.stage}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-medium">{o.createdDate}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOrderForInventory(o)}
                            className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Package className="w-3.5 h-3.5" /> Check Inventory
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const { fulfillmentService } = await import('../../features/fulfillment/services/fulfillmentService');
                                const res = await fulfillmentService.createFulfillment(o);
                                window.location.href = `/company/fulfillment/${res.fulfillmentId}`;
                              } catch (e) {
                                alert(e.message);
                              }
                            }}
                            className="px-2.5 py-1 text-xs font-semibold bg-[#714B67] hover:bg-[#56384E] text-white rounded-lg inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                          >
                            <Package className="w-3.5 h-3.5 text-white" /> Send to Fulfillment
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              window.location.href = `/company/invoices/new?orderId=${o.id}`;
                            }}
                            className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" /> Generate Invoice
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(o.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Clean Zero State Shell */
          <div className="py-16 text-center space-y-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <div className="w-12 h-12 bg-[#F7F2F5] text-[#714B67] rounded-2xl flex items-center justify-center mx-auto border border-[#714B67]/20">
              <ShoppingCart className="w-6 h-6 text-[#714B67]" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-sm font-extrabold text-slate-900">No Sales Orders Created</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Confirmed orders or quotes converted to order fulfillment will appear in this pipeline.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#714B67] hover:bg-[#56384E] text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" /> Create Sales Order
            </button>
          </div>
        )}

        {/* Embedded Order Inventory Reservation Panel */}
        {selectedOrderForInventory && (
          <div className="pt-4 border-t border-slate-200 relative">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setSelectedOrderForInventory(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 underline cursor-pointer"
              >
                Close Inventory Panel
              </button>
            </div>
            <OrderInventoryPanel order={selectedOrderForInventory} />
          </div>
        )}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#714B67]" /> Create Sales Order
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Account Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Global Industries"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full h-10 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Order Value ($USD)</label>
                <input
                  type="number"
                  placeholder="15000"
                  value={formData.orderTotal}
                  onChange={(e) => setFormData({ ...formData, orderTotal: e.target.value })}
                  className="w-full h-10 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#714B67] hover:bg-[#56384E] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
