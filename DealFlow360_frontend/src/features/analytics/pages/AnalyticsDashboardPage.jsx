/**
 * AnalyticsDashboardPage Component
 * Main Executive Analytics Dashboard at /company/analytics
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  CreditCard,
  Clock,
  BarChart3,
  Percent,
} from 'lucide-react';

import { analyticsService } from '../services/analyticsService';
import { useAnalytics } from '../hooks/useAnalytics';
import { formatCurrencyUSD } from '../types/analyticsTypes';

import { DateRangeFilter } from '../components/DateRangeFilter';
import { KpiCard } from '../components/KpiCard';
import { RevenueChart } from '../components/RevenueChart';
import { ConversionFunnel } from '../components/ConversionFunnel';
import { StatusDistributionChart } from '../components/StatusDistributionChart';

export function AnalyticsDashboardPage() {
  const { data, loading, error, dateRange, fromDate, toDate, setDateRange, refetch } =
    useAnalytics(analyticsService.getDashboardMetrics);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-emerald-400" />
            Executive Reporting & Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Data-driven insights across Quotations, Orders, Inventory, Fulfillment, Invoices, & Payments.
          </p>
        </div>
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

      {/* KPI Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-900/60 border border-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Total Quotations"
            value={data?.totalQuotations ?? '—'}
            subtitle="Quotes created in period"
            trend={data?.trends?.quotations}
            trendDirection={data?.trends?.quotations ? 'up' : 'neutral'}
            icon={FileText}
            variant="default"
          />
          <KpiCard
            title="Accepted Quotations"
            value={data?.acceptedQuotations ?? '—'}
            subtitle="Customer accepted proposals"
            trend={data?.trends?.accepted}
            trendDirection={data?.trends?.accepted ? 'up' : 'neutral'}
            icon={CheckCircle2}
            variant="emerald"
          />
          <KpiCard
            title="Confirmed Orders"
            value={data?.orders ?? '—'}
            subtitle="Converted into active orders"
            trend={data?.trends?.orders}
            trendDirection={data?.trends?.orders ? 'up' : 'neutral'}
            icon={ShoppingBag}
            variant="blue"
          />
          <KpiCard
            title="Total Revenue"
            value={data?.revenueUSD != null ? formatCurrencyUSD(data.revenueUSD) : '—'}
            subtitle="Invoiced billable revenue"
            trend={data?.trends?.revenue}
            trendDirection={data?.trends?.revenue ? 'up' : 'neutral'}
            icon={DollarSign}
            variant="purple"
          />
          <KpiCard
            title="Outstanding Balance"
            value={data?.outstandingUSD != null ? formatCurrencyUSD(data.outstandingUSD) : '—'}
            subtitle="Unpaid customer receivables"
            trend={data?.trends?.outstanding}
            trendDirection="down"
            icon={CreditCard}
            variant="amber"
          />
          <KpiCard
            title="Conversion Rate"
            value={data?.conversionRate != null ? `${data.conversionRate}%` : '—'}
            subtitle="Quote to Accepted ratio"
            trend={data?.trends?.conversion}
            trendDirection={data?.trends?.conversion ? 'up' : 'neutral'}
            icon={Percent}
            variant="emerald"
          />
          <KpiCard
            title="Avg Order Value"
            value={data?.avgOrderValue != null ? formatCurrencyUSD(data.avgOrderValue) : '—'}
            subtitle="Average revenue per order"
            trend={data?.trends?.avgOrder}
            trendDirection={data?.trends?.avgOrder ? 'up' : 'neutral'}
            icon={TrendingUp}
            variant="blue"
          />
          <KpiCard
            title="Pending Approvals"
            value={data?.pendingApprovals ?? 0}
            subtitle="Awaiting manager/finance sign-off"
            trend="Needs review"
            trendDirection="neutral"
            icon={Clock}
            variant="rose"
          />
        </div>
      )}

      {/* Main Charts & Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={data?.periodDistribution} />
        <ConversionFunnel funnelData={data?.conversionFunnel || []} />
      </div>

      {/* Status Breakdown Section */}
      <StatusDistributionChart
        title="Quotation Lifecycle Distribution"
        statusBreakdown={data?.statusBreakdown || {}}
      />
    </div>
  );
}

export default AnalyticsDashboardPage;
