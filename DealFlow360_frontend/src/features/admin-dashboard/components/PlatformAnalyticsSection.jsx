import React from 'react';
import { BarChart3, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Select } from '../../../components/ui/Select';
import { Skeleton } from '../../../components/feedback/Skeleton';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ErrorState } from '../../../components/feedback/ErrorState';

/**
 * Platform Analytics & Reporting Section
 * Provides Admin with broad, company-wide analytics and multi-dimensional report filters.
 */
export const PlatformAnalyticsSection = ({
  analytics = null, // { totalPlatformQuotationValue, approvedVolume, activeAccounts, transactionCount, periodDistribution }
  timeRange = '30d',
  onTimeRangeChange,
  selectedTeam = 'all',
  onTeamChange,
  selectedCategory = 'all',
  onCategoryChange,
  isLoading = false,
  error = null,
  onRetry,
}) => {
  const timeOptions = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
  ];

  if (isLoading) {
    return (
      <Card variant="standard">
        <CardHeader>
          <Skeleton variant="text" width="200px" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton variant="rectangle" height="80px" />
          <Skeleton variant="rectangle" height="160px" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="bordered" className="border-rose-200">
        <CardContent>
          <ErrorState
            title="Unable to load platform analytics"
            message={error}
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    );
  }

  const hasData = analytics && (
    analytics.totalPlatformQuotationValue !== undefined ||
    analytics.approvedVolume !== undefined ||
    analytics.activeAccounts !== undefined ||
    (analytics.periodDistribution && analytics.periodDistribution.length > 0)
  );

  return (
    <Card variant="standard">
      <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#714B67]" />
            <CardTitle>Platform Analytics & Reporting</CardTitle>
          </div>
          <CardDescription>
            Company-wide transaction volume, category metrics, and team performance visibility.
          </CardDescription>
        </div>

        {/* Multi-Dimensional Analytics Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Team Filter */}
          <div className="w-36">
            <Select
              placeholder="All Teams"
              value={selectedTeam}
              onChange={(e) => onTeamChange && onTeamChange(e.target.value)}
              options={[
                { value: 'all', label: 'All Teams' },
                { value: 'enterprise', label: 'Enterprise Sales' },
                { value: 'smb', label: 'SMB Sales' },
              ]}
              className="h-8 text-xs py-0"
              containerClassName="space-y-0"
            />
          </div>

          {/* Category Filter */}
          <div className="w-36">
            <Select
              placeholder="All Categories"
              value={selectedCategory}
              onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'hardware', label: 'Hardware' },
                { value: 'services', label: 'Services' },
                { value: 'software', label: 'Software' },
              ]}
              className="h-8 text-xs py-0"
              containerClassName="space-y-0"
            />
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
            {timeOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onTimeRangeChange && onTimeRangeChange(opt.id)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  timeRange === opt.id
                    ? 'bg-[#714B67] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-5">
        {!hasData ? (
          <EmptyState
            icon={BarChart3}
            title="No platform analytics data"
            description={`No transactions or metrics recorded for the selected filter set.`}
          />
        ) : (
          <>
            {/* Analytics Metric Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-left space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Platform Volume
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading">
                  {analytics.totalPlatformQuotationValue !== undefined ? `$${analytics.totalPlatformQuotationValue.toLocaleString()}` : '—'}
                </span>
              </div>

              <div className="p-4 bg-[#F7F2F5]/60 rounded-xl border border-[#714B67]/20 text-left space-y-1">
                <span className="text-[11px] font-bold text-[#714B67] uppercase tracking-wider block">
                  Approved Volume
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-[#714B67] font-heading">
                  {analytics.approvedVolume !== undefined ? `$${analytics.approvedVolume.toLocaleString()}` : '—'}
                </span>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/70 text-left space-y-1">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Active Client Accounts
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-emerald-700 font-heading">
                  {analytics.activeAccounts !== undefined ? analytics.activeAccounts.toLocaleString() : '—'}
                </span>
              </div>

              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/70 text-left space-y-1">
                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
                  Transaction Count
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-blue-700 font-heading">
                  {analytics.transactionCount !== undefined ? analytics.transactionCount.toLocaleString() : '—'}
                </span>
              </div>
            </div>

            {/* Period Data Visualization Bar Layout */}
            {analytics.periodDistribution && analytics.periodDistribution.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left">
                  Volume Trend Distribution
                </h4>
                <div className="h-36 flex items-end justify-between gap-2 p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  {analytics.periodDistribution.map((pt, idx) => {
                    const maxVal = Math.max(...analytics.periodDistribution.map((p) => p.value || 1));
                    const heightPercent = Math.max(10, Math.round((pt.value / maxVal) * 100));

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <div className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          ${pt.value}
                        </div>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full bg-[#714B67] hover:bg-[#56384E] rounded-t-md transition-all"
                        />
                        <span className="text-[10px] font-semibold text-slate-500 truncate w-full text-center">
                          {pt.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PlatformAnalyticsSection;
