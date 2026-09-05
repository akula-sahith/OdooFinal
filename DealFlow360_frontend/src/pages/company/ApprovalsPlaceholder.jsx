import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { CheckCircle2, XCircle } from 'lucide-react';

export const ApprovalsPlaceholder = () => {
  const [approvals, setApprovals] = useState([]);

  const handleAction = (id, newStatus) => {
    setApprovals(approvals.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Manager Approvals Queue"
        subtitle="Review pending discount threshold overrides, credit limit extensions, and high-value orders."
        badgeText={`${approvals.filter((a) => a.status === 'Pending').length} Pending`}
        badgeVariant="plum"
      />

      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden p-6 space-y-4">
        {approvals.length > 0 ? (
          <div className="space-y-4">
            {approvals.map((item) => (
              <div key={item.id} className="border border-slate-200/80 rounded-xl p-5 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#714B67]">{item.id}</span>
                    <h3 className="text-sm font-extrabold text-slate-900">{item.type}</h3>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      item.status === 'Approved'
                        ? 'bg-[#F7F2F5] text-[#714B67] border border-[#714B67]/30'
                        : item.status === 'Rejected'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.details}</p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs pt-1">
                  <div className="text-slate-500 font-semibold space-x-3">
                    <span>Requestor: <strong className="text-slate-800">{item.requestor}</strong></span>
                    <span>Client: <strong className="text-slate-800">{item.client}</strong></span>
                  </div>

                  {item.status === 'Pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAction(item.id, 'Rejected')}
                        className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(item.id, 'Approved')}
                        className="px-3 py-1 bg-[#714B67] hover:bg-[#56384E] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Approve Request
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Clean Zero State Shell */
          <div className="py-16 text-center space-y-3 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <div className="w-12 h-12 bg-[#F7F2F5] text-[#714B67] rounded-2xl flex items-center justify-center mx-auto border border-[#714B67]/20">
              <CheckCircle2 className="w-6 h-6 text-[#714B67]" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-sm font-extrabold text-slate-900">No Pending Approvals</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Quotation discount requests and credit overrides will appear here for manager authorization.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
