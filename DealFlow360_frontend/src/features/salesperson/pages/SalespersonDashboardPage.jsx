import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Inbox,
  Clock,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertCircle,
} from 'lucide-react';
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
      <div className="space-y-6 md:space-y-8">
        <ErrorState
          title="Sales Workspace Unavailable"
          description={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 text-left pb-6">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            Salesperson Operational Pipeline
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sales Work Queue & Actions
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Monitor assigned B2B commercial requirement requests, conduct customer technical clarifications, and prepare specifications for quotation approval handoff.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={Inbox}
          onClick={() => navigate('/company/sales/requests')}
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-lg shadow-purple-600/30 transition self-start md:self-auto"
        >
          View Full Request Queue
        </Button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Assigned Requests */}
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4 hover:border-purple-500/30 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Assigned Requests
            </span>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-9 w-24 bg-slate-800" />
          ) : (
            <div className="text-3xl font-black text-white tracking-tight">
              {metrics?.assignedRequestsCount ?? 0}
            </div>
          )}
          <p className="text-xs text-slate-400 font-medium">Requirements in active pipeline</p>
        </div>

        {/* Card 2: Pending Reviews */}
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4 hover:border-amber-500/30 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending Review
            </span>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-9 w-24 bg-slate-800" />
          ) : (
            <div className="text-3xl font-black text-amber-400 tracking-tight">
              {metrics?.pendingRequestsCount ?? 0}
            </div>
          )}
          <p className="text-xs text-slate-400 font-medium">Submitted & under review</p>
        </div>

        {/* Card 3: Clarifications Needed */}
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4 hover:border-blue-500/30 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Clarification Needed
            </span>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-9 w-24 bg-slate-800" />
          ) : (
            <div className="text-3xl font-black text-blue-400 tracking-tight">
              {metrics?.inClarificationCount ?? 0}
            </div>
          )}
          <p className="text-xs text-slate-400 font-medium">Awaiting customer specifications</p>
        </div>

        {/* Card 4: Proposal Ready */}
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4 hover:border-emerald-500/30 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Proposal Ready
            </span>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-9 w-24 bg-slate-800" />
          ) : (
            <div className="text-3xl font-black text-emerald-400 tracking-tight">
              {metrics?.proposalReadyCount ?? 0}
            </div>
          )}
          <p className="text-xs text-slate-400 font-medium">Ready for quotation draft</p>
        </div>
      </div>

      {/* Main Priority Work Table Area */}
      <div className="p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Priority Requirement Requests Queue
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Active commercial requirement requests assigned to your sales account.
            </p>
          </div>

          <button
            onClick={() => navigate('/company/quotations/new')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 transition self-start sm:self-auto"
          >
            Create New Quotation
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-3 py-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-800/60 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : metrics?.requests?.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No Assigned Requests"
            description="You currently have no pending customer requirement requests assigned to your queue."
          />
        ) : (
          <SalespersonRequestTable requests={metrics?.requests || []} />
        )}
      </div>
    </div>
  );
};

export default SalespersonDashboardPage;
