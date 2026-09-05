import React from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Skeleton } from '../../../components/feedback/Skeleton';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ErrorState } from '../../../components/feedback/ErrorState';

/**
 * Orders Overview Operational Section
 * Displays order fulfillment statuses and metrics.
 */
export const OrdersOverviewSection = ({
  counts = null, // { PENDING: 0, PROCESSING: 0, COMPLETED: 0, CANCELLED: 0 }
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
              <Skeleton key={idx} variant="rectangle" height="70px" />
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
            title="Unable to load orders overview"
            message={error}
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    );
  }

  const statuses = [
    { key: 'PENDING', label: 'Pending' },
    { key: 'PROCESSING', label: 'Processing' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'CANCELLED', label: 'Cancelled' },
  ];

  const hasData = counts && Object.values(counts).some((v) => v !== undefined && v !== null);

  return (
    <Card variant="standard">
      <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-600" />
            <CardTitle>Orders Overview</CardTitle>
          </div>
          <CardDescription>
            Fulfillment status across confirmed sales orders.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        {!hasData ? (
          <EmptyState
            icon={ShoppingCart}
            title="No sales orders"
            description="Confirmed orders will appear here once quotations are accepted."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statuses.map((st) => {
              const val = counts ? counts[st.key] : undefined;
              const hasVal = val !== undefined && val !== null;

              return (
                <div
                  key={st.key}
                  onClick={() => navigate(`/company/orders?status=${st.key.toLowerCase()}`)}
                  className="p-3.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all cursor-pointer group text-left space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <StatusBadge status={st.key} size="sm" showDot={false} />
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-700 transition-colors" />
                  </div>
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading block">
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

export default OrdersOverviewSection;
