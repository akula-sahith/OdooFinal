import React from 'react';
import { UserCheck, ArrowRight, ShieldCheck, AlertTriangle, ShieldAlert, CheckCircle2, ChevronDown } from 'lucide-react';

/**
 * ApprovalChainVisualization Component
 * Renders a clear, visual, interactive governance sequence diagram of discount escalation paths.
 */
export const ApprovalChainVisualization = ({ levels = [] }) => {
  const level0 = levels.find((l) => Number(l.level) === 0) || {
    role: 'Salesperson',
    thresholdPercent: 5.0,
  };
  const level1 = levels.find((l) => Number(l.level) === 1) || {
    role: 'Sales Manager',
    thresholdPercent: 12.0,
  };
  const level2 = levels.find((l) => Number(l.level) === 2) || {
    role: 'Finance / Operations',
    thresholdPercent: 25.0,
  };

  return (
    <div className="space-y-6 text-left">
      <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl text-white shadow-md relative overflow-hidden">
        {/* Subtle Background Graphic Overlay */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#714B67]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
            <div>
              <span className="text-xs font-bold text-purple-300 uppercase tracking-widest block mb-1">
                Governance Workflow Simulation
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Discount Escalation & Approval Architecture
              </h3>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Active Policy Engine
            </span>
          </div>

          {/* Visualization Tracks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Track A: Within Limit */}
            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-4 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-800/60">
                    PATH 1: STANDARD
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Discount ≤ {level0.thresholdPercent}%</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 p-2 bg-slate-900/60 rounded-lg text-slate-300">
                    <UserCheck className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Salesperson creates quotation</span>
                  </div>
                  <div className="flex justify-center text-slate-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-900/60 rounded-lg text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Discount Check: Within Allowed Limit</span>
                  </div>
                  <div className="flex justify-center text-slate-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-emerald-950/80 border border-emerald-700/60 rounded-lg text-emerald-200 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>NO APPROVAL REQUIRED</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 italic">Quotation issued directly to customer.</p>
            </div>

            {/* Track B: Manager Threshold Exceeded */}
            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-4 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-800/60">
                    PATH 2: MANAGER
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{level0.thresholdPercent}% &lt; Disc ≤ {level1.thresholdPercent}%</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 p-2 bg-slate-900/60 rounded-lg text-slate-300">
                    <UserCheck className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Salesperson requests discount</span>
                  </div>
                  <div className="flex justify-center text-slate-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-900/60 rounded-lg text-slate-300">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Manager Threshold Exceeded</span>
                  </div>
                  <div className="flex justify-center text-slate-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-amber-950/80 border border-amber-700/60 rounded-lg text-amber-200 font-bold">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>PENDING MANAGER APPROVAL</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 italic">Routed to {level1.role} queue.</p>
            </div>

            {/* Track C: High Risk Escalation */}
            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-4 flex flex-col justify-between hover:border-rose-500/40 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/60 px-2.5 py-0.5 rounded-md border border-rose-800/60">
                    PATH 3: HIGH RISK
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Discount &gt; {level1.thresholdPercent}%</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 p-2 bg-slate-900/60 rounded-lg text-slate-300">
                    <UserCheck className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Exceptional discount requested</span>
                  </div>
                  <div className="flex justify-center text-slate-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-900/60 rounded-lg text-slate-300">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>High-Risk Threshold Breached</span>
                  </div>
                  <div className="flex justify-center text-slate-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-rose-950/80 border border-rose-700/60 rounded-lg text-rose-200 font-bold">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>PENDING FINANCE APPROVAL</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 italic">Requires {level2.role} sign-off.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalChainVisualization;
