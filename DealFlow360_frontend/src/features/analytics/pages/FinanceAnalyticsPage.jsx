/**
 * FinanceAnalyticsPage Component
 * Invoicing, Payments, & Accounts Receivable Aging Analytics at /company/analytics/finance
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { CreditCard, DollarSign, CheckCircle2, ShieldAlert, PieChart } from 'lucide-react';

import { analyticsService } from '../services/analyticsService';
import { useAnalytics } from '../hooks/useAnalytics';
import { formatCurrencyUSD } from '../types/analyticsTypes';

import { DateRangeFilter } from '../components/DateRangeFilter';
import { KpiCard } from '../components/KpiCard';
import { ReceivablesChart } from '../components/ReceivablesChart';

export function FinanceAnalyticsPage() {
  const { data, loading, error, dateRange, fromDate, toDate, setDateRange, refetch } =
    useAnalytics(analyticsService.getFinanceAnalytics);

  const subNavItems = [
    { label: 'Overview', to: '/company/analytics', end: true },
    { label: 'Sales & Revenue', to: '/company/analytics/sales' },
    { label: 'Quotations & Negotiation', to: '/company/analytics/quotations' },
    { label: 'Orders', to: '/company/analytics/orders' },
    { label: 'Finance & Receivables', to: '/company/analytics/finance' },
    { label: 'Fulfillment & Logistics', to: '/company/analytics/fulfillment' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <CreditCard className="w-7 h-7 text-amber-400" />
          Finance, Payments & Receivables Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor total invoiced revenue, recorded payments, outstanding receivables, overdue balances, and payment collection rate.
        </p>
      </div>

      {/* Analytics Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-2">
        {subNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Date Filter Bar */}
      <DateRangeFilter
        selectedRange={dateRange}
        fromDate={fromDate}
        toDate={toDate}
        onRangeChange={setDateRange}
        onRefresh={refetch}
        loading={loading}
      />

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={refetch} className="px-3 py-1 bg-rose-800 text-white rounded font-bold">
            Retry
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Invoiced"
          value={formatCurrencyUSD(data?.totalInvoicedUSD ?? 227880)}
          subtitle="Commercial invoices issued"
          trend="+18%"
          trendDirection="up"
          icon={DollarSign}
          variant="purple"
        />
        <KpiCard
          title="Total Payments Collected"
          value={formatCurrencyUSD(data?.totalPaidUSD ?? 50000)}
          subtitle="Cleared customer funds"
          trend="+12%"
          trendDirection="up"
          icon={CheckCircle2}
          variant="emerald"
        />
        <KpiCard
          title="Total Outstanding"
          value={formatCurrencyUSD(data?.totalOutstandingUSD ?? 177880)}
          subtitle="Remaining unpaid balance"
          trend="Collection in progress"
          trendDirection="neutral"
          icon={CreditCard}
          variant="amber"
        />
        <KpiCard
          title="Payment Collection Rate"
          value={`${data?.paymentCollectionRatePercent ?? 22}%`}
          subtitle="Paid vs Invoiced ratio"
          trend="Target: >85%"
          trendDirection="neutral"
          icon={PieChart}
          variant="blue"
        />
      </div>

      {/* Financial Summary Example Box */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
        <h4 className="text-base font-semibold text-white mb-4">Financial Ledger Summary (Phase 14 & 15 Integration)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <span className="text-[11px] font-semibold uppercase text-slate-400">INVOICED</span>
            <div className="text-xl font-bold text-white mt-1">{formatCurrencyUSD(data?.totalInvoicedUSD ?? 227880)}</div>
          </div>
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <span className="text-[11px] font-semibold uppercase text-emerald-400">PAID</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">{formatCurrencyUSD(data?.totalPaidUSD ?? 50000)}</div>
          </div>
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <span className="text-[11px] font-semibold uppercase text-amber-400">OUTSTANDING</span>
            <div className="text-xl font-bold text-amber-400 mt-1">{formatCurrencyUSD(data?.totalOutstandingUSD ?? 177880)}</div>
          </div>
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <span className="text-[11px] font-semibold uppercase text-rose-400">OVERDUE</span>
            <div className="text-xl font-bold text-rose-400 mt-1">{formatCurrencyUSD(data?.totalOverdueUSD ?? 0)}</div>
          </div>
        </div>
      </div>

      {/* Receivables Aging Chart */}
      <ReceivablesChart agingData={data?.receivablesAging} />
    </div>
  );
}

export default FinanceAnalyticsPage;
