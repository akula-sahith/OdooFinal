/**
 * SalesAnalyticsPage Component
 * Detailed Sales & Revenue Analytics at /company/analytics/sales
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { TrendingUp, DollarSign, ShoppingBag, Award, Users, Package } from 'lucide-react';

import { analyticsService } from '../services/analyticsService';
import { useAnalytics } from '../hooks/useAnalytics';
import { formatCurrencyUSD } from '../types/analyticsTypes';

import { DateRangeFilter } from '../components/DateRangeFilter';
import { KpiCard } from '../components/KpiCard';
import { RevenueChart } from '../components/RevenueChart';
import { SalespersonPerformanceTable } from '../components/SalespersonPerformanceTable';
import { TopProductsTable } from '../components/TopProductsTable';

export function SalesAnalyticsPage() {
  const { data, loading, error, dateRange, fromDate, toDate, setDateRange, refetch } =
    useAnalytics(analyticsService.getSalesAnalytics);

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
          <TrendingUp className="w-7 h-7 text-emerald-400" />
          Sales & Revenue Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Revenue trends, salesperson performance leaderboard, customer revenue distribution, and top products.
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
          title="Total Sales Revenue"
          value={formatCurrencyUSD(data?.totalSalesUSD ?? 413000)}
          subtitle="Gross sales generated"
          trend="+24%"
          trendDirection="up"
          icon={DollarSign}
          variant="emerald"
        />
        <KpiCard
          title="Orders Completed"
          value={data?.ordersCount ?? 96}
          subtitle="Closed sales orders"
          trend="+15%"
          trendDirection="up"
          icon={ShoppingBag}
          variant="blue"
        />
        <KpiCard
          title="Average Order Value"
          value={formatCurrencyUSD(data?.avgOrderValueUSD ?? 4302)}
          subtitle="Average revenue per deal"
          trend="+8%"
          trendDirection="up"
          icon={TrendingUp}
          variant="purple"
        />
        <KpiCard
          title="Quotation Conversion"
          value={`${data?.conversionRatePercent ?? 57}%`}
          subtitle="Proposals won"
          trend="+5%"
          trendDirection="up"
          icon={Award}
          variant="amber"
        />
      </div>

      {/* Revenue Trend Chart */}
      <RevenueChart data={data?.revenueByMonth} title="Monthly Sales Revenue (2026)" />

      {/* Salesperson Leaderboard */}
      <SalespersonPerformanceTable data={data?.revenueBySalesperson} />

      {/* Top Customers Breakdown */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
        <h4 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-400" />
          Top Customers by Revenue Contribution
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-700">
              <tr>
                <th className="px-4 py-3">Customer ID & Name</th>
                <th className="px-4 py-3 text-center">Orders</th>
                <th className="px-4 py-3 text-right">Total Spent (USD)</th>
                <th className="px-4 py-3 text-right">Outstanding (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {(data?.topCustomers || []).map((cust) => (
                <tr key={cust.customerId} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-semibold text-white">
                    {cust.customerName} <span className="text-[10px] text-slate-500 font-mono">({cust.customerId})</span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-300">{cust.orders}</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-400">
                    {formatCurrencyUSD(cust.totalSpentUSD)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-amber-400">
                    {formatCurrencyUSD(cust.outstandingUSD)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products Table */}
      <TopProductsTable />
    </div>
  );
}

export default SalesAnalyticsPage;
