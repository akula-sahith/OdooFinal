/**
 * Customer Portal Invoice Detail & Printable View Page
 * Route: /customer/invoices/:invoiceId
 * Phase 14 — DealFlow360
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Printer } from 'lucide-react';
import { invoiceService } from '../../invoices/services/invoiceService';
import { InvoiceDocumentView } from '../../invoices/components/InvoiceDocumentView';

export const CustomerInvoiceDetailPage = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      try {
        const data = await invoiceService.getInvoiceById(invoiceId);
        setInvoice(data);
      } catch (e) {
        console.error('Error loading customer invoice detail:', e);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [invoiceId]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4 bg-white rounded-2xl border border-slate-200">
        <div className="w-10 h-10 border-4 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading invoice document...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-8">
        <FileText className="w-8 h-8 text-slate-300 mx-auto" />
        <h3 className="text-sm font-bold text-slate-900">Invoice Record Not Found</h3>
        <button
          onClick={() => navigate('/customer/invoices')}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          Return to Invoices List
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/customer/invoices')}
          className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900">Invoice Document #{invoice.invoiceNumber}</h1>
          <p className="text-xs text-slate-500 font-medium">Originating Order #{invoice.orderId}</p>
        </div>
      </div>

      {/* Official Invoice Document View */}
      <InvoiceDocumentView invoice={invoice} />
    </div>
  );
};
