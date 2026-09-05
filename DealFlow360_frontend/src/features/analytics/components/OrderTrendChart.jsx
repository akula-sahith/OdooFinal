/**
 * OrderTrendChart Component
 * Visualizes order volume and lifecycle stage distribution.
 */

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { formatCurrencyUSD } from '../types/analyticsTypes';

export function OrderTrendChart({ orderMetrics = {} }) {
  const stages = [
    { label: 'Created', count: orderMetrics.created || 0, color: 'bg-slate-500' },
    { label: 'Confirmed', count: orderMetrics.confirmed || 0, color: 'bg-blue-500' },
    { label: 'Processing', count: orderMetrics.processing || 0, color: 'bg-amber-500' },
    { label: 'Fulfilled', count: orderMetrics.fulfilled || 0, color: 'bg-teal-500' },
    { label: 'Completed', count: orderMetrics.completed || 0, color: 'bg-emerald-500' },
    { label: 'Cancelled', count: orderMetrics.cancelled || 0, color: 'bg-rose-500' },
  ];

  const total = orderMetrics.totalOrders || stages.reduce((s, x) => s + x.count, 0) || 1;

  return (
    <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-400" />
            Order Execution Pipeline
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Distribution of orders across active status stages</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Avg Order Value</span>
          <span className="block text-sm font-bold text-emerald-400">
            {formatCurrencyUSD(orderMetrics.avgOrderValueUSD || 0)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stages.map((stage, idx) => {
          const pct = Math.round((stage.count / total) * 100);
          return (
            <div key={idx} className="p-4 bg-slate-800/50 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                <span className="text-xs font-semibold text-slate-300">{stage.label}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold text-white">{stage.count}</span>
                <span className="text-xs font-medium text-slate-400">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderTrendChart;
