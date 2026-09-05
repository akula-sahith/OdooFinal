import React from 'react';
import { FileSpreadsheet, ShieldCheck, Tag, Sliders, Warehouse, Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/feedback/Skeleton';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ErrorState } from '../../../components/feedback/ErrorState';

/**
 * Configuration & System Audit Trail Section
 */
export const ConfigurationAuditSection = ({
  auditLogs = [], // [{ id: '1', event: 'Discount Tier Modified', category: 'Pricing', actor: 'Admin', timestamp: '10m ago' }]
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
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="bordered" className="border-rose-200">
        <CardContent>
          <ErrorState
            title="Unable to load configuration audit log"
            message={error}
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    );
  }

  const categoryBadgeMap = {
    Pricing: 'plum',
    ApprovalChain: 'warning',
    Warehouse: 'success',
    Products: 'neutral',
    Security: 'error',
  };

  const categoryIconMap = {
    Pricing: <Tag className="w-4 h-4 text-[#714B67]" />,
    ApprovalChain: <ShieldCheck className="w-4 h-4 text-amber-600" />,
    Warehouse: <Warehouse className="w-4 h-4 text-emerald-600" />,
    Products: <Sliders className="w-4 h-4 text-slate-600" />,
    Security: <Lock className="w-4 h-4 text-rose-600" />,
  };

  return (
    <Card variant="standard">
      <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-slate-700" />
            <CardTitle>Configuration Audit Trail</CardTitle>
          </div>
          <CardDescription>
            Immutable log of platform rules, tiering, and security updates.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        {auditLogs.length === 0 ? (
          <EmptyState
            icon={FileSpreadsheet}
            title="No configuration changes"
            description="Audit events will appear here whenever platform governance rules are modified."
          />
        ) : (
          <div className="space-y-3">
            {auditLogs.map((item) => {
              const badgeVariant = categoryBadgeMap[item.category] || 'neutral';
              const icon = categoryIconMap[item.category] || categoryIconMap.Pricing;

              return (
                <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-start gap-3 text-left">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                    {icon}
                  </div>
                  <div className="grow space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 font-heading">
                        {item.event}
                      </h4>
                      <Badge variant={badgeVariant} size="sm">
                        {item.category || 'System'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                      <span>By {item.actor || 'Admin'}</span>
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

export default ConfigurationAuditSection;
