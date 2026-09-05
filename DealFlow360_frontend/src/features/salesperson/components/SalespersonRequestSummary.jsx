import React from 'react';
import {
  Building2,
  User,
  Mail,
  Phone,
  Calendar,
  Package,
  Layers,
  Clock,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';
import { SALESPERSON_REQUEST_STATUS_LABELS } from '../types/salespersonTypes';

/**
 * SalespersonRequestSummary Component
 * Displays complete B2B customer requirement specifications and authorized contact info.
 */
export const SalespersonRequestSummary = ({ request }) => {
  if (!request) return null;

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'LOW':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-purple-50 text-[#714B67] border-purple-200';
    }
  };

  return (
    <Card variant="default" padding="lg" className="space-y-6 text-left">
      {/* Top Bar: ID, Status, Priority */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-extrabold text-[#714B67] bg-purple-50 px-3 py-1 rounded-lg border border-purple-200 shadow-2xs">
            {request.requestId || request.id}
          </span>
          <StatusBadge
            status={request.status || 'SUBMITTED'}
            customLabel={SALESPERSON_REQUEST_STATUS_LABELS[request.status]}
            size="md"
          />
          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getPriorityBadgeClass(request.priority)}`}>
            {request.priority || 'NORMAL'} PRIORITY
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            Submitted: {new Date(request.createdAt).toLocaleDateString()}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            Updated: {new Date(request.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Grid: Requirement Details & Customer Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Commercial Requirement Specs */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {request.title}
            </h3>
            <p className="text-sm text-slate-600 font-normal mt-2 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              {request.description || 'No additional specification details provided.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-purple-50/40 border border-purple-100">
              <Package className="w-5 h-5 text-[#714B67] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Product / Service Reference
                </span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {request.productName || 'Custom Commercial Requirement'}
                </span>
                {request.productId && (
                  <span className="text-[11px] font-mono text-slate-500">
                    ID: {request.productId}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-purple-50/40 border border-purple-100">
              <Layers className="w-5 h-5 text-[#714B67] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Requested Quantity
                </span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {request.quantity ? `${request.quantity.toLocaleString()} Units` : 'Flexible / TBD'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Lead Identity */}
        <div className="space-y-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Building2 className="w-4 h-4 text-[#714B67]" />
            <h4 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider">
              Customer Account Details
            </h4>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block">Company Name</span>
              <span className="text-slate-900 font-bold text-sm">
                {request.companyName || request.customerName || 'Acme Enterprises'}
              </span>
            </div>

            {request.customerName && (
              <div className="flex items-center gap-2 text-slate-700">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium">{request.customerName}</span>
              </div>
            )}

            {request.customerEmail && (
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium text-[#714B67]">{request.customerEmail}</span>
              </div>
            )}

            {request.customerPhone && (
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium">{request.customerPhone}</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#714B67]" />
              <span className="text-xs font-bold text-slate-800">Assigned Salesperson</span>
            </div>
            <p className="text-xs font-semibold text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
              {request.assignedSalespersonName || 'Unassigned (Claim Available)'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SalespersonRequestSummary;
