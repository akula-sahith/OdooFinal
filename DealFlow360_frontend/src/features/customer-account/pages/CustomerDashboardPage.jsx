import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, FileText, MessageSquare, Tag, ShieldCheck, ArrowRight } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';
import { useCustomerAuth } from '../../customer-auth/hooks/useCustomerAuth';
import { useCustomerAccount } from '../hooks/useCustomerAccount';
import { useUnreadNotifications } from '../../notifications/hooks/useUnreadNotifications';

export const CustomerDashboardPage = () => {
  const navigate = useNavigate();
  const { customerUser } = useCustomerAuth();
  const { profile } = useCustomerAccount();
  const { requests } = useCustomerRequests();
  const { unreadCount: unreadNotifications } = useUnreadNotifications('CUSTOMER');

  const displayName = customerUser?.name || profile?.firstName || 'Client';
  const companyName = customerUser?.companyName || profile?.companyName || 'Enterprise Account';

  const activeCount = requests.filter((r) => r.status !== 'CLOSED' && r.status !== 'CANCELLED').length;
  const draftCount = requests.filter((r) => r.status === 'DRAFT').length;
  const clarificationCount = requests.filter((r) => r.status === 'REQUIREMENT_CLARIFICATION').length;

  return (
    <div className="space-y-6 text-left">
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
              Your official B2B portal for managing commercial requirements, proposal requests, custom pricing, and orders.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <StatusBadge status={profile?.accountStatus || 'ACTIVE'} />
          </div>
        </div>
      </div>

      {/* Feature Foundation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Requests Shell */}
        <Card variant="default" padding="lg" className="flex flex-col justify-between h-full">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#714B67] flex items-center justify-center mb-4 font-bold border border-purple-200">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">My Requests</h3>
            <p className="text-xs text-slate-500 mt-1">
              Submit commercial product requirement proposals to assigned sales engineers.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              {requests.length > 0 ? (
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Active Requests: <span className="font-bold text-[#714B67]">{activeCount}</span></span>
                  <span className="text-slate-500">Drafts: <span className="font-bold text-slate-800">{draftCount}</span></span>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-600">No active requests</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Your submitted requirements will appear here.</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/customer/requests')}
              className="w-full justify-between"
            >
              <span>View Requests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>

        {/* Conversations Shell */}
        <Card variant="default" padding="lg" className="flex flex-col justify-between h-full">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#714B67] flex items-center justify-center mb-4 font-bold border border-purple-200">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Conversations</h3>
            <p className="text-xs text-slate-500 mt-1">
              Direct commercial communication with assigned DealFlow360 representatives.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Needs Clarification: <span className="font-bold text-amber-700">{clarificationCount}</span></span>
                <span className="font-semibold text-slate-700">Unread Alerts: <span className="font-bold text-[#714B67]">{unreadNotifications}</span></span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Real-time messaging thread with assigned sales engineers.</p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/customer/conversations')}
              className="w-full justify-between"
            >
              <span>View Conversations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>

        {/* Quotations Shell */}
        <Card variant="default" padding="lg" className="flex flex-col justify-between h-full">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#714B67] flex items-center justify-center mb-4 font-bold border border-purple-200">
              <Tag className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">My Quotations</h3>
            <p className="text-xs text-slate-500 mt-1">
              Review custom pricing proposals, line items, discounts, and approval terms.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
              <p className="text-xs font-semibold text-slate-600">No proposals available</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Commercial quotations will appear here.</p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/customer/quotations')}
              className="w-full justify-between"
            >
              <span>View Quotations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Security Info Footnote */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Enterprise Customer Domain Isolation Active
        </span>
        <button
          type="button"
          onClick={() => navigate('/customer/account')}
          className="text-[#714B67] font-bold hover:underline"
        >
          Manage Account Settings
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
