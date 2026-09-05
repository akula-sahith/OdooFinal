import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/feedback/Skeleton';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ErrorState } from '../../../components/feedback/ErrorState';

/**
 * Needs Your Attention Operational Section
 * Primary visual priority item on the Admin Dashboard.
 */
export const AttentionSection = ({
  items = [],
  isLoading = false,
  error = null,
  onRetry,
}) => {
  if (isLoading) {
    return (
      <Card variant="standard" className="border-amber-200/80 bg-white">
        <CardHeader>
          <Skeleton variant="text" width="200px" />
          <Skeleton variant="text" width="300px" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton variant="rectangle" height="64px" />
          <Skeleton variant="rectangle" height="64px" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="bordered" className="border-rose-200">
        <CardContent>
          <ErrorState
            title="Unable to load attention items"
            message={error}
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    );
  }

  const severityBadgeMap = {
    high: { variant: 'error', label: 'High Severity' },
    medium: { variant: 'warning', label: 'Action Required' },
    low: { variant: 'info', label: 'Notice' },
  };

  return (
    <Card variant="standard" className="border-amber-200/80 bg-amber-50/20">
      <CardHeader className="bg-amber-50/40 border-b border-amber-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <AlertTriangle className="w-5 h-5 shrink-0" />
            </div>
            <div>
              <CardTitle className="text-amber-950">Needs Your Attention</CardTitle>
              <CardDescription className="text-amber-800/80">
                Actionable operational items requiring executive approval or resolution.
              </CardDescription>
            </div>
          </div>
          {items.length > 0 && (
            <Badge variant="warning" size="md">
              {items.length} Action{items.length > 1 ? 's' : ''} Pending
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        {items.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="Nothing requires your attention"
            description="All operational workflows, approvals, and security items are currently up to date."
          />
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const badgeDef = severityBadgeMap[item.severity] || severityBadgeMap.medium;

              return (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-[#714B67]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <Badge variant={badgeDef.variant} size="sm">
                        {badgeDef.label}
                      </Badge>
                      {item.timestamp && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          {item.timestamp}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 font-heading">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {item.destination && (
                    <div className="shrink-0 pt-2 sm:pt-0">
                      <Link to={item.destination}>
                        <Button variant="primary" size="sm" trailingIcon={ArrowRight}>
                          {item.actionText || 'Review Item'}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttentionSection;
