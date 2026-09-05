import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Inbox,
  Clock,
  MessageSquare,
  CheckCircle2,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { Skeleton } from '../../../components/feedback/Skeleton/Skeleton';
import { EmptyState } from '../../../components/feedback/EmptyState/EmptyState';
import { ErrorState } from '../../../components/feedback/ErrorState/ErrorState';
import { useSalespersonDashboard } from '../hooks/useSalespersonDashboard';
import { SalespersonRequestTable } from '../components/SalespersonRequestTable';

export const SalespersonDashboardPage = () => {
  const navigate = useNavigate();
  const { metrics, loading, error, refetch } = useSalespersonDashboard();

  if (error) {
    return (
      <div className="py-12">
        <ErrorState
          title="Sales Workspace Unavailable"
          description={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <PageHeader
        title="Salesperson Workspace"
        description="Monitor assigned B2B commercial requirement requests, conduct customer clarifications, and confirm specifications for quotation handoff."
        actions={
          <Button
            variant="primary"
            leftIcon={Inbox}
            onClick={() => navigate('/company/sales/requests')}
            className="bg-[#714B67] hover:bg-[#5a3b52] text-white"
          >
            View Request Queue
          </Button>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Assigned Requests */}
        <Card variant="default" padding="md" className="space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
              Assigned Requests
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#714B67] flex items-center justify-center border border-purple-100">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {metrics?.assignedRequestsCount ?? 0}
            </div>
          )}
          <p className="text-[11px] text-slate-500 font-medium">Total requirements in pipeline</p>
        </Card>

        {/* Card 2: Pending Reviews */}
        <Card variant="default" padding="md" className="space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
              Pending Review
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-3xl font-extrabold text-amber-700 tracking-tight">
              {metrics?.pendingRequestsCount ?? 0}
            </div>
          )}
          <p className="text-[11px] text-slate-500 font-medium">Submitted & under active review</p>
        </Card>

        {/* Card 3: Clarifications Needed */}
        <Card variant="default" padding="md" className="space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
              Awaiting Customer
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-3xl font-extrabold text-blue-700 tracking-tight">
              {metrics?.awaitingCustomerCount ?? 0}
            </div>
          )}
          <p className="text-[11px] text-slate-500 font-medium">Clarifications pending client reply</p>
        </Card>

        {/* Card 4: Confirmed Requirements */}
        <Card variant="default" padding="md" className="space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
              Confirmed Requirements
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-3xl font-extrabold text-emerald-700 tracking-tight">
              {metrics?.confirmedRequirementsCount ?? 0}
            </div>
          )}
          <p className="text-[11px] text-slate-500 font-medium">Ready for quotation generation</p>
        </Card>
      </div>

      {/* Main Content: Recent Assigned Requests */}
      <Card variant="default" padding="none" className="overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Recent Assigned Requirement Requests
            </h2>
            <p className="text-xs text-slate-500">
              Priority requirement proposals requiring sales lead interaction.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/company/sales/requests')}
            rightIcon={ArrowRight}
          >
            View All Requests
          </Button>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : metrics?.recentAssignedRequests?.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No Assigned Requests"
              description="You do not currently have any requirement requests assigned to your queue."
              action={
                <Button
                  variant="outline"
                  onClick={() => navigate('/company/sales/requests')}
                >
                  Explore Unassigned Queue
                </Button>
              }
            />
          </div>
        ) : (
          <SalespersonRequestTable
            requests={metrics?.recentAssignedRequests || []}
            loading={false}
            onView={(id) => navigate(`/company/sales/requests/${id}`)}
          />
        )}
      </Card>
    </div>
  );
};

export default SalespersonDashboardPage;
