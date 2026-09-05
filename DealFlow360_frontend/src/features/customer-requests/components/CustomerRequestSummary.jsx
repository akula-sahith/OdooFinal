import React from 'react';
import { FileText, Package, Hash, Clock, Calendar, UserCheck, AlertOctagon } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';

/**
 * CustomerRequestSummary Component
 * Displays full requirement metadata and assignment state for customer detail view.
 */
export const CustomerRequestSummary = ({ request = {} }) => {
  const formatPriority = (p) => p || 'NORMAL';

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-[#714B67] bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              {request.requestId || request.id}
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Priority: {formatPriority(request.priority)}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{request.title}</h2>
        </div>

        <StatusBadge status={request.status || 'SUBMITTED'} />
      </div>

      {/* Description Block */}
      <div className="space-y-1.5">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#714B67]" />
          Requirement Specifications
        </h4>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
          {request.description}
        </div>
      </div>

      {/* Attributes Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70">
          <span className="text-slate-400 font-semibold block mb-1 flex items-center gap-1">
            <Package className="w-3.5 h-3.5" /> Product Reference
          </span>
          <span className="font-bold text-slate-800 line-clamp-1">{request.productName || 'Custom Specification'}</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70">
          <span className="text-slate-400 font-semibold block mb-1 flex items-center gap-1">
            <Hash className="w-3.5 h-3.5" /> Quantity / Units
          </span>
          <span className="font-bold text-slate-800 font-mono">{request.quantity ? `${request.quantity} Units` : 'Unspecified'}</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70">
          <span className="text-slate-400 font-semibold block mb-1 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" /> Assigned Engineer
          </span>
          <span className="font-bold text-slate-800">{request.assignedSalespersonName || 'Unassigned'}</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70">
          <span className="text-slate-400 font-semibold block mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Date Created
          </span>
          <span className="font-bold text-slate-800">
            {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomerRequestSummary;
