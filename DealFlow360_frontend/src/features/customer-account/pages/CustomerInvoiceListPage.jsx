/**
 * Customer Portal Commercial Invoices List Page
 * Route: /customer/invoices
 * Phase 14 — DealFlow360
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Eye, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { invoiceService } from '../../invoices/services/invoiceService';
import { InvoiceStatusBadge } from '../../invoices/components/InvoiceStatusBadge';

export const CustomerInvoiceListPage = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomerInvoices = async () => {
      setLoading(true);
      try {
        // Fetch all invoices for demo customer or org
        const list = await invoiceService.getInvoices();
        setInvoices(list);
      } catch (e) {
        console.error('Failed loading customer invoices', e);
      } finally {
        setLoading(false);
      }
    };
    loadCustomerInvoices();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4 bg-white rounded-2xl border border-slate-200">
        <div className="w-10 h-10 border-4 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading your commercial invoices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-slate-900">Commercial Invoices & Accounts Statement</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          View issued billing statements, payment terms, and outstanding balances.
        </p>
      </div>

      {/* Invoices List Table */}
      {invoices.length > 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Invoice Number</th>
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4 text-right">Grand Total</th>
                  <th className="py-3.5 px-4 text-right">Balance Due</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Invoice Number */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#714B67]">
                      <button
                        onClick={() => navigate(`/customer/invoices/${inv.id}`)}
                        className="hover:underline cursor-pointer"
                      >
                        {inv.invoiceNumber}
                      </button>
                    </td>

                    {/* Order */}
                    <td className="py-3.5 px-4 font-mono text-slate-700">{inv.orderId}</td>

                    {/* Dates */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{inv.issueDate}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{inv.dueDate}</td>

                    {/* Grand Total */}
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                      {inv.currency || 'USD'} ${inv.grandTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Balance Due */}
                    <td className="py-3.5 px-4 text-right font-extrabold text-rose-700">
                      {inv.currency || 'USD'} ${inv.amountDue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <InvoiceStatusBadge status={inv.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/customer/invoices/${inv.id}`)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="View Full Document & Print"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-16 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Invoices Issued</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
            There are currently no commercial invoices issued to your account.
          </p>
        </div>
      )}
    </div>
  );
};
