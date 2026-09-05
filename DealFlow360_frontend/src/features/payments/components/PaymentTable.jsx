/**
 * Commercial Payments Data Table Component
 * Phase 15 — DealFlow360
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Barcode,
} from 'lucide-react';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { PAYMENT_METHOD_LABELS } from '../types/paymentTypes';

export const PaymentTable = ({ payments = [], loading = false }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(payments.length / itemsPerPage) || 1;
  const paginatedData = payments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center space-y-4 shadow-2xs">
        <div className="w-8 h-8 border-4 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading payment ledger records...</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center space-y-3">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
          <CreditCard className="w-6 h-6 text-emerald-700" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">No Payment Records Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
          There are currently no payment transactions matching your search criteria.
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
              <th className="py-3.5 px-4">Payment Number</th>
              <th className="py-3.5 px-4">Invoice Ref</th>
              <th className="py-3.5 px-4">Customer Account</th>
              <th className="py-3.5 px-4">Payment Date</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
              <th className="py-3.5 px-4">Payment Method</th>
              <th className="py-3.5 px-4">Reference / Txn #</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium">
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                {/* Payment Number */}
                <td className="py-3.5 px-4 font-mono font-bold text-[#714B67]">
                  <button
                    onClick={() => navigate(`/company/payments/${item.id}`)}
                    className="hover:underline cursor-pointer"
                  >
                    {item.paymentNumber}
                  </button>
                </td>

                {/* Invoice Ref */}
                <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                  <button
                    onClick={() => navigate(`/company/invoices/${item.invoiceId}`)}
                    className="hover:underline text-indigo-700 cursor-pointer"
                  >
                    {item.invoiceId}
                  </button>
                </td>

                {/* Customer */}
                <td className="py-3.5 px-4 font-bold text-slate-900">{item.customerName}</td>

                {/* Date */}
                <td className="py-3.5 px-4 text-slate-600 font-medium">{item.paymentDate}</td>

                {/* Amount */}
                <td className="py-3.5 px-4 text-right font-black text-emerald-800">
                  {item.currency || 'USD'} ${item.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>

                {/* Method */}
                <td className="py-3.5 px-4 text-slate-700 font-semibold">
                  {PAYMENT_METHOD_LABELS[item.paymentMethod] || item.paymentMethod}
                </td>

                {/* Reference */}
                <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                  {item.referenceNumber || 'N/A'}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <PaymentStatusBadge status={item.status} />
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => navigate(`/company/payments/${item.id}`)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="View Detailed Payment Receipt"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
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
            {Math.min(currentPage * itemsPerPage, payments.length)}
          </span>{' '}
          of <span className="font-bold text-slate-900">{payments.length}</span> payments
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
