import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Printer,
  Download,
  CreditCard,
  ShoppingCart,
  Tag,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useCustomerInvoice } from '../hooks/useCustomerInvoice';
import { customerPortalService } from '../services/customerPortalService';
import { CustomerInvoiceSummary } from '../components/CustomerInvoiceSummary';
import { InvoiceStatusBadge } from '../../invoices/components/InvoiceStatusBadge';

export const CustomerInvoiceDetailPage = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const { invoice, loading, error } = useCustomerInvoice(invoiceId);
  const [downloading, setDownloading] = useState(false);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4 bg-white rounded-2xl border border-slate-200">
        <div className="w-10 h-10 border-4 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading commercial invoice document...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="bg-white border border-rose-200 rounded-2xl p-12 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-extrabold text-slate-900">Invoice Not Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">{error || 'You are not authorized to view this invoice.'}</p>
        <button
          type="button"
          onClick={() => navigate('/customer/invoices')}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          Back to Invoices
        </button>
      </div>
    );
  }

  const {
    invoiceNumber = invoiceId,
    orderId,
    quotationId,
    customerName,
    status = 'ISSUED',
    issueDate,
    dueDate,
    currency = 'USD',
    billingAddress,
    shippingAddress,
    items = [],
    subtotal = 0,
    discountTotal = 0,
    taxTotal = 0,
    grandTotal = 0,
    amountPaid = 0,
    amountDue = grandTotal,
    payments = [],
  } = invoice;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await customerPortalService.getInvoiceDocument(invoiceId);
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${invoiceNumber}.pdf`;
        a.click();
      } else {
        // Print preview fallback
        window.print();
      }
    } catch (e) {
      console.error('Error downloading document:', e);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 text-left">
      {/* Print-specific media styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-invoice, #printable-invoice * { visibility: visible; }
          #printable-invoice { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/customer/invoices')}
            className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer shadow-2xs print:hidden"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 font-mono">{invoiceNumber}</h1>
              <InvoiceStatusBadge status={status} />
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Issued: {issueDate} • Payment Due: {dueDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" /> Print Statement
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="px-3.5 py-2 text-xs font-bold bg-[#714B67] hover:bg-[#56384E] text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {downloading ? 'Generating PDF...' : 'Download Document'}
          </button>
        </div>
      </div>

      {/* Main Printable Commercial Document Shell */}
      <div id="printable-invoice" className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        {/* Header Document Branding */}
        <div className="flex flex-col sm:flex-row justify-between border-b border-slate-200 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-base font-black text-slate-900 mb-1">
              <div className="w-7 h-7 rounded-lg bg-[#714B67] text-white flex items-center justify-center text-xs font-black">
                D360
              </div>
              DealFlow360 Commercial Billing
            </div>
            <p className="text-xs text-slate-500">Authoritative Financial Tax Statement & Invoice</p>
          </div>

          <div className="sm:text-right text-xs font-medium text-slate-600 space-y-1">
            <p className="font-extrabold text-slate-900 text-sm">STATEMENT NO: {invoiceNumber}</p>
            <p>Order Reference: <span className="font-mono font-bold text-[#714B67]">{orderId || 'N/A'}</span></p>
            <p>Issue Date: {issueDate}</p>
            <p className="font-bold text-rose-700">Due Date: {dueDate}</p>
          </div>
        </div>

        {/* Addresses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Billed Customer Account
            </span>
            <p className="font-black text-slate-900 text-sm">{customerName}</p>
            {billingAddress ? (
              <div className="text-slate-600 mt-1 space-y-0.5 leading-relaxed font-medium">
                <p>{billingAddress.recipientName}</p>
                <p>{billingAddress.addressLine1}</p>
                {billingAddress.addressLine2 && <p>{billingAddress.addressLine2}</p>}
                <p>{billingAddress.city}, {billingAddress.state} {billingAddress.postalCode}, {billingAddress.country}</p>
              </div>
            ) : (
              <p className="text-slate-500 mt-1 italic">Billing address on client profile file.</p>
            )}
          </div>

          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Consignment Shipping Address
            </span>
            {shippingAddress ? (
              <div className="text-slate-600 mt-1 space-y-0.5 leading-relaxed font-medium">
                <p className="font-bold text-slate-900">{shippingAddress.recipientName || shippingAddress.companyName}</p>
                <p>{shippingAddress.addressLine1}</p>
                {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}, {shippingAddress.country}</p>
              </div>
            ) : (
              <p className="text-slate-500 mt-1 italic font-medium">Destination Dock 12, Chicago IL</p>
            )}
          </div>
        </div>

        {/* Itemized Commercial Lines Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Itemized Commercial Breakdown</h3>
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Line Item / Description</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-right">Discount</th>
                    <th className="py-3 px-4 text-right">Tax</th>
                    <th className="py-3 px-4 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{item.productNameSnapshot || item.productName}</span>
                        {item.descriptionSnapshot && (
                          <span className="text-[11px] text-slate-500 block mt-0.5">{item.descriptionSnapshot}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">{item.skuSnapshot || item.sku}</td>
                      <td className="py-3 px-4 text-center font-bold">{item.quantity}</td>
                      <td className="py-3 px-4 text-right">${item.unitPrice?.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-emerald-700 font-semibold">
                        {item.discount ? `-$${item.discount.toLocaleString()}` : '$0.00'}
                      </td>
                      <td className="py-3 px-4 text-right">${item.taxAmount?.toLocaleString() || item.tax?.toLocaleString() || '$0.00'}</td>
                      <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                        ${item.lineTotal?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Invoice Summary Box */}
        <div className="flex justify-end">
          <div className="w-full sm:w-80">
            <CustomerInvoiceSummary
              subtotal={subtotal}
              discountTotal={discountTotal}
              taxTotal={taxTotal}
              grandTotal={grandTotal}
              amountPaid={amountPaid}
              amountDue={amountDue}
              currency={currency}
            />
          </div>
        </div>

        {/* Read-Only Notice Footnote */}
        <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200/60 text-xs text-slate-600 flex items-center justify-between">
          <span className="flex items-center gap-2 font-semibold text-[#714B67]">
            <ShieldCheck className="w-4 h-4" />
            Issued Commercial Invoice Record is Read-Only. Remittances are logged automatically.
          </span>
        </div>
      </div>

      {/* Cross-Module Related Records */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4 print:hidden">
        <h3 className="text-sm font-extrabold text-slate-900">Related Commercial Records</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => orderId && navigate(`/customer/orders/${orderId}`)}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#714B67] hover:shadow-xs transition-all cursor-pointer flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#714B67] flex items-center justify-center font-bold">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Sales Order</span>
              <span className="text-xs font-mono font-bold text-[#714B67]">{orderId || 'ORD-2026-8912'}</span>
            </div>
          </div>

          <div
            onClick={() => quotationId && navigate(`/customer/quotations/${quotationId}`)}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#714B67] hover:shadow-xs transition-all cursor-pointer flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Quotation Reference</span>
              <span className="text-xs font-mono font-bold text-indigo-700">{quotationId || 'QT-2026-1004'}</span>
            </div>
          </div>

          <div
            onClick={() => navigate('/customer/payments')}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#714B67] hover:shadow-xs transition-all cursor-pointer flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Remittance Transactions</span>
              <span className="text-xs font-mono font-bold text-emerald-700">
                {payments.length > 0 ? payments.join(', ') : 'PAY-2026-000001'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInvoiceDetailPage;
