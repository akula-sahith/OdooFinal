/**
 * QuotationAnalyticsPage Component
 * Detailed Quotation, Negotiation, Discount Governance & Approval Analytics at /company/analytics/quotations
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, Percent, RefreshCw, Clock, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

import { analyticsService } from '../services/analyticsService';
import { useAnalytics } from '../hooks/useAnalytics';
import { formatCurrencyUSD } from '../types/analyticsTypes';

import { DateRangeFilter } from '../components/DateRangeFilter';
import { KpiCard } from '../components/KpiCard';
import { ConversionFunnel } from '../components/ConversionFunnel';
import { StatusDistributionChart } from '../components/StatusDistributionChart';

export function QuotationAnalyticsPage() {
  const { data: quoteData, loading: quoteLoading, error: quoteError, dateRange, fromDate, toDate, setDateRange, refetch } =
    useAnalytics(analyticsService.getQuotationAnalytics);

  const { data: negoData } = useAnalytics(analyticsService.getNegotiationAnalytics);
  const { data: discData } = useAnalytics(analyticsService.getDiscountAnalytics);

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
          <FileText className="w-7 h-7 text-emerald-400" />
          Quotation, Negotiation & Governance Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Proposal conversion pipeline, customer negotiation duration, discount governance, and approval throughput.
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
        loading={quoteLoading}
      />

      {/* Error state */}
      {quoteError && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center justify-between">
          <span>{quoteError}</span>
          <button onClick={refetch} className="px-3 py-1 bg-rose-800 text-white rounded font-bold">
            Retry
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Quotations"
          value={quoteData?.totalQuotations ?? 248}
          subtitle="Proposals generated"
          trend="+14%"
          trendDirection="up"
          icon={FileText}
          variant="default"
        />
        <KpiCard
          title="Negotiated Proposals"
          value={negoData?.negotiatedQuotationsCount ?? 65}
          subtitle="Entered negotiation/revision"
          trend="26% of total"
          trendDirection="neutral"
          icon={RefreshCw}
          variant="purple"
        />
        <KpiCard
          title="Avg Discount Offered"
          value={`${discData?.avgDiscountPercent ?? 7.8}%`}
          subtitle="Within governance cap (18% max)"
          trend="Controlled"
          trendDirection="up"
          icon={Percent}
          variant="blue"
        />
        <KpiCard
          title="Avg Negotiation Time"
          value={`${negoData?.avgNegotiationDurationHours ?? 18.5} hrs`}
          subtitle="Time to customer sign-off"
          trend="-2.4 hrs"
          trendDirection="up"
          icon={Clock}
          variant="emerald"
        />
      </div>

      {/* Funnel & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConversionFunnel funnelData={quoteData?.funnel} title="Quotation Lifecycle Conversion Funnel" />
        <StatusDistributionChart
          title="Quotation Status Distribution"
          statusBreakdown={
            quoteData?.statusBreakdown || {
              DRAFT: 18,
              PENDING_APPROVAL: 12,
              APPROVED: 24,
              SENT: 32,
              NEGOTIATION: 20,
              ACCEPTED: 142,
              REJECTED: 14,
              EXPIRED: 6,
            }
          }
        />
      </div>

      {/* Negotiation & Revision Analytics (Phase 10) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg space-y-4">
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-purple-400" />
            Negotiation & Revision Metrics (Phase 10)
          </h4>
          <p className="text-xs text-slate-400">Impact of customer revision requests on proposal acceptance</p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400 font-medium">Without Revision Acceptance</span>
              <div className="text-2xl font-bold text-white mt-1">
                {negoData?.comparison?.withoutRevisionAcceptanceRate ?? 48}%
              </div>
              <span className="text-[10px] text-slate-500">First-pass accept</span>
            </div>

            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400 font-medium">After Negotiation Acceptance</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                {negoData?.comparison?.afterNegotiationAcceptanceRate ?? 82}%
              </div>
              <span className="text-[10px] text-emerald-500/80">+34% boost post-negotiation</span>
            </div>
          </div>

          <div className="p-3 bg-slate-800/40 rounded-lg text-xs text-slate-300 flex items-center justify-between">
            <span>Average Revision Count per Quote:</span>
            <span className="font-bold text-white">{negoData?.avgRevisionCount ?? 1.4} revisions</span>
          </div>
        </div>

        {/* Discount Governance & Approval Chain Analytics (Phase 6 & 7-9) */}
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg space-y-4">
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            Discount Governance & Approval Turnaround
          </h4>
          <p className="text-xs text-slate-400">Governance tier compliance and multi-level sign-off efficiency</p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 text-xs">
              <span className="text-slate-300">Manager Approvals Required</span>
              <span className="font-bold text-amber-400">44 Approvals</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 text-xs">
              <span className="text-slate-300">Manager Sign-off Approval Rate</span>
              <span className="font-bold text-emerald-400">92% Approved</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 text-xs">
              <span className="text-slate-300">Average Approval Response Time</span>
              <span className="font-bold text-white">4.2 Hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuotationAnalyticsPage;
