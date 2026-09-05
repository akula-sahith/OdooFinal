import React from 'react';
import {
  Building2,
  Tag,
  Calendar,
  UserCheck,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  Percent,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';
import { formatCurrency } from '../../../constants/currency';
import { QUOTATION_STATUS_DEFINITIONS } from '../../../constants/quotationStatus';
import { DiscountGovernanceBadge } from './DiscountGovernanceBadge';

/**
 * QuotationSummary Component
 * Displays complete commercial proposal header, itemized breakdown, customer details,
 * discount totals, net subtotal, and pricing governance decision status.
 */
export const QuotationSummary = ({ quotation }) => {
  if (!quotation) return null;

  const statusDef = QUOTATION_STATUS_DEFINITIONS[quotation.status] || {};
  const activeCurrency = quotation.currency || 'INR';

  const subtotal = quotation.subtotal || 0;
  const discountTotal = quotation.discountTotal || 0;
  const discountPercentage = quotation.discountPercentage || 0;
  const netSubtotal = Math.max(0, subtotal - discountTotal);
  const taxTotal = quotation.taxTotal || 0;
  const grandTotal = quotation.grandTotal || netSubtotal + taxTotal;

  const governanceDecision = quotation.discountStatus || 'WITHIN_AUTHORITY';
  const approvalRequired = quotation.approvalRequired || false;
  const approvalLevel = quotation.approvalLevel || 'NONE';
  const riskLevel = quotation.riskLevel || 'NORMAL';

  return (
    <Card variant="default" padding="lg" className="space-y-6 text-left border border-slate-200 shadow-sm bg-white">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-extrabold text-[#714B67] bg-purple-50 px-3 py-1 rounded-lg border border-purple-200 shadow-2xs">
            {quotation.quotationNumber || quotation.quotationId}
          </span>
          <StatusBadge
            status={quotation.status || 'DRAFT'}
            customLabel={statusDef.label}
            size="md"
          />
          <DiscountGovernanceBadge decision={governanceDecision} size="md" />
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            Version {quotation.version || 1}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            Valid: {quotation.validFrom} to {quotation.validUntil}
          </span>
        </div>
      </div>

      {/* Title & Description */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          {quotation.title}
        </h3>
        {quotation.description && (
          <p className="text-sm text-slate-600 font-normal mt-2 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/70">
            {quotation.description}
          </p>
        )}
      </div>

      {/* Grid Details */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 text-xs">
        <div>
          <span className="text-slate-400 font-semibold block">Client Account</span>
          <span className="font-bold text-slate-900 text-sm">
            {quotation.companyName || quotation.customerName}
          </span>
          {quotation.customerEmail && (
            <span className="text-[11px] text-[#714B67] block font-medium mt-0.5">
              {quotation.customerEmail}
            </span>
          )}
        </div>

        <div>
          <span className="text-slate-400 font-semibold block">Source Request</span>
          <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mt-0.5 font-mono">
            <FileCheck className="w-3.5 h-3.5 text-[#714B67]" />
            {quotation.requestId}
          </span>
        </div>

        <div>
          <span className="text-slate-400 font-semibold block">Price List Catalog</span>
          <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mt-0.5">
            <Tag className="w-3.5 h-3.5 text-[#714B67]" />
            {quotation.priceListName || 'Standard Commercial Catalog'}
          </span>
        </div>

        <div>
          <span className="text-slate-400 font-semibold block">Assigned Sales Engineer</span>
          <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mt-0.5">
            <UserCheck className="w-3.5 h-3.5 text-[#714B67]" />
            {quotation.createdBy || quotation.salespersonName || 'Sarah Jenkins'}
          </span>
        </div>
      </div>

      {/* Governance & Risk Alert Banner (If approval required or risk > NORMAL) */}
      {approvalRequired && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Governance Approval Detected: {approvalLevel} Approval Required</span>
            <span className="ml-auto text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
              Risk: {riskLevel}
            </span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Requested discount ({discountPercentage}%) exceeds salesperson authority limit. Draft proposal requires formal {approvalLevel} sign-off before customer issuance.
          </p>
        </div>
      )}

      {/* Line Items Table */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider">
          Commercial Line Items ({quotation.items?.length || 0})
        </h4>

        <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Unit Base Price</th>
                <th className="py-3 px-4 text-right">Subtotal</th>
                <th className="py-3 px-4 text-center">Discount %</th>
                <th className="py-3 px-4 text-right">Net Line Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {(quotation.items || []).map((item, idx) => {
                const lineSubtotal = item.lineSubtotal || (item.quantity * item.unitBasePrice);
                const itemDiscPct = item.requestedDiscountPercentage || 0;
                const itemDiscAmt = item.discountAmount || 0;
                const netLine = item.netLineAmount || (lineSubtotal - itemDiscAmt);

                return (
                  <tr key={item.quotationItemId || idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {item.productNameSnapshot || item.productName}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {item.skuSnapshot || 'SKU-GEN'}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      {formatCurrency(item.unitBasePrice, activeCurrency)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      {formatCurrency(lineSubtotal, activeCurrency)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {itemDiscPct > 0 ? (
                        <span className="font-bold text-amber-700">{itemDiscPct}%</span>
                      ) : (
                        <span className="text-slate-400">0%</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-900">
                      {formatCurrency(netLine, activeCurrency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals Breakdown */}
      <div className="flex justify-end pt-4 border-t border-slate-200/80">
        <div className="w-80 space-y-2 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center text-slate-600 font-medium">
            <span>Base Subtotal:</span>
            <span className="font-mono font-bold text-slate-900">
              {formatCurrency(subtotal, activeCurrency)}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-600 font-medium">
            <span>Requested Discount ({discountPercentage}%):</span>
            <span className="font-mono font-bold text-amber-700">
              -{formatCurrency(discountTotal, activeCurrency)}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-700 font-bold pt-1 border-t border-slate-200">
            <span>Net Subtotal:</span>
            <span className="font-mono font-bold text-slate-900">
              {formatCurrency(netSubtotal, activeCurrency)}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-500 font-medium">
            <span>Applicable Tax:</span>
            <span className="font-mono font-medium text-slate-500">
              {formatCurrency(taxTotal, activeCurrency)}
            </span>
          </div>

          <div className="pt-2.5 border-t border-slate-300 flex justify-between items-center text-sm">
            <span className="font-extrabold text-slate-900">Grand Total:</span>
            <span className="font-mono font-extrabold text-lg text-[#714B67]">
              {formatCurrency(grandTotal, activeCurrency)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QuotationSummary;
