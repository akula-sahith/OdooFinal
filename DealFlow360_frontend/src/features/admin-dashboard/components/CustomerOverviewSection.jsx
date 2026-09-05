import React from 'react';
import { Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/feedback/Skeleton';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ErrorState } from '../../../components/feedback/ErrorState';

/**
 * Compact Customer Overview Operational Section
 */
export const CustomerOverviewSection = ({
  customerData = null, // { total: 0, new: 0, active: 0, pendingVerification: 0 }
  isLoading = false,
  error = null,
  onRetry,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card variant="standard">
        <CardHeader>
          <Skeleton variant="text" width="160px" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} variant="rectangle" height="60px" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="bordered" className="border-rose-200">
        <CardContent>
          <ErrorState
            title="Unable to load customer overview"
            message={error}
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    );
  }

  const items = [
    { label: 'Total Accounts', key: 'total', color: 'text-slate-900' },
    { label: 'New This Month', key: 'new', color: 'text-blue-700' },
    { label: 'Active Trading', key: 'active', color: 'text-emerald-700' },
    { label: 'Pending Verification', key: 'pendingVerification', color: 'text-amber-800' },
  ];

  const hasData = customerData && Object.values(customerData).some((v) => v !== undefined && v !== null);

  return (
    <Card variant="standard">
      <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <CardTitle>Customer Portfolio Summary</CardTitle>
          </div>
          <CardDescription>
            B2B client account status and onboarding directory.
          </CardDescription>
        </div>
        <button
          type="button"
          onClick={() => navigate('/company/customers')}
          className="text-xs font-bold text-[#714B67] hover:underline flex items-center gap-1 shrink-0"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        {!hasData ? (
          <EmptyState
            icon={Users}
            title="No customer accounts"
            description="Client accounts will appear here once added or onboarded via the customer portal."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {items.map((item) => {
              const val = customerData ? customerData[item.key] : undefined;
              const hasVal = val !== undefined && val !== null;

              return (
                <div key={item.key} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-left space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block truncate">
                    {item.label}
                  </span>
                  <span className={`text-xl sm:text-2xl font-extrabold font-heading block ${item.color}`}>
                    {hasVal ? val.toLocaleString() : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerOverviewSection;
