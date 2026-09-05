/**
 * StatusDistributionChart Component
 * Visual breakdown of statuses across Quotations, Orders, or Fulfillment queues.
 */

import React from 'react';

export function StatusDistributionChart({
  statusBreakdown = {},
  title = 'Status Distribution',
  totalCount = null,
}) {
  const entries = Object.entries(statusBreakdown);
  const total =
    totalCount || entries.reduce((sum, [, val]) => sum + Number(val || 0), 0) || 1;

  const colorMap = {
    DRAFT: 'bg-slate-500',
    PENDING_APPROVAL: 'bg-amber-500',
    APPROVED: 'bg-blue-500',
    SENT: 'bg-indigo-500',
    NEGOTIATION: 'bg-purple-500',
    ACCEPTED: 'bg-emerald-500',
    REJECTED: 'bg-rose-500',
    EXPIRED: 'bg-slate-600',
    CREATED: 'bg-slate-500',
    CONFIRMED: 'bg-blue-500',
    PROCESSING: 'bg-amber-500',
    FULFILLED: 'bg-teal-500',
    COMPLETED: 'bg-emerald-500',
    CANCELLED: 'bg-rose-600',
  };

  return (
    <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h4 className="text-base font-semibold text-white">{title}</h4>
        <span className="text-xs text-slate-400 font-medium">{total} Total Items</span>
      </div>

      {/* Multi-segment status bar */}
      <div className="w-full h-4 bg-slate-800 rounded-full flex overflow-hidden p-0.5 border border-slate-700/50 mb-6">
        {entries.map(([status, count]) => {
          const width = Math.max(Math.round((count / total) * 100), 0);
          if (width === 0) return null;
          return (
            <div
              key={status}
              style={{ width: `${width}%` }}
              className={`h-full ${colorMap[status] || 'bg-slate-500'} transition-all first:rounded-l-full last:rounded-r-full`}
              title={`${status}: ${count} (${width}%)`}
            />
          );
        })}
      </div>

      {/* Legend list */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        {entries.map(([status, count]) => {
          const pct = Math.round((count / total) * 100);
          return (
            <div
              key={status}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-800"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${colorMap[status] || 'bg-slate-500'}`} />
                <span className="font-medium text-slate-300">{status.replace(/_/g, ' ')}</span>
              </div>
              <span className="font-bold text-white">
                {count} <span className="text-[10px] text-slate-400">({pct}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StatusDistributionChart;
