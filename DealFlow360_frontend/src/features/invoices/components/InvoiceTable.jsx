/**
 * Commercial Invoices Data Table Component
 * Phase 14 — DealFlow360
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  Edit3,
  Send,
  Printer,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import { INVOICE_STATUS } from '../types/invoiceTypes';

export const InvoiceTable = ({
  invoices = [],
  loading = false,
  onIssueClick,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(invoices.length / itemsPerPage) || 1;
  const paginatedData = invoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center space-y-4 shadow-2xs">
        <div className="w-8 h-8 border-4 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading commercial invoices...</p>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center space-y-3">
        <div className="w-12 h-12 bg-[#F7F2F5] text-[#714B67] rounded-2xl flex items-center justify-center mx-auto border border-[#714B67]/20">
          <FileText className="w-6 h-6 text-[#714B67]" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">No Invoices Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
          There are currently no commercial invoice records matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Invoice Number</th>
              <th className="py-3.5 px-4">Customer Account</th>
              <th className="py-3.5 px-4">Order Reference</th>
              <th className="py-3.5 px-4">Issue Date</th>
              <th className="py-3.5 px-4">Due Date</th>
              <th className="py-3.5 px-4 text-right">Grand Total</th>
              <th className="py-3.5 px-4 text-right">Amount Due</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium">
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                {/* Invoice Number */}
                <td className="py-3.5 px-4 font-mono font-bold text-[#714B67]">
                  <button
                    onClick={() => navigate(`/company/invoices/${item.id}`)}
                    className="hover:underline cursor-pointer"
                  >
                    {item.invoiceNumber}
                  </button>
                </td>

                {/* Customer */}
                <td className="py-3.5 px-4 font-bold text-slate-900">{item.customerName}</td>

                {/* Order */}
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">{item.orderId}</td>

                {/* Issue Date */}
                <td className="py-3.5 px-4 text-slate-600 font-medium">{item.issueDate}</td>

                {/* Due Date */}
                <td className="py-3.5 px-4 text-slate-600 font-medium">{item.dueDate}</td>

                {/* Grand Total */}
                <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                  {item.currency || 'USD'} ${item.grandTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>

                {/* Amount Due */}
                <td className="py-3.5 px-4 text-right font-extrabold text-rose-700">
                  {item.currency || 'USD'} ${item.amountDue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <InvoiceStatusBadge status={item.status} />
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {item.status === INVOICE_STATUS.DRAFT && (
                      <>
                        <button
                          type="button"
                          onClick={() => navigate(`/company/invoices/${item.id}/edit`)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit Draft Invoice"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {onIssueClick && (
                          <button
                            type="button"
                            onClick={() => onIssueClick(item)}
                            className="px-2 py-1 text-xs font-bold bg-[#714B67] hover:bg-[#56384E] text-white rounded-lg shadow-2xs transition-all inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Send className="w-3 h-3" /> Issue
                          </button>
                        )}
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => navigate(`/company/invoices/${item.id}`)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="View Invoice Detail & Document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="font-bold text-slate-900">
            {Math.min(currentPage * itemsPerPage, invoices.length)}
          </span>{' '}
          of <span className="font-bold text-slate-900">{invoices.length}</span> invoices
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="p-1.5 text-slate-600 disabled:text-slate-300 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="p-1.5 text-slate-600 disabled:text-slate-300 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
