import React from 'react';
import { CheckCircle2, Clock, XCircle, RotateCcw, AlertCircle } from 'lucide-react';

/**
 * ApprovalTimeline Component
 * Renders the lifecycle stage progress indicator for quotation governance.
 */
export const ApprovalTimeline = ({ status = 'DRAFT', riskLevel = 'NORMAL' }) => {
  const steps = [
    { key: 'CREATED', label: 'Quotation Created' },
    { key: 'SUBMITTED', label: 'Submitted for Approval' },
    { key: 'MANAGER', label: 'Manager Review' },
  ];

  if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL' || status === 'PENDING_FINANCE_APPROVAL') {
    steps.push({ key: 'FINANCE', label: 'Finance & Ops Review' });
  }

  steps.push({ key: 'FINAL', label: 'Final Decision' });

  const getStepStatus = (stepKey) => {
    if (status === 'DRAFT') {
      return stepKey === 'CREATED' ? 'completed' : 'pending';
    }

    if (status === 'PENDING_MANAGER_APPROVAL') {
      if (stepKey === 'CREATED' || stepKey === 'SUBMITTED') return 'completed';
      if (stepKey === 'MANAGER') return 'active';
      return 'pending';
    }

    if (status === 'PENDING_FINANCE_APPROVAL') {
      if (stepKey === 'CREATED' || stepKey === 'SUBMITTED' || stepKey === 'MANAGER') return 'completed';
      if (stepKey === 'FINANCE') return 'active';
      return 'pending';
    }

    if (status === 'REVISION_REQUESTED') {
      if (stepKey === 'CREATED' || stepKey === 'SUBMITTED') return 'completed';
      if (stepKey === 'MANAGER') return 'warning';
      return 'pending';
    }

    if (status === 'APPROVED') {
      return 'completed';
    }

    if (status === 'REJECTED') {
      if (stepKey === 'FINAL') return 'rejected';
      return 'completed';
    }

    return 'pending';
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-left">
      <div className="flex items-center justify-between gap-2 overflow-x-auto">
        {steps.map((step, idx) => {
          const state = getStepStatus(step.key);

          return (
            <React.Fragment key={step.key}>
              <div className="flex items-center gap-2 shrink-0">
                {state === 'completed' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    <CheckCircle2 size={14} />
                  </div>
                )}
                {state === 'active' && (
                  <div className="w-6 h-6 rounded-full bg-[#714B67] text-white flex items-center justify-center font-bold text-xs animate-pulse">
                    <Clock size={14} />
                  </div>
                )}
                {state === 'warning' && (
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                    <RotateCcw size={14} />
                  </div>
                )}
                {state === 'rejected' && (
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                    <XCircle size={14} />
                  </div>
                )}
                {state === 'pending' && (
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs border border-slate-200">
                    {idx + 1}
                  </div>
                )}

                <span
                  className={`text-xs font-semibold ${
                    state === 'active'
                      ? 'text-[#714B67] font-bold'
                      : state === 'completed'
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 min-w-[20px] flex-1 ${
                    state === 'completed' ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
