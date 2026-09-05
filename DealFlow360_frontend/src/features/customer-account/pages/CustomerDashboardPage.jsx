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
    <div className="space-y-6 text-left pb-16">
      {/* Welcome Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-900/60 border border-purple-700/50 text-purple-200 text-xs font-semibold mb-2">
              <Building2 className="w-3.5 h-3.5" />
              {companyName}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Welcome back, {displayName}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Quotations Metric */}
        <Card padding="md" variant="default" className="flex flex-col justify-between h-full border border-slate-200/90 shadow-2xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Quotations
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#714B67] flex items-center justify-center border border-purple-200">
                <Tag className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{activeQuotations}</span>
              <span className="text-xs text-slate-500 font-medium">({acceptedQuotations} Accepted)</span>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/customer/quotations')}
              className="w-full justify-between text-xs"
            >
              <span>View Proposals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>

        {/* Active Orders Metric */}
        <Card padding="md" variant="default" className="flex flex-col justify-between h-full border border-slate-200/90 shadow-2xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Active Orders
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#714B67] flex items-center justify-center border border-purple-200">
                <ShoppingCart className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-slate-900">{activeOrders}</span>
              <span className="text-xs text-slate-500 font-medium ml-2">In Pipeline</span>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/customer/orders')}
              className="w-full justify-between text-xs"
            >
              <span>View Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>

        {/* Pending Deliveries Metric */}
        <Card padding="md" variant="default" className="flex flex-col justify-between h-full border border-slate-200/90 shadow-2xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Pending Deliveries
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#F7F2F5] text-[#714B67] flex items-center justify-center border border-[#714B67]/20">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-slate-900">{pendingDeliveries}</span>
              <span className="text-xs text-slate-500 font-medium ml-2">Consignment(s)</span>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/customer/shipments')}
              className="w-full justify-between text-xs"
            >
              <span>Track Shipments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>

        {/* Payments Summary Metric */}
        <Card padding="md" variant="default" className="flex flex-col justify-between h-full border border-slate-200/90 shadow-2xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Payment History
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-emerald-700">{dashboard?.recentPaymentsCount || 0}</span>
              <span className="text-xs text-slate-500 font-medium ml-2">Transactions</span>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/customer/payments')}
              className="w-full justify-between text-xs"
            >
              <span>View Payments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Commercial Activity Feed */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#714B67]" />
            Recent Commercial Activity
          </h3>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Live Feed</span>
        </div>

        <div className="divide-y divide-slate-100">
          {recentActivities.length > 0 ? (
            recentActivities.map((act) => (
              <div
                key={act.id}
                onClick={() => act.link && navigate(act.link)}
                className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#714B67] flex items-center justify-center shrink-0 border border-purple-200">
                    {act.type === 'PAYMENT_RECEIVED' ? (
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                    ) : act.type === 'INVOICE_ISSUED' ? (
                      <Receipt className="w-4 h-4 text-indigo-600" />
                    ) : act.type === 'SHIPMENT_DISPATCHED' ? (
                      <Truck className="w-4 h-4 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-[#714B67]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">{act.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{act.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {new Date(act.timestamp).toLocaleDateString()}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">No recent commercial activity recorded.</p>
          )}
        </div>
      </div>

      {/* Security Domain Isolation Footnote */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
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
