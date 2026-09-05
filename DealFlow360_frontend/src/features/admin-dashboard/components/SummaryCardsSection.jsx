import React from 'react';
import { Users, FileText, ShoppingCart, CheckSquare, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/feedback/Skeleton';
import { ErrorState } from '../../../components/feedback/ErrorState';

/**
 * Summary Cards Operational Section
 * Displays top-level metrics for Customers, Quotations, Orders, and Approvals.
 */
export const SummaryCardsSection = ({
  metrics = null, // { customers: { total, newThisPeriod }, quotations: { total, pendingApproval }, orders: { total, activeOrders }, approvals: { pendingCount } }
  isLoading = false,
  error = null,
  onRetry,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx} variant="standard" className="p-5">
            <Skeleton variant="text" width="40%" />
            <div className="py-2">
              <Skeleton variant="text" width="60%" height="28px" />
            </div>
            <Skeleton variant="text" width="80%" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="bordered" className="border-rose-200">
        <CardContent>
          <ErrorState
            title="Unable to load summary metrics"
            message={error}
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    );
  }

  const cardConfigs = [
    {
      key: 'customers',
      title: 'Customers',
      icon: Users,
      destination: '/company/customers',
      value: metrics?.customers?.total,
      secondary: metrics?.customers?.newThisPeriod !== undefined ? `${metrics.customers.newThisPeriod} new this period` : null,
      color: 'bg-blue-50 text-blue-700 border-blue-100',
    },
    {
      key: 'quotations',
      title: 'Quotations',
      icon: FileText,
      destination: '/company/quotations',
      value: metrics?.quotations?.total,
      secondary: metrics?.quotations?.pendingApproval !== undefined ? `${metrics.quotations.pendingApproval} awaiting approval` : null,
      color: 'bg-[#F7F2F5] text-[#714B67] border-[#714B67]/20',
    },
    {
      key: 'orders',
      title: 'Sales Orders',
      icon: ShoppingCart,
      destination: '/company/orders',
      value: metrics?.orders?.total,
      secondary: metrics?.orders?.activeOrders !== undefined ? `${metrics.orders.activeOrders} active fulfillment` : null,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    {
      key: 'approvals',
      title: 'Pending Approvals',
      icon: CheckSquare,
      destination: '/company/approvals',
      value: metrics?.approvals?.pendingCount,
      secondary: metrics?.approvals?.pendingCount > 0 ? 'Action required by manager' : 'All clear',
      color: 'bg-amber-50 text-amber-800 border-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardConfigs.map((cfg) => {
        const Icon = cfg.icon;
        const hasValue = cfg.value !== undefined && cfg.value !== null;

        return (
          <Card
            key={cfg.key}
            variant="interactive"
            onClick={() => navigate(cfg.destination)}
            className="group p-5 flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {cfg.title}
              </span>
              <div className={`p-2.5 rounded-xl border ${cfg.color}`}>
                <Icon className="w-4 h-4 shrink-0" />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                  {hasValue ? cfg.value.toLocaleString() : '—'}
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[#714B67] transition-colors" />
              </div>

              <p className="text-xs text-slate-500 font-medium truncate">
                {cfg.secondary || (hasValue ? 'Total recorded' : 'No data recorded yet')}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default SummaryCardsSection;
