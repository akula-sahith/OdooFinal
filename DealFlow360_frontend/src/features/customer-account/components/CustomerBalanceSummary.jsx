import React from 'react';
import { DollarSign, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Card } from '../../../components/ui/Card/Card';

/**
 * CustomerBalanceSummary Component
 * Displays authoritative financial snapshot for the customer.
 */
export const CustomerBalanceSummary = ({ balance, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-200/60 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  const {
    totalInvoiced = 0,
    totalPaid = 0,
    totalOutstanding = 0,
    overdueAmount = 0,
    currency = 'USD',
  } = balance || {};

  const formatCurrency = (val) => {
    return `${currency} $${Number(val || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Invoiced */}
      <Card padding="md" variant="default" className="relative overflow-hidden border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Total Invoiced
            </span>
            <span className="text-xl font-black text-slate-900 mt-1 block">
              {formatCurrency(totalInvoiced)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#714B67] flex items-center justify-center border border-purple-200">
            <DollarSign className="w-5 h-5 text-[#714B67]" />
          </div>
        </div>
        <div className="mt-3 text-[11px] font-medium text-slate-500 flex items-center gap-1">
          <span>Cumulative commercial billing statement</span>
        </div>
      </Card>

      {/* Total Paid */}
      <Card padding="md" variant="default" className="relative overflow-hidden border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Total Paid
            </span>
            <span className="text-xl font-black text-emerald-700 mt-1 block">
              {formatCurrency(totalPaid)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          </div>
        </div>
        <div className="mt-3 text-[11px] font-medium text-emerald-600 flex items-center gap-1">
          <span>Confirmed wire & electronic remittances</span>
        </div>
      </Card>

      {/* Total Outstanding */}
      <Card padding="md" variant="default" className="relative overflow-hidden border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Total Outstanding
            </span>
            <span className="text-xl font-black text-amber-700 mt-1 block">
              {formatCurrency(totalOutstanding)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <Clock className="w-5 h-5 text-amber-700" />
          </div>
        </div>
        <div className="mt-3 text-[11px] font-medium text-amber-700 flex items-center gap-1">
          <span>Active invoice balances pending payment</span>
        </div>
      </Card>

      {/* Overdue Amount */}
      <Card padding="md" variant="default" className="relative overflow-hidden border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Overdue Amount
            </span>
            <span className="text-xl font-black text-rose-700 mt-1 block">
              {formatCurrency(overdueAmount)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200">
            <AlertCircle className="w-5 h-5 text-rose-700" />
          </div>
        </div>
        <div className="mt-3 text-[11px] font-medium text-rose-600 flex items-center gap-1">
          <span>Past due date - action required</span>
        </div>
      </Card>
    </div>
  );
};
