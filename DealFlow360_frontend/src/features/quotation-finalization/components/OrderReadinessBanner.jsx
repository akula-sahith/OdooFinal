import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Code, CheckCircle2 } from 'lucide-react';
import { ORDER_READINESS_STATUS, ORDER_READINESS_LABELS } from '../types/quotationFinalizationTypes';

export const OrderReadinessBanner = ({ orderReadiness }) => {
  const [showPayload, setShowPayload] = useState(false);

  if (!orderReadiness) return null;

  const isReady = orderReadiness.status === ORDER_READINESS_STATUS.READY_FOR_ORDER || orderReadiness.isReady;

  return (
    <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-5 shadow-xs mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shrink-0 mt-0.5">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-200">
                {ORDER_READINESS_LABELS[orderReadiness.status] || 'Ready for Order Handoff'}
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-600 text-white rounded-full uppercase">
                Phase 11 Gateway
              </span>
            </div>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
              This commercially closed proposal contains a verified line-item snapshot ready to be consumed by the future Order Management module.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPayload(!showPayload)}
            className="px-3.5 py-2 bg-emerald-100 dark:bg-emerald-900/60 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showPayload ? 'Hide Handoff Schema' : 'Inspect Order Handoff Contract'}</span>
          </button>

          <span className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>READY_FOR_ORDER</span>
          </span>
        </div>
      </div>

      {/* Expandable Order Handoff JSON Schema Inspection */}
      {showPayload && orderReadiness.handoffPayload && (
        <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800 animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
              Immutable Order Creation Payload Contract (Phase 11 Input)
            </span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
              orderReadinessStatus: READY_FOR_ORDER
            </span>
          </div>
          <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto max-h-60 border border-slate-800">
            {JSON.stringify(orderReadiness.handoffPayload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
