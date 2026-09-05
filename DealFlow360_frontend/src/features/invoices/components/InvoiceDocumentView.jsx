/**
 * Formal Printable Commercial Invoice Document View Component
 * Phase 14 — DealFlow360
 */

import React from 'react';
import { Printer, Building, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';

export const InvoiceDocumentView = ({ invoice }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const currency = invoice.currency || 'USD';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl max-w-4xl mx-auto space-y-8 print:border-none print:shadow-none print:p-0">
      {/* Document Controls Top Bar (Hidden during Print) */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#714B67]" />
          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Official Commercial Invoice Document Preview
          </span>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="px-4 py-2 bg-[#714B67] hover:bg-[#56384E] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </button>
      </div>

      {/* Invoice Header Block */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#714B67] text-white font-black text-sm rounded-xl flex items-center justify-center">
              DF
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">DealFlow360 Enterprise</h2>
              <p className="text-[11px] text-slate-500 font-medium">B2B Commercial Execution Platform</p>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-600 space-y-0.5 font-medium">
            <p>100 Enterprise Way, Suite 500</p>
            <p>Chicago, IL 60601, USA</p>
            <p>Tax ID / EIN: US-360-991823-X</p>
            <p>billing@dealflow360.com</p>
          </div>
        </div>

        <div className="text-right space-y-2">
          <h1 className="text-2xl font-black text-[#714B67] tracking-tight font-mono">
            {invoice.invoiceNumber}
          </h1>
          <div className="inline-block">
            <InvoiceStatusBadge status={invoice.status} />
          </div>

          <div className="text-xs text-slate-600 space-y-1 font-semibold pt-2">
            <p>
              Issue Date: <span className="font-mono font-bold text-slate-900">{invoice.issueDate}</span>
            </p>
            <p>
              Payment Due Date: <span className="font-mono font-bold text-rose-700">{invoice.dueDate}</span>
            </p>
            <p>
              Order Reference: <span className="font-mono font-bold text-slate-900">{invoice.orderId}</span>
            </p>
            {invoice.quotationId && (
              <p>
                Quotation Ref: <span className="font-mono text-slate-700">{invoice.quotationId}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Client Address Snapshots Block */}
      <div className="grid grid-cols-2 gap-8 text-xs">
        {/* Billed To */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Billed To (Customer Snapshot)
          </span>
          <p className="font-extrabold text-slate-900 text-sm">{invoice.billingAddress?.recipientName || invoice.customerName}</p>
          {invoice.billingAddress?.companyName && (
            <p className="font-bold text-slate-700">{invoice.billingAddress.companyName}</p>
          )}
          <p className="text-slate-600">{invoice.billingAddress?.addressLine1}</p>
          {invoice.billingAddress?.addressLine2 && <p className="text-slate-600">{invoice.billingAddress.addressLine2}</p>}
          <p className="text-slate-600">
            {invoice.billingAddress?.city}, {invoice.billingAddress?.state} {invoice.billingAddress?.postalCode}
          </p>
          <p className="font-bold text-slate-800">{invoice.billingAddress?.country}</p>
        </div>

        {/* Shipped To */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Shipped Destination Snapshot
          </span>
          <p className="font-extrabold text-slate-900 text-sm">{invoice.shippingAddress?.recipientName || invoice.customerName}</p>
          {invoice.shippingAddress?.companyName && (
            <p className="font-bold text-slate-700">{invoice.shippingAddress.companyName}</p>
          )}
          <p className="text-slate-600">{invoice.shippingAddress?.addressLine1}</p>
          {invoice.shippingAddress?.addressLine2 && <p className="text-slate-600">{invoice.shippingAddress.addressLine2}</p>}
          <p className="text-slate-600">
            {invoice.shippingAddress?.city}, {invoice.shippingAddress?.state} {invoice.shippingAddress?.postalCode}
          </p>
          <p className="font-bold text-slate-800">{invoice.shippingAddress?.country}</p>
        </div>
      </div>

      {/* Invoice Items Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4 text-center">Qty</th>
              <th className="py-3 px-4 text-right">Unit Price</th>
              <th className="py-3 px-4 text-right">Discount</th>
              <th className="py-3 px-4 text-right">Tax (%)</th>
              <th className="py-3 px-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium">
            {invoice.items?.map((item, idx) => (
              <tr key={idx}>
                <td className="py-3.5 px-4">
                  <span className="font-bold text-slate-900 block">{item.productNameSnapshot}</span>
                  <span className="text-[11px] text-slate-400 font-mono">SKU: {item.skuSnapshot}</span>
                </td>
                <td className="py-3.5 px-4 text-center font-bold text-slate-800">{item.quantity}</td>
                <td className="py-3.5 px-4 text-right text-slate-700">
                  ${item.unitPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3.5 px-4 text-right text-slate-600">
                  ${(item.discount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3.5 px-4 text-right text-slate-600">{item.taxRate || 0}%</td>
                <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                  ${item.lineTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financial Totals Breakdown */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
        <div className="flex-1 space-y-2 text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider block">Payment Instructions & Terms</span>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-medium space-y-1">
            <p className="font-bold text-slate-800">{invoice.notes || 'Payment Terms: Net 30 days.'}</p>
            <p className="text-[11px] text-slate-500">Bank Transfer: JPMorgan Chase Bank, N.A.</p>
            <p className="text-[11px] text-slate-500">Routing (ABA): 021000021 | Account #: 9928-1092-88</p>
            <p className="text-[11px] text-slate-500">SWIFT / BIC: CHASUS33XXX</p>
          </div>
        </div>

        <div className="w-full sm:w-72 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs font-semibold">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-bold text-slate-900">${invoice.subtotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Discount:</span>
            <span className="font-bold text-emerald-700">-${invoice.discountTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Tax:</span>
            <span className="font-bold text-slate-900">+${invoice.taxTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="border-t border-slate-200 pt-2 flex justify-between text-sm">
            <span className="font-extrabold text-slate-900">Total:</span>
            <span className="font-black text-[#714B67] text-base">${invoice.grandTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-rose-800 pt-1 font-extrabold border-t border-slate-200/80">
            <span>Balance Due:</span>
            <span>${invoice.amountDue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-slate-100 text-center text-[11px] text-slate-400 space-y-1">
        <p className="font-bold text-slate-600">Thank you for your business with DealFlow360 Enterprise.</p>
        <p>This is an official commercial invoice document generated by DealFlow360 System.</p>
      </div>
    </div>
  );
};
