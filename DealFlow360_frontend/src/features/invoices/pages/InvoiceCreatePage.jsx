/**
 * Generate Commercial Invoice from Billable Sales Order Page
 * Route: /company/invoices/new
 * Phase 14 — DealFlow360
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import {
  ArrowLeft,
  FileText,
  ShieldAlert,
  Check,
  ShoppingCart,
  Send,
  Calendar,
} from 'lucide-react';
import { BillableOrderSelector } from '../components/BillableOrderSelector';
import { InvoiceItemTable } from '../components/InvoiceItemTable';
import { InvoiceSummary } from '../components/InvoiceSummary';
import { useInvoices } from '../hooks/useInvoices';
import { invoiceService, calculateInvoiceFinancials } from '../services/invoiceService';

export const InvoiceCreatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedOrderId = searchParams.get('orderId');

  const { createInvoiceFromOrder } = useInvoices();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentTermsDays, setPaymentTermsDays] = useState(30);
  const [taxRate, setTaxRate] = useState(8);
  const [notes, setNotes] = useState('Payment terms: Net 30. Please include invoice number on wire remittance.');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [duplicateConflict, setDuplicateConflict] = useState(null);

  // Auto-load preselected order if provided in query string
  useEffect(() => {
    if (preselectedOrderId) {
      const fetchPreselected = async () => {
        try {
          const list = await invoiceService.getBillableOrders();
          const match = list.find((o) => o.id === preselectedOrderId);
          if (match) setSelectedOrder(match);
        } catch (e) {
          console.error('Failed loading order', e);
        }
      };
      fetchPreselected();
    }
  }, [preselectedOrderId]);

  // Recalculate Due Date when Issue Date or Terms change
  useEffect(() => {
    if (issueDate) {
      const issue = new Date(issueDate);
      if (!isNaN(issue.getTime())) {
        issue.setDate(issue.getDate() + Number(paymentTermsDays));
        setDueDate(issue.toISOString().split('T')[0]);
      }
    }
  }, [issueDate, paymentTermsDays]);

  const handleCreateDraft = async (e) => {
    e.preventDefault();
    if (!selectedOrder) {
      setError('Please select an eligible Sales Order first.');
      return;
    }

    setProcessing(true);
    setError(null);
    setDuplicateConflict(null);

    try {
      const created = await createInvoiceFromOrder(selectedOrder, {
        taxRate,
        issueDate,
        dueDate,
        paymentTermsDays,
        notes,
      });
      navigate(`/company/invoices/${created.id}`);
    } catch (err) {
      if (err.status === 409) {
        setDuplicateConflict(err.existingInvoice || true);
      } else {
        setError(err.message);
      }
    } finally {
      setProcessing(false);
    }
  };

  const calculatedFinancials = selectedOrder
    ? calculateInvoiceFinancials(selectedOrder.items || [], taxRate)
    : null;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/company/invoices')}
          className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <PageHeader
          title="Create Commercial Invoice"
          subtitle="Convert a confirmed sales order into a historical commercial invoice snapshot."
          badgeText="DRAFT GENERATION"
          badgeVariant="plum"
        />
      </div>

      {/* Duplicate 409 Conflict Alert */}
      {duplicateConflict && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3 text-amber-900 text-xs font-semibold shadow-2xs">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <h4 className="font-bold text-sm">409 Conflict: Invoice Already Exists</h4>
            <p>
              An active commercial invoice has already been generated for Sales Order #{selectedOrder?.id}.
            </p>
            {duplicateConflict.id && (
              <button
                type="button"
                onClick={() => navigate(`/company/invoices/${duplicateConflict.id}`)}
                className="mt-2 px-3 py-1.5 bg-amber-800 text-white rounded-lg text-xs font-bold hover:bg-amber-900 cursor-pointer transition-all inline-block"
              >
                View Existing Invoice #{duplicateConflict.id}
              </button>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-semibold">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Order Selector Block */}
      {!selectedOrder ? (
        <BillableOrderSelector onSelectOrder={(order) => setSelectedOrder(order)} />
      ) : (
        <div className="space-y-6">
          {/* Selected Order Summary Banner */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Selected Originating Sales Order
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-mono font-extrabold text-[#714B67]">
                  {selectedOrder.id}
                </span>
                <span className="font-extrabold text-slate-900 text-sm">
                  — {selectedOrder.customerName}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedOrder(null);
                setDuplicateConflict(null);
              }}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Change Selected Order
            </button>
          </div>

          {/* Form Options */}
          <form onSubmit={handleCreateDraft} className="space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#714B67]" /> Invoicing Dates & Payment Terms
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Issue Date *</label>
                  <input
                    type="date"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full h-10 px-3 font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Terms</label>
                  <select
                    value={paymentTermsDays}
                    onChange={(e) => setPaymentTermsDays(Number(e.target.value))}
                    className="w-full h-10 px-3 font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none cursor-pointer"
                  >
                    <option value={15}>Net 15 Days</option>
                    <option value={30}>Net 30 Days</option>
                    <option value={60}>Net 60 Days</option>
                    <option value={90}>Net 90 Days</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Due Date *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full h-10 px-3 font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-32 h-10 px-3 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Notes & Bank Remittance Instructions</label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>
            </div>

            {/* Line Items Snapshot Preview */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
              <InvoiceItemTable
                items={calculatedFinancials?.items || []}
                currency={selectedOrder.currency || 'USD'}
                isEditable={false}
              />
            </div>

            {/* Financial Summary Preview */}
            <InvoiceSummary invoice={{ ...calculatedFinancials, currency: selectedOrder.currency || 'USD', amountPaid: 0, amountDue: calculatedFinancials?.grandTotal }} />

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/company/invoices')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className="px-5 py-2.5 bg-[#714B67] hover:bg-[#56384E] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" /> Save as Draft Invoice
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
