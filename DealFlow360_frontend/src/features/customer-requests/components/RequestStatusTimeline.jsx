import React from 'react';
import { CheckCircle2, Clock, AlertCircle, FileEdit, Send, Search, HelpCircle, Sparkles } from 'lucide-react';

/**
 * RequestStatusTimeline Component
 * Visual lifecycle progress indicator for B2B requirement requests.
 */
export const RequestStatusTimeline = ({ status = 'SUBMITTED' }) => {
  const steps = [
    { key: 'DRAFT', label: 'Draft Created', icon: FileEdit },
    { key: 'SUBMITTED', label: 'Submitted to Sales', icon: Send },
    { key: 'UNDER_REVIEW', label: 'Under Review', icon: Search },
    { key: 'REQUIREMENT_CLARIFICATION', label: 'Clarification', icon: HelpCircle },
    { key: 'REQUIREMENT_CONFIRMED', label: 'Confirmed', icon: Sparkles },
  ];

  if (status === 'CANCELLED') {
    return (
      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
        This requirement request has been cancelled and is no longer active in the sales workflow.
      </div>
    );
  }

  if (status === 'CLOSED') {
    return (
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 shrink-0 text-slate-500" />
        This requirement request has been closed.
      </div>
    );
  }

  const getStepIndex = (st) => {
    switch (st) {
      case 'DRAFT': return 0;
      case 'SUBMITTED': return 1;
      case 'UNDER_REVIEW': return 2;
      case 'REQUIREMENT_CLARIFICATION': return 3;
      case 'REQUIREMENT_CONFIRMED': return 4;
      default: return 1;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-3 text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Requirement Lifecycle Progress
        </h4>
        <span className="text-[11px] font-semibold text-[#714B67] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
          Step {currentIndex + 1} of {steps.length}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 pt-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center text-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold transition-all duration-200 mb-1.5 ${
                  isCurrent
                    ? 'bg-[#714B67] text-white ring-4 ring-purple-100 shadow-sm'
                    : isPassed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span
                className={`text-[10px] font-bold tracking-tight line-clamp-1 ${
                  isCurrent
                    ? 'text-[#714B67]'
                    : isPassed
                    ? 'text-slate-800'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RequestStatusTimeline;
