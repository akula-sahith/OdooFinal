import React from 'react';
import { Lock, CheckCircle2, ShieldCheck, FileCheck } from 'lucide-react';

export const FinalizationStatusBanner = ({ quotation, snapshot }) => {
  if (!quotation) return null;

  const isClosed = quotation.status === 'COMMERCIALLY_CLOSED' || quotation.status === 'ACCEPTED';

  return (
    <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-bold text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isClosed ? 'Commercially Closed' : quotation.status}</span>
            </span>
            <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-lg text-slate-300">
              Version {quotation.version} (Accepted)
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Immutable Commercial Snapshot</span>
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Proposal {quotation.quotationNumber} — Commercial Agreement Finalized
          </h2>

          <p className="text-xs text-slate-300 max-w-2xl">
            This commercial agreement has been accepted by <strong className="text-white">{quotation.customerName}</strong> and locked into an immutable snapshot. This proposal is finalized and ready for Phase 11 Order processing.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-1.5 text-xs shrink-0">
          <span className="text-[10px] font-bold text-purple-200 uppercase tracking-wider block">
            Commercial Security Lock
          </span>
          <div className="flex items-center gap-2 text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">Authoritative Record</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Accepted: {new Date(quotation.acceptedAt || quotation.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};
