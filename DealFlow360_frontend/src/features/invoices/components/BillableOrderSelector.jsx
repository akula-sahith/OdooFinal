/**
 * Billable Sales Order Selector Component
 * Phase 14 — DealFlow360
 */

import React, { useState } from 'react';
import { ShoppingCart, Search, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { useBillableOrders } from '../hooks/useBillableOrders';

export const BillableOrderSelector = ({ onSelectOrder }) => {
  const [search, setSearch] = useState('');
  const { orders, loading } = useBillableOrders(search);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center space-y-2">
        <div className="w-6 h-6 border-3 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 font-medium">Scanning for eligible billable sales orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-[#714B67]" /> Select Originating Sales Order
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Only confirmed/fulfilled orders are eligible for official invoicing.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search order #, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#714B67]"
          />
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-80 overflow-y-auto">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className={`p-4 flex items-center justify-between transition-colors ${
                order.isInvoiced ? 'bg-slate-50/70' : 'hover:bg-slate-50'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#714B67]">{order.id}</span>
                  <span className="font-bold text-slate-900 text-xs">{order.customerName}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Date: {order.createdDate || 'Recent'} | Total:{' '}
                  <strong className="text-slate-800">${(order.totalAmount || 15000).toLocaleString()}</strong>
                </div>
              </div>

              <div>
                {order.isInvoiced ? (
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[11px] font-bold rounded-full border border-slate-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Invoice Created
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectOrder(order)}
                    className="px-3.5 py-1.5 bg-[#714B67] hover:bg-[#56384E] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    Select for Invoicing <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-400 space-y-1">
            <AlertCircle className="w-6 h-6 text-slate-300 mx-auto" />
            <p className="text-xs font-medium">No eligible billable orders found matching criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
