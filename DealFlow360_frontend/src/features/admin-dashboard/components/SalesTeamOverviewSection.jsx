import React from 'react';
import { UserCheck, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/feedback/Skeleton';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ErrorState } from '../../../components/feedback/ErrorState';

/**
 * Sales Team Operational Visibility Section
 */
export const SalesTeamOverviewSection = ({
  team = [], // [{ id: '1', name: 'Marcus Vance', role: 'Salesperson', avatar: '', quotesHandled: 12, ordersCompleted: 8 }]
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
          <Skeleton variant="rectangle" height="50px" />
          <Skeleton variant="rectangle" height="50px" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="bordered" className="border-rose-200">
        <CardContent>
          <ErrorState
            title="Unable to load team activity"
            message={error}
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="standard">
      <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#714B67]" />
            <CardTitle>Sales Team Operations</CardTitle>
          </div>
          <CardDescription>
            Operational overview of assigned team members and active accounts.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        {team.length === 0 ? (
          <EmptyState
            icon={UserCheck}
            title="No sales team records"
            description="Assigned sales representatives and managers will appear here once configured."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {team.map((member) => (
              <div key={member.id} className="py-3 flex items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-3">
                  <Avatar name={member.name} src={member.avatar} size="md" status="online" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                      {member.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      {member.role || 'Sales Representative'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  {member.quotesHandled !== undefined && (
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-bold text-slate-900 block">
                        {member.quotesHandled}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Quotes</span>
                    </div>
                  )}
                  {member.ordersCompleted !== undefined && (
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-700 block">
                        {member.ordersCompleted}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Orders</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesTeamOverviewSection;
