import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { InvoiceStatusBadge } from '../../invoices/components/InvoiceStatusBadge';

export const CustomerInvoiceTable = ({ invoices = [] }) => {
  const navigate = useNavigate();

  if (!invoices || invoices.length === 0) return null;

  return (
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
              <th className="py-3.5 px-4 text-right">Amount Paid</th>
              <th className="py-3.5 px-4 text-right">Balance Due</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium">
            {invoices.map((inv) => (
              <tr key={inv.id || inv.invoiceNumber} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#714B67]">
                  <button
                    onClick={() => navigate(`/customer/invoices/${inv.id || inv.invoiceNumber}`)}
                    className="hover:underline cursor-pointer"
                  >
                    {inv.invoiceNumber || inv.id}
                  </button>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-700 font-semibold">{inv.orderId || 'N/A'}</td>
                <td className="py-3.5 px-4 text-slate-600">{inv.issueDate}</td>
                <td className="py-3.5 px-4 text-slate-600">{inv.dueDate}</td>
                <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                  {inv.currency || 'USD'} ${inv.grandTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                  {inv.currency || 'USD'} ${inv.amountPaid?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3.5 px-4 text-right font-extrabold text-rose-700">
                  {inv.currency || 'USD'} ${inv.amountDue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3.5 px-4">
                  <InvoiceStatusBadge status={inv.status} />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => navigate(`/customer/invoices/${inv.id || inv.invoiceNumber}`)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="View Invoice Detail"
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
  );
};
