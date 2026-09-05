/**
 * TopProductsTable Component
 * Ranked product metrics by revenue, order quantity, and conversion.
 */

import React from 'react';
import { Package } from 'lucide-react';
import { formatCurrencyUSD } from '../types/analyticsTypes';

export function TopProductsTable({ data = [] }) {
  const products = data.length > 0 ? data : [
    { productId: 'PROD-001', name: 'Industrial Water Filtration System', category: 'Machinery', orderQty: 18, quoteQty: 25, revenueUSD: 145800, conversionPercent: 72 },
    { productId: 'PROD-002', name: 'Commercial Solar Generator 500kW', category: 'Energy', orderQty: 12, quoteQty: 20, revenueUSD: 98000, conversionPercent: 60 },
    { productId: 'PROD-003', name: 'Precision CNC Milling Station', category: 'Manufacturing', orderQty: 8, quoteQty: 15, revenueUSD: 82000, conversionPercent: 53 },
  ];

  return (
    <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-400" />
            Top Selling Products Analytics
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Product revenue contribution and quotation conversion rate</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-700">
            <tr>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-center">Quote Qty</th>
              <th className="px-4 py-3 text-center">Order Qty</th>
              <th className="px-4 py-3 text-right">Revenue (USD)</th>
              <th className="px-4 py-3 text-center">Conversion %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {products.map((item, idx) => (
              <tr key={item.productId || idx} className="hover:bg-slate-800/40">
                <td className="px-4 py-3 font-semibold text-white">{item.name}</td>
                <td className="px-4 py-3 text-slate-400">{item.category}</td>
                <td className="px-4 py-3 text-center text-slate-300">{item.quoteQty}</td>
                <td className="px-4 py-3 text-center text-slate-300">{item.orderQty}</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-400">
                  {formatCurrencyUSD(item.revenueUSD || 0)}
                </td>
                <td className="px-4 py-3 text-center font-semibold text-blue-400">
                  {item.conversionPercent}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopProductsTable;
