/**
 * RevenueChart Component
 * SVG/CSS Bar & Line Visualizer for monthly revenue trends with accessible data table toggle.
 */

import React, { useState } from 'react';
import { BarChart2, Table as TableIcon } from 'lucide-react';
import { formatCurrencyUSD } from '../types/analyticsTypes';

export function RevenueChart({ data = [], title = 'Revenue Trend', subtitle = 'Monthly revenue breakdown (USD)' }) {
  const [viewType, setViewType] = useState('chart'); // 'chart' | 'table'

  if (!data || data.length === 0) {
    return (
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl text-center text-slate-400">
        No revenue trend data available for the selected range.
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.revenue || d.value || 0), 1);

  return (
    <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h4 className="text-base font-semibold text-white">{title}</h4>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700/50">
          <button
            onClick={() => setViewType('chart')}
            className={`p-1.5 rounded text-xs font-medium transition ${
              viewType === 'chart'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Chart View"
          >
            <BarChart2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewType('table')}
            className={`p-1.5 rounded text-xs font-medium transition ${
              viewType === 'table'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Table View (Accessible)"
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {viewType === 'chart' ? (
        <div className="space-y-4">
          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-800">
            {data.map((item, idx) => {
              const val = item.revenue || item.value || 0;
              const heightPercent = Math.max(Math.round((val / maxValue) * 100), 4);
              const label = item.month || item.label || `P${idx + 1}`;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-all absolute -top-10 bg-slate-950 border border-slate-700 text-white text-xs py-1 px-2.5 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-20">
                    <span className="font-bold">{formatCurrencyUSD(val)}</span>
                    {item.orders !== undefined && (
                      <span className="block text-[10px] text-slate-400">{item.orders} Orders</span>
                    )}
                  </div>

                  {/* Bar */}
                  <div className="w-full bg-slate-800/80 rounded-t-lg overflow-hidden flex items-end h-full">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:from-emerald-500 group-hover:to-emerald-300 transition-all duration-300 rounded-t-md"
                    />
                  </div>

                  {/* Label */}
                  <span className="text-[11px] font-medium text-slate-400 group-hover:text-white transition">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <span>Base Currency: USD</span>
            <span>Peak Month: {formatCurrencyUSD(maxValue)}</span>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-700">
              <tr>
                <th className="px-4 py-2.5">Period</th>
                <th className="px-4 py-2.5 text-right">Revenue (USD)</th>
                <th className="px-4 py-2.5 text-right">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="px-4 py-2.5 font-medium text-white">
                    {item.month || item.label}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-emerald-400">
                    {formatCurrencyUSD(item.revenue || item.value || 0)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-300">
                    {item.orders ?? '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RevenueChart;
