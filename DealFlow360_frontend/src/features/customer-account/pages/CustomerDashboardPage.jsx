import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Tag,
  ShoppingCart,
  Truck,
  Receipt,
  CreditCard,
  ArrowRight,
  Activity,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';
import { useCustomerAuth } from '../../customer-auth/hooks/useCustomerAuth';
import { useCustomerAccount } from '../hooks/useCustomerAccount';
import { useCustomerDashboard } from '../hooks/useCustomerDashboard';
import { useCustomerBalance } from '../hooks/useCustomerBalance';
import { CustomerBalanceSummary } from '../components/CustomerBalanceSummary';
import { CommercialTimeline } from '../components/CommercialTimeline';

export const CustomerDashboardPage = () => {
  const navigate = useNavigate();
  const { customerUser } = useCustomerAuth();
  const { profile } = useCustomerAccount();
  const { dashboard, loading: dashLoading } = useCustomerDashboard();
  const { balance, loading: balLoading } = useCustomerBalance();

  const displayName = customerUser?.name || profile?.firstName || customerUser?.companyName || 'Client User';
  const companyName = customerUser?.companyName || profile?.companyName || 'Enterprise Account';

  const {
    activeQuotations = 0,
    acceptedQuotations = 0,
    activeOrders = 0,
    pendingDeliveries = 0,
    recentActivities = [],
  } = dashboard || {};

  return (
    <div className="space-y-6 md:space-y-8 text-left pb-6">
      {/* Welcome Banner Header */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              {companyName}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {displayName}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Official Client Procurement & Order Billing Workspace. Monitor live orders, shipment dispatches, commercial invoices, and remittance history.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <StatusBadge status={profile?.accountStatus || 'ACTIVE'} />
          </div>
        </div>
      </div>

      {/* Authoritative Financial Balance Summary */}
      <CustomerBalanceSummary balance={balance} loading={balLoading} />

      {/* End-to-End Commercial Lifecycle Timeline */}
      <CommercialTimeline />

      {/* 4 Primary Operational Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Quotations Metric */}
        <Card padding="lg" variant="default" className="flex flex-col justify-between h-full border border-slate-200/90 shadow-sm hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Quotations
              </span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#714B67] flex items-center justify-center border border-purple-200">
                <Tag className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{activeQuotations}</span>
              <span className="text-xs text-slate-500 font-semibold">({acceptedQuotations} Accepted)</span>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/customer/quotations')}
              className="w-full justify-between text-xs font-semibold"
            >
              <span>View Proposals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>

        {/* Active Orders Metric */}
        <Card padding="lg" variant="default" className="flex flex-col justify-between h-full border border-slate-200/90 shadow-sm hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Orders
              </span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#714B67] flex items-center justify-center border border-purple-200">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-slate-900">{activeOrders}</span>
              <span className="text-xs text-slate-500 font-semibold ml-2">In Pipeline</span>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/customer/orders')}
              className="w-full justify-between text-xs font-semibold"
            >
              <span>View Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>

        {/* Pending Deliveries Metric */}
        <Card padding="lg" variant="default" className="flex flex-col justify-between h-full border border-slate-200/90 shadow-sm hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pending Deliveries
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#F7F2F5] text-[#714B67] flex items-center justify-center border border-[#714B67]/20">
                <Truck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-slate-900">{pendingDeliveries}</span>
              <span className="text-xs text-slate-500 font-semibold ml-2">Consignment(s)</span>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/customer/shipments')}
              className="w-full justify-between text-xs font-semibold"
            >
              <span>Track Shipments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>

        {/* Payments Summary Metric */}
        <Card padding="lg" variant="default" className="flex flex-col justify-between h-full border border-slate-200/90 shadow-sm hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Payment History
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-emerald-700">{dashboard?.recentPaymentsCount || 0}</span>
              <span className="text-xs text-slate-500 font-semibold ml-2">Transactions</span>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/customer/payments')}
              className="w-full justify-between text-xs font-semibold"
            >
              <span>View Payments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Commercial Activity Feed */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#714B67]" />
            Recent Commercial Activity
          </h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Activity Stream</span>
        </div>

        <div className="divide-y divide-slate-100">
          {recentActivities.length > 0 ? (
            recentActivities.map((act) => (
              <div
                key={act.id}
                onClick={() => act.link && navigate(act.link)}
                className="py-4 flex items-center justify-between hover:bg-slate-50 px-3 rounded-2xl transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#714B67] flex items-center justify-center shrink-0 border border-purple-200">
                    {act.type === 'PAYMENT_RECEIVED' ? (
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                    ) : act.type === 'INVOICE_ISSUED' ? (
                      <Receipt className="w-5 h-5 text-indigo-600" />
                    ) : act.type === 'SHIPMENT_DISPATCHED' ? (
                      <Truck className="w-5 h-5 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-[#714B67]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{act.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{act.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(act.timestamp).toLocaleDateString()}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 py-8 text-center font-medium">No recent commercial activity recorded.</p>
          )}
        </div>
      </div>

      {/* Security Domain Isolation Footnote */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
        <span className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          Customer Ownership & RBAC Domain Isolation Active
        </span>
        <button
          type="button"
          onClick={() => navigate('/customer/profile')}
          className="text-[#714B67] font-bold hover:underline"
        >
          View Client Profile →
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
