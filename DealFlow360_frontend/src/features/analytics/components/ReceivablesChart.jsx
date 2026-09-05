/**
 * ReceivablesChart Component
 * Visualizes Accounts Receivable aging distribution (Current, 1-30 days, 31-60 days, 61-90 days, 90+ days).
 */

import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { formatCurrencyUSD } from '../types/analyticsTypes';

export function ReceivablesChart({ agingData = {} }) {
  const brackets = [
    { label: 'Current', value: agingData.currentUSD || 0, color: 'bg-emerald-500', text: 'text-emerald-400' },
    { label: '1–30 Days', value: agingData.days1to30USD || 0, color: 'bg-amber-500', text: 'text-amber-400' },
    { label: '31–60 Days', value: agingData.days31to60USD || 0, color: 'bg-orange-500', text: 'text-orange-400' },
    { label: '61–90 Days', value: agingData.days61to90USD || 0, color: 'bg-rose-500', text: 'text-rose-400' },
    { label: '90+ Days', value: agingData.days90PlusUSD || 0, color: 'bg-red-700', text: 'text-red-400' },
  ];

  const totalOutstanding = brackets.reduce((sum, b) => sum + b.value, 0);
  const maxVal = Math.max(...brackets.map((b) => b.value), 1);

  return (
    <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            Accounts Receivable Aging
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Outstanding balance distribution by invoice age</p>
        </div>
        <div className="text-right">
          <span className="block text-[10px] text-slate-400 font-semibold uppercase">Total Outstanding</span>
          <span className="text-lg font-black text-amber-400">{formatCurrencyUSD(totalOutstanding)}</span>
        </div>
      </div>

      <div className="space-y-4">
        {brackets.map((bracket, idx) => {
          const widthPercent = Math.max(Math.round((bracket.value / maxVal) * 100), 2);
          const sharePercent = totalOutstanding > 0 ? Math.round((bracket.value / totalOutstanding) * 100) : 0;

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                <span className="font-semibold text-white">{bracket.label}</span>
                <div className="flex items-center gap-3">
                  <span className={`font-bold ${bracket.text}`}>{formatCurrencyUSD(bracket.value)}</span>
                  <span className="text-slate-500 text-[10px]">({sharePercent}%)</span>
                </div>
              </div>

              <div className="w-full bg-slate-800 rounded-lg h-3 overflow-hidden p-0.5 border border-slate-700/50">
                <div
                  style={{ width: `${widthPercent}%` }}
                  className={`h-full ${bracket.color} rounded transition-all duration-500`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ReceivablesChart;
