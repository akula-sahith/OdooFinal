/**
 * SalespersonPerformanceTable Component
 * Ranked leaderboard for sales representative activity and revenue contribution.
 */

import React from 'react';
import { UserCheck, Award } from 'lucide-react';
import { formatCurrencyUSD } from '../types/analyticsTypes';

export function SalespersonPerformanceTable({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl text-center text-slate-400 text-xs">
        No salesperson performance records found.
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            Salesperson Performance Leaderboard
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Team quotation conversion and revenue metrics</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-700">
            <tr>
              <th className="px-4 py-3">Rank & Salesperson</th>
              <th className="px-4 py-3 text-center">Quotations</th>
              <th className="px-4 py-3 text-center">Accepted</th>
              <th className="px-4 py-3 text-center">Orders</th>
              <th className="px-4 py-3 text-right">Revenue (USD)</th>
              <th className="px-4 py-3 text-center">Conversion %</th>
              <th className="px-4 py-3 text-center">Avg Discount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {data.map((row, idx) => (
              <tr key={row.salespersonId || idx} className="hover:bg-slate-800/40">
                <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                  {idx === 0 && <Award className="w-4 h-4 text-amber-400" />}
                  <span>{row.name}</span>
                </td>
                <td className="px-4 py-3 text-center text-slate-300">{row.quotes}</td>
                <td className="px-4 py-3 text-center text-slate-300">{row.accepted}</td>
                <td className="px-4 py-3 text-center text-slate-300">{row.orders}</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-400">
                  {formatCurrencyUSD(row.revenue || 0)}
                </td>
                <td className="px-4 py-3 text-center font-semibold text-blue-400">
                  {row.conversion}%
                </td>
                <td className="px-4 py-3 text-center text-slate-400">
                  {row.avgDiscount}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalespersonPerformanceTable;
