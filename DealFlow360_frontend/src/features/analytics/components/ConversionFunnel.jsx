/**
 * ConversionFunnel Component
 * Displays multi-stage conversion pipeline with count, value, and conversion drop-off percentages.
 */

import React from 'react';
import { ArrowDown, CheckCircle2 } from 'lucide-react';
import { formatCurrencyUSD } from '../types/analyticsTypes';

export function ConversionFunnel({ funnelData = [], title = 'Quotation Conversion Funnel' }) {
  if (!funnelData || funnelData.length === 0) {
    return (
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl text-center text-slate-400">
        No conversion funnel data available.
      </div>
    );
  }

  const firstCount = funnelData[0]?.count || 1;

  return (
    <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h4 className="text-base font-semibold text-white">{title}</h4>
          <p className="text-xs text-slate-400 mt-0.5">End-to-end conversion progression</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
          Overall Conversion:{' '}
          {Math.round(((funnelData[funnelData.length - 1]?.count || 0) / firstCount) * 100)}%
        </span>
      </div>

      <div className="space-y-3">
        {funnelData.map((stage, idx) => {
          const widthPercent = Math.max(Math.round((stage.count / firstCount) * 100), 12);
          const isFinal = idx === funnelData.length - 1;

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  {isFinal && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {stage.stage.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{stage.count} Records</span>
                  {stage.valueUSD !== undefined && (
                    <span className="font-semibold text-emerald-400">
                      {formatCurrencyUSD(stage.valueUSD)}
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-bold">
                    {stage.conversionPercent ?? Math.round((stage.count / firstCount) * 100)}%
                  </span>
                </div>
              </div>

              {/* Progress bar container */}
              <div className="w-full bg-slate-800/80 rounded-lg h-3 overflow-hidden p-0.5 border border-slate-700/40">
                <div
                  style={{ width: `${widthPercent}%` }}
                  className={`h-full rounded transition-all duration-500 ${
                    isFinal
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/30'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-500'
                  }`}
                />
              </div>

              {/* Dropdown Arrow between steps */}
              {!isFinal && (
                <div className="flex justify-center py-0.5 text-slate-600">
                  <ArrowDown className="w-3 h-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ConversionFunnel;
