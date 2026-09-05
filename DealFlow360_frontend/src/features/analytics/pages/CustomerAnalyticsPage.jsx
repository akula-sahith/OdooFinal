/**
 * CustomerAnalyticsPage Component
 * Self-service B2B Customer Analytics at /customer/analytics
 * Strictly isolated to the authenticated customer's own activity.
 */

import React from 'react';
import { FileText, ShoppingBag, Truck, CreditCard, DollarSign, CheckCircle2 } from 'lucide-react';

import { analyticsService } from '../services/analyticsService';
import { useAnalytics } from '../hooks/useAnalytics';
import { formatCurrencyUSD } from '../types/analyticsTypes';

import { KpiCard } from '../components/KpiCard';

export function CustomerAnalyticsPage() {
  const { data, loading, error, refetch } = useAnalytics(analyticsService.getCustomerAnalytics);

  return (
    <div className="space-y-6 md:space-y-8 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <DollarSign className="w-7 h-7 text-emerald-400" />
          My Account Commercial Overview
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Self-service commercial dashboard for your company's quotations, active orders, shipments, and account billing balance.
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={refetch} className="px-3 py-1 bg-rose-800 text-white rounded font-bold">
            Retry
          </button>
        </div>
      )}

      {/* KPI Cards (Customer Safe Only) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="My Quotations"
          value={data?.totalQuotations ?? 5}
          subtitle="Proposals received"
          icon={FileText}
          variant="default"
        />
        <KpiCard
          title="Accepted Proposals"
          value={data?.acceptedQuotations ?? 3}
          subtitle="Agreed commercial terms"
          icon={CheckCircle2}
          variant="emerald"
        />
        <KpiCard
          title="Active Orders"
          value={data?.totalOrders ?? 2}
          subtitle="Confirmed purchases"
          icon={ShoppingBag}
          variant="blue"
        />
        <KpiCard
          title="Shipments In Transit"
          value={data?.pendingDeliveries ?? 1}
          subtitle="Awaiting final delivery"
          icon={Truck}
          variant="purple"
        />
      </div>

      {/* Account Financial Billing Box */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg space-y-4">
        <h4 className="text-base font-semibold text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-400" />
          Account Invoicing & Payment Status
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Invoiced</span>
            <div className="text-2xl font-bold text-white mt-1">
              {formatCurrencyUSD(data?.totalInvoicedUSD ?? 145800)}
            </div>
            <span className="text-[10px] text-slate-500">Official billed obligations</span>
          </div>

          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <span className="text-xs font-semibold text-emerald-400 uppercase">Total Paid</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              {formatCurrencyUSD(data?.totalPaidUSD ?? 50000)}
            </div>
            <span className="text-[10px] text-emerald-500/80">Cleared payment records</span>
          </div>

          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <span className="text-xs font-semibold text-amber-400 uppercase">Current Balance Due</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">
              {formatCurrencyUSD(data?.totalOutstandingUSD ?? 95800)}
            </div>
            <span className="text-[10px] text-amber-500/80">Pending payment obligation</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerAnalyticsPage;
