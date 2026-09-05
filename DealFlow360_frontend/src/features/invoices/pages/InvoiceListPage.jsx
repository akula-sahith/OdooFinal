/**
 * Main Commercial Invoices Directory & Operations Page
 * Route: /company/invoices
 * Phase 14 — DealFlow360
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import {
  FileText,
  Plus,
  Send,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useInvoices } from '../hooks/useInvoices';
import { InvoiceFilters } from '../components/InvoiceFilters';
import { InvoiceTable } from '../components/InvoiceTable';
import { INVOICE_STATUS } from '../types/invoiceTypes';

export const InvoiceListPage = () => {
  const navigate = useNavigate();
  const { invoices, loading, params, updateFilters, refetch } = useInvoices();

  // Authoritative metric calculations
  const draftCount = invoices.filter((i) => i.status === INVOICE_STATUS.DRAFT).length;
  const issuedCount = invoices.filter((i) => i.status === INVOICE_STATUS.ISSUED).length;
  const overdueCount = invoices.filter((i) => i.status === INVOICE_STATUS.OVERDUE).length;
  const paidCount = invoices.filter((i) => i.status === INVOICE_STATUS.PAID).length;

  const totalBilledValue = invoices
    .filter((i) => i.status !== INVOICE_STATUS.VOID && i.status !== INVOICE_STATUS.CANCELLED)
    .reduce((acc, i) => acc + (i.grandTotal || 0), 0);

  const totalOutstandingDue = invoices
    .filter((i) => i.status === INVOICE_STATUS.ISSUED || i.status === INVOICE_STATUS.OVERDUE || i.status === INVOICE_STATUS.PARTIALLY_PAID)
    .reduce((acc, i) => acc + (i.amountDue || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <PageHeader
        title="Commercial Invoicing & Accounts Receivable"
        subtitle="Generate, issue, and track commercial invoices originating from confirmed sales orders."
        badgeText={`${invoices.length} Registered Invoices`}
        badgeVariant="plum"
      >
        <button
          type="button"
          onClick={() => navigate('/company/invoices/new')}
          className="px-4 py-2 bg-[#714B67] hover:bg-[#56384E] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" /> Create New Invoice
        </button>
      </PageHeader>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Total Invoiced
            </span>
            <DollarSign className="w-4 h-4 text-[#714B67]" />
          </div>
          <p className="text-xl font-black text-slate-900">
            ${totalBilledValue.toLocaleString(undefined, { minimumFractionDigits: 0 })}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Draft Invoices
            </span>
            <FileText className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-xl font-black text-slate-900">{draftCount}</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Issued Invoices
            </span>
            <Send className="w-4 h-4 text-[#714B67]" />
          </div>
          <p className="text-xl font-black text-slate-900">{issuedCount}</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Outstanding Due
            </span>
            <Clock className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl font-black text-rose-700">
            ${totalOutstandingDue.toLocaleString(undefined, { minimumFractionDigits: 0 })}
          </p>
        </div>

        {/* Metric 5 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Paid Invoices
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-slate-900">{paidCount}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <InvoiceFilters
        filters={params}
        onFilterChange={updateFilters}
        onReset={() => updateFilters({ status: '', search: '', currency: '' })}
      />

      {/* Main Table */}
      <InvoiceTable
        invoices={invoices}
        loading={loading}
        onIssueClick={async (inv) => {
          try {
            const { invoiceService } = await import('../services/invoiceService');
            await invoiceService.issueInvoice(inv.id, 'Finance Officer');
            refetch();
          } catch (e) {
            alert(e.message);
          }
        }}
      />
    </div>
  );
};
