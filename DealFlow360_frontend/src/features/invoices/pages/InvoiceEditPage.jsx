/**
 * Edit Draft Invoice Page
 * Route: /company/invoices/:invoiceId/edit
 * Phase 14 — DealFlow360
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import { ArrowLeft, Edit3, Check, ShieldAlert } from 'lucide-react';
import { useInvoice } from '../hooks/useInvoice';
import { InvoiceItemTable } from '../components/InvoiceItemTable';
import { InvoiceSummary } from '../components/InvoiceSummary';
import { calculateInvoiceFinancials } from '../services/invoiceService';

export const InvoiceEditPage = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const { invoice, loading, error, updateDraft } = useInvoice(invoiceId);

  const [formData, setFormData] = useState({
    issueDate: '',
    dueDate: '',
    notes: '',
    items: [],
  });

  const [processing, setProcessing] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (invoice) {
      if (invoice.status !== 'DRAFT') {
        navigate(`/company/invoices/${invoiceId}`);
        return;
      }
      setFormData({
        issueDate: invoice.issueDate || '',
        dueDate: invoice.dueDate || '',
        notes: invoice.notes || '',
        items: invoice.items ? [...invoice.items] : [],
      });
    }
  }, [invoice, invoiceId, navigate]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading draft invoice #{invoiceId}...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <h3 className="text-base font-bold text-slate-900">{error || 'Invoice Record Not Found'}</h3>
        <button onClick={() => navigate('/company/invoices')} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer">
          Return to Directory
        </button>
      </div>
    );
  }

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, items: updated });
  };

  const handleRemoveItem = (index) => {
    const updated = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updated });
  };

  const handleAddItem = () => {
    const newItem = {
      id: `INVITEM-${Date.now()}`,
      productId: `PROD-NEW-${Date.now()}`,
      productNameSnapshot: 'Custom Billed Item / Service',
      skuSnapshot: 'SKU-CUSTOM',
      descriptionSnapshot: 'Additional commercial service charge',
      quantity: 1,
      unitPrice: 100,
      discount: 0,
      taxRate: 8,
    };
    setFormData({ ...formData, items: [...formData.items, newItem] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setLocalError(null);

    try {
      await updateDraft(formData, 'Finance Editor');
      navigate(`/company/invoices/${invoiceId}`);
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const calculatedFinancials = calculateInvoiceFinancials(formData.items);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(`/company/invoices/${invoiceId}`)}
          className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <PageHeader
          title={`Edit Draft Invoice ${invoice.invoiceNumber}`}
          subtitle={`Originating Order #${invoice.orderId} — ${invoice.customerName}`}
          badgeText="DRAFT EDIT MODE"
          badgeVariant="plum"
        />
      </div>

      {localError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-semibold">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <p>{localError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#714B67]" /> Modify Invoice Parameters
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Issue Date *</label>
              <input
                type="date"
                required
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="w-full h-10 px-3 font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Payment Due Date *</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full h-10 px-3 font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Payment Remittance Notes</label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>
        </div>

        {/* Item Table (Editable Mode) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
          <InvoiceItemTable
            items={formData.items}
            currency={invoice.currency || 'USD'}
            isEditable={true}
            onItemChange={handleItemChange}
            onRemoveItem={handleRemoveItem}
            onAddItem={handleAddItem}
          />
        </div>

        {/* Financial Summary */}
        <InvoiceSummary invoice={{ ...calculatedFinancials, currency: invoice.currency || 'USD', amountPaid: 0, amountDue: calculatedFinancials.grandTotal }} />

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/company/invoices/${invoiceId}`)}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={processing}
            className="px-5 py-2.5 bg-[#714B67] hover:bg-[#56384E] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
