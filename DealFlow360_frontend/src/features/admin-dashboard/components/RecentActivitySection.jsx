import React from 'react';
import { Clock, FileText, ShoppingCart, UserPlus, CheckCircle, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/feedback/Skeleton';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ErrorState } from '../../../components/feedback/ErrorState';

/**
 * Recent Operational Activity Audit Feed Section
 */
export const RecentActivitySection = ({
  activities = [], // [{ id: '1', type: 'quotation_created', description: 'Quote Q-1042 created', actor: 'Marcus Vance', timestamp: '15m ago' }]
  isLoading = false,
  error = null,
  onRetry,
}) => {
  if (isLoading) {
    return (
      <Card variant="standard">
        <CardHeader>
          <Skeleton variant="text" width="160px" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="70%" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="bordered" className="border-rose-200">
        <CardContent>
          <ErrorState
            title="Unable to load recent activity"
            message={error}
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    );
  }

  const iconMap = {
    quotation: <FileText className="w-4 h-4 text-[#714B67]" />,
    order: <ShoppingCart className="w-4 h-4 text-emerald-600" />,
    customer: <UserPlus className="w-4 h-4 text-blue-600" />,
    approval: <CheckCircle className="w-4 h-4 text-amber-600" />,
    security: <ShieldCheck className="w-4 h-4 text-rose-600" />,
  };

  return (
    <Card variant="standard">
      <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-700" />
            <CardTitle>Recent Activity</CardTitle>
          </div>
          <CardDescription>
            System audit log of recent transactions and operational events.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        {activities.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No recent activity"
            description="System activity and transaction logs will be recorded here automatically."
          />
        ) : (
          <div className="space-y-3">
            {activities.map((item) => {
              const icon = iconMap[item.type] || iconMap.quotation;

              return (
                <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-start gap-3 text-left">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                    {icon}
                  </div>
                  <div className="grow space-y-0.5">
                    <p className="text-xs font-bold text-slate-900 font-heading">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                      <span>{item.actor || 'System'}</span>
                      {item.timestamp && <span>• {item.timestamp}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivitySection;
