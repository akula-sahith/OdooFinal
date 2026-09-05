import React from 'react';
import { TrendingUp, DollarSign, Percent, BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/feedback/Skeleton';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ErrorState } from '../../../components/feedback/ErrorState';

/**
 * Sales Overview Operational Section
 * Features Time Range Filtering (7d, 30d, 90d) and conversion metrics.
 */
export const SalesOverviewSection = ({
  salesData = null, // { totalQuotationValue, acceptedValue, totalOrderValue, conversionRate, periodData }
  timeRange = '30d',
  onTimeRangeChange,
  isLoading = false,
  error = null,
  onRetry,
}) => {
  const timeRangeOptions = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
  ];

  if (isLoading) {
    return (
      <Card variant="standard">
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton variant="text" width="180px" />
          <Skeleton variant="text" width="120px" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Skeleton variant="rectangle" height="60px" />
            <Skeleton variant="rectangle" height="60px" />
            <Skeleton variant="rectangle" height="60px" />
            <Skeleton variant="rectangle" height="60px" />
          </div>
          <Skeleton variant="rectangle" height="180px" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="bordered" className="border-rose-200">
        <CardContent>
          <ErrorState
            title="Unable to load sales overview"
            message={error}
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    );
  }

  const hasData = salesData && (
    salesData.totalQuotationValue !== undefined ||
    salesData.acceptedValue !== undefined ||
    salesData.totalOrderValue !== undefined ||
    (salesData.periodData && salesData.periodData.length > 0)
  );

  return (
    <Card variant="standard">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#714B67]" />
            <CardTitle>Sales & Conversion Overview</CardTitle>
          </div>
          <CardDescription>
            Performance metrics across quotations and confirmed orders.
          </CardDescription>
        </div>

        {/* Time Range Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
          {timeRangeOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onTimeRangeChange && onTimeRangeChange(opt.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                timeRange === opt.id
                  ? 'bg-[#714B67] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-5">
        {!hasData ? (
          <EmptyState
            icon={BarChart3}
            title="No sales activity reported"
            description={`No quotation or order transactions recorded for the selected ${timeRange} period.`}
          />
        ) : (
          <>
            {/* Metric Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-left space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Total Quoted Value
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading">
                  {salesData.totalQuotationValue !== undefined ? `$${salesData.totalQuotationValue.toLocaleString()}` : '—'}
                </span>
              </div>

              <div className="p-4 bg-[#F7F2F5]/60 rounded-xl border border-[#714B67]/20 text-left space-y-1">
                <span className="text-[11px] font-bold text-[#714B67] uppercase tracking-wider block">
                  Accepted Quotes
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-[#714B67] font-heading">
                  {salesData.acceptedValue !== undefined ? `$${salesData.acceptedValue.toLocaleString()}` : '—'}
                </span>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/70 text-left space-y-1">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Confirmed Orders
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-emerald-700 font-heading">
                  {salesData.totalOrderValue !== undefined ? `$${salesData.totalOrderValue.toLocaleString()}` : '—'}
                </span>
              </div>

              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/70 text-left space-y-1">
                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
                  Conversion Rate
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-blue-700 font-heading">
                  {salesData.conversionRate !== undefined ? `${salesData.conversionRate}%` : '—'}
                </span>
              </div>
            </div>

            {/* Period Bar Graph Representation (Data Driven) */}
            {salesData.periodData && salesData.periodData.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left">
                  Period Activity Distribution
                </h4>
                <div className="h-40 flex items-end justify-between gap-2 p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  {salesData.periodData.map((pt, idx) => {
                    const maxValue = Math.max(...salesData.periodData.map((p) => p.value || 1));
                    const heightPercent = Math.max(10, Math.round((pt.value / maxValue) * 100));

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

export default SalesOverviewSection;
