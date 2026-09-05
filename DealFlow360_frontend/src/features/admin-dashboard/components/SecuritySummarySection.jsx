import React from 'react';
import { ShieldCheck, ShieldAlert, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/feedback/Skeleton';
import { ErrorState } from '../../../components/feedback/ErrorState';

/**
 * Security Summary Operational Section
 * High-level security status indicator without exposing sensitive authentication tokens or secrets.
 */
export const SecuritySummarySection = ({
  securitySummary = null, // { failedLoginsCount: 0, suspiciousEventsCount: 0, activeAlertsCount: 0, systemSecurityStatus: 'normal' }
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
        <CardContent className="space-y-2">
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="bordered" className="border-rose-200">
        <CardContent>
          <ErrorState
            title="Unable to load security summary"
            message={error}
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    );
  }

  const isWarning = securitySummary?.systemSecurityStatus === 'warning' || (securitySummary?.activeAlertsCount || 0) > 0;
  const isCritical = securitySummary?.systemSecurityStatus === 'critical';

  return (
    <Card variant="standard" className={isCritical ? 'border-rose-300 bg-rose-50/20' : ''}>
      <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            {isWarning || isCritical ? (
              <ShieldAlert className="w-5 h-5 text-rose-600" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            )}
            <CardTitle>Security Status</CardTitle>
          </div>
          <CardDescription>
            System security state and authentication clearance overview.
          </CardDescription>
        </div>

        <Badge
          variant={isCritical ? 'error' : isWarning ? 'warning' : 'success'}
          size="md"
        >
          {isCritical ? 'Critical Review' : isWarning ? 'Attention Required' : 'System Secure'}
        </Badge>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4 text-left">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Failed Logins
            </span>
            <span className="text-lg font-bold text-slate-900 font-heading">
              {securitySummary?.failedLoginsCount !== undefined ? securitySummary.failedLoginsCount : 0}
            </span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Active Alerts
            </span>
            <span className="text-lg font-bold text-slate-900 font-heading">
              {securitySummary?.activeAlertsCount !== undefined ? securitySummary.activeAlertsCount : 0}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>RBAC Matrix & Session Encryption Active</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            trailingIcon={ArrowRight}
            onClick={() => navigate('/company/security')}
          >
            View Security
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySummarySection;
