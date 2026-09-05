import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, UserCheck, Clock, FileCheck } from 'lucide-react';
import { Card } from '../../../components/ui/Card/Card';
import { formatCurrency } from '../../../constants/currency';
import { DiscountGovernanceBadge } from './DiscountGovernanceBadge';

/**
 * DiscountBreakdown Component
 * Displays complete pricing governance analysis panel: requested discount, authorized limits,
 * applicable discount tier, required approval level, risk classification, and audit info.
 */
export const DiscountBreakdown = ({
  governanceResult = null,
  currency = 'INR',
  subtotal = 0,
}) => {
  if (!governanceResult) return null;

  const {
    requestedDiscountPercentage = 0,
    maximumAuthorizedDiscount = 5,
    applicableTier,
    approvalLevel = 'NONE',
    governanceDecision = 'WITHIN_AUTHORITY',
    riskLevel = 'NORMAL',
    riskReason = '',
    discountAmount = 0,
    audit = {},
  } = governanceResult;

  const tierName = applicableTier?.name || 'Salesperson Standard Tier';
  const tierCode = applicableTier?.code || 'DT-SLS-01';

  const riskBadgeStyles = {
    NORMAL: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    MEDIUM: 'bg-amber-50 text-amber-800 border-amber-200',
    HIGH: 'bg-purple-50 text-[#714B67] border-purple-200',
    CRITICAL: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  return (
    <Card className="p-5 border border-slate-200 bg-white shadow-sm space-y-4 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#714B67]/10 text-[#714B67]">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Pricing Governance & Discount Audit</h3>
            <p className="text-xs text-slate-500">Automated authority verification and risk classification</p>
          </div>
        </div>

        <DiscountGovernanceBadge decision={governanceDecision} size="lg" />
      </div>

      {/* Risk Explanation Notice (Not color-only!) */}
      <div className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1 ${riskBadgeStyles[riskLevel] || riskBadgeStyles.NORMAL}`}>
        <div className="flex items-center justify-between font-bold">
          <span>Risk Level: {riskLevel}</span>
          <span>Required Sign-off: {approvalLevel === 'NONE' ? 'Self-Authorized' : approvalLevel}</span>
        </div>
        <p className="font-medium text-[11px] opacity-90">{riskReason}</p>
      </div>

      {/* Grid Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-slate-500 font-medium block">Requested Discount:</span>
          <span className="font-mono font-bold text-slate-900 text-sm">{requestedDiscountPercentage}%</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Amount: {formatCurrency(discountAmount, currency)}
          </span>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-slate-500 font-medium block">Salesperson Authority Limit:</span>
          <span className="font-mono font-bold text-slate-900 text-sm">{maximumAuthorizedDiscount}%</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Maximum self-approved</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-slate-500 font-medium block">Applicable Governance Tier:</span>
          <span className="font-bold text-slate-900 text-xs block truncate" title={tierName}>
            {tierName}
          </span>
          <span className="font-mono text-[10px] text-slate-500 block mt-0.5">{tierCode}</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-slate-500 font-medium block">Audit Trail:</span>
          <span className="font-medium text-slate-800 text-[11px] flex items-center gap-1 mt-0.5">
            <UserCheck size={12} className="text-slate-400" />
            {audit.requestedBy || 'SP-014'} ({audit.userRole || 'Salesperson'})
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5 flex items-center gap-1">
            <Clock size={10} />
            {audit.requestedAt ? new Date(audit.requestedAt).toLocaleTimeString() : 'Just now'}
          </span>
        </div>
      </div>
    </Card>
  );
};
