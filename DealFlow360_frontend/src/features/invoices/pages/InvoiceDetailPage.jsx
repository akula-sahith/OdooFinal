/**
 * Comprehensive Commercial Invoice Detail & Document Preview Page
 * Route: /company/invoices/:invoiceId
 * Phase 14 — DealFlow360
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import {
  ArrowLeft,
  FileText,
  Send,
  Printer,
  Edit3,
  Ban,
  ShieldCheck,
  MapPin,
  Clock,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';
import { useInvoice } from '../hooks/useInvoice';
import { InvoiceStatusBadge } from '../components/InvoiceStatusBadge';
import { InvoiceDocumentView } from '../components/InvoiceDocumentView';
import { InvoiceItemTable } from '../components/InvoiceItemTable';
import { InvoiceSummary } from '../components/InvoiceSummary';
import { VoidInvoiceModal } from '../components/VoidInvoiceModal';
import { INVOICE_STATUS } from '../types/invoiceTypes';

export const InvoiceDetailPage = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const { invoice, auditLogs, loading, error, refetch, issueInvoice, voidInvoice, cancelInvoice } = useInvoice(invoiceId);

  const [activeTab, setActiveTab] = useState('DOCUMENT'); // 'DOCUMENT', 'ITEMS', 'AUDIT'
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
  const [voidActionType, setVoidActionType] = useState('VOID'); // 'VOID' or 'CANCEL'
  const [processing, setProcessing] = useState(false);
  const [actionError, setActionError] = useState(null);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading invoice #{invoiceId}...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">{error || 'Invoice Record Not Found'}</h3>
        <button
          onClick={() => navigate('/company/invoices')}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          Return to Invoices List
        </button>
      </div>
    );
  }

  const handleIssueAction = async () => {
    setProcessing(true);
    setActionError(null);
    try {
      await issueInvoice('Finance Officer');
      refetch();
    } catch (e) {
      setActionError(e.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleVoidModalConfirm = async (reason) => {
    setProcessing(true);
    setActionError(null);
    try {
      if (voidActionType === 'VOID') {
        await voidInvoice(reason, 'Finance Manager');
      } else {
        await cancelInvoice(reason, 'Finance Admin');
      }
      setIsVoidModalOpen(false);
      refetch();
    } catch (e) {
      setActionError(e.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/company/invoices')}
          className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <PageHeader
          title={`Invoice ${invoice.invoiceNumber}`}
          subtitle={`Customer: ${invoice.customerName} — Originating Order #${invoice.orderId}`}
          badgeText={invoice.currency || 'USD'}
          badgeVariant="plum"
        />
      </div>

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-xs font-semibold">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <p>{actionError}</p>
        </div>
      )}

      {/* Overview & Quick Action Control Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Commercial Status
            </span>
            <div className="mt-1">
              <InvoiceStatusBadge status={invoice.status} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {invoice.status === INVOICE_STATUS.DRAFT && (
              <>
                <button
                  type="button"
                  onClick={() => navigate(`/company/invoices/${invoice.id}/edit`)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4 text-slate-600" /> Edit Draft
                </button>
                <button
                  type="button"
                  disabled={processing}
                  onClick={handleIssueAction}
                  className="px-4 py-2 bg-[#714B67] hover:bg-[#56384E] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-white" /> Issue Invoice Officially
                </button>
              </>
            )}

            {invoice.status === INVOICE_STATUS.ISSUED && (
              <button
                type="button"
                onClick={() => {
                  setVoidActionType('VOID');
                  setIsVoidModalOpen(true);
                }}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Ban className="w-4 h-4 text-rose-600" /> Void Invoice
              </button>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-700" /> Print Document
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-700">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Issue Date</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{invoice.issueDate}</span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Due Date</span>
            <span className="font-bold text-rose-700 mt-0.5 block">{invoice.dueDate}</span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Grand Total</span>
            <span className="font-extrabold text-slate-900 mt-0.5 block">
              {invoice.currency} ${invoice.grandTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Balance Due</span>
            <span className="font-extrabold text-rose-800 mt-0.5 block">
              {invoice.currency} ${invoice.amountDue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        {[
          { id: 'DOCUMENT', label: 'Printable Document View', icon: Printer },
          { id: 'ITEMS', label: 'Commercial Line Items', icon: FileText },
          { id: 'AUDIT', label: 'Financial Audit Log', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#714B67] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: DOCUMENT */}
      {activeTab === 'DOCUMENT' && <InvoiceDocumentView invoice={invoice} />}

      {/* Tab 2: ITEMS */}
      {activeTab === 'ITEMS' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-6">
            <InvoiceItemTable items={invoice.items || []} currency={invoice.currency || 'USD'} isEditable={false} />
          </div>
          <InvoiceSummary invoice={invoice} />
        </div>
      )}

      {/* Tab 3: AUDIT */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Invoice Audit Trail & Financial Logs
          </h3>

          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.auditId} className="p-4 flex items-start justify-between text-xs bg-white">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md font-mono font-bold text-[10px] bg-slate-100 text-slate-800">
                      {log.action}
                    </span>
                    <span className="font-bold text-slate-900">{log.actor}</span>
                  </div>
                  {log.reason && <p className="text-slate-600 font-medium">"{log.reason}"</p>}
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Void Modal */}
      <VoidInvoiceModal
        isOpen={isVoidModalOpen}
        onClose={() => setIsVoidModalOpen(false)}
        actionType={voidActionType}
        onConfirmAction={handleVoidModalConfirm}
      />
    </div>
  );
};
