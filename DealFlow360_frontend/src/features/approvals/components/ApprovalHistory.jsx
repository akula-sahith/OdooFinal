import React from 'react';
import { Clock, UserCheck, CheckCircle2, XCircle, RotateCcw, FileText } from 'lucide-react';
import { Card } from '../../../components/ui/Card/Card';

/**
 * ApprovalHistory Component
 * Renders chronological append-only audit trail for quotation approvals.
 */
export const ApprovalHistory = ({ history = [] }) => {
  if (!history || history.length === 0) {
    return (
      <Card className="p-5 border border-slate-200 bg-white text-xs text-slate-500 text-left">
        No approval audit history recorded yet.
      </Card>
    );
  }

  const actionIcons = {
    SUBMIT: <FileText size={14} className="text-purple-600" />,
    APPROVE: <CheckCircle2 size={14} className="text-emerald-600" />,
    REJECT: <XCircle size={14} className="text-rose-600" />,
    REQUEST_REVISION: <RotateCcw size={14} className="text-amber-600" />,
  };

  const actionBadges = {
    SUBMIT: 'bg-purple-50 text-purple-700 border-purple-200',
    APPROVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    REJECT: 'bg-rose-50 text-rose-700 border-rose-200',
    REQUEST_REVISION: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <Card className="p-5 border border-slate-200 bg-white shadow-sm space-y-4 text-left">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
          <Clock size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Governance Audit Trail & Decision History</h3>
          <p className="text-xs text-slate-500">Immutable chronological authorization log</p>
        </div>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {history.map((entry, idx) => {
          const icon = actionIcons[entry.action] || <FileText size={14} />;
          const badgeStyle = actionBadges[entry.action] || 'bg-slate-100 text-slate-700';

          return (
            <div key={entry.id || idx} className="relative text-xs space-y-1">
              <div className="absolute -left-6 top-0.5 p-1 rounded-full bg-white border border-slate-300 shadow-2xs">
                {icon}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{entry.actorName || 'User'}</span>
                  <span className="text-[11px] text-slate-500 font-medium">({entry.actorRole || 'Staff'})</span>
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded border ${badgeStyle}`}>
                    {entry.action}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'Server timestamp'}
                </span>
              </div>

              {entry.comment && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed font-normal">
                  "{entry.comment}"
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
