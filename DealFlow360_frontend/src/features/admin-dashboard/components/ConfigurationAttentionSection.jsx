import React from 'react';
import { Sliders, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/feedback/Skeleton';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ErrorState } from '../../../components/feedback/ErrorState';

/**
 * Configuration Attention & Platform Health Section
 */
export const ConfigurationAttentionSection = ({
  alerts = [], // [{ id: '1', severity: 'high', title: 'Inactive Products', description: '2 products require catalog review.', destination: '/company/products' }]
  isLoading = false,
  error = null,
  onRetry,
}) => {
  if (isLoading) {
    return (
      <Card variant="standard">
        <CardHeader>
          <Skeleton variant="text" width="200px" />
          <Skeleton variant="text" width="300px" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton variant="rectangle" height="60px" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="bordered" className="border-rose-200">
        <CardContent>
          <ErrorState
            title="Unable to load configuration alerts"
            message={error}
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    );
  }

  const severityMap = {
    high: { variant: 'error', label: 'Configuration Alert' },
    medium: { variant: 'warning', label: 'Setup Warning' },
    low: { variant: 'info', label: 'Optimization' },
  };

  return (
    <Card variant="standard" className="border-amber-200/80 bg-amber-50/20">
      <CardHeader className="bg-amber-50/40 border-b border-amber-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Sliders className="w-5 h-5 shrink-0" />
            </div>
            <div>
              <CardTitle className="text-amber-950">Configuration Attention</CardTitle>
              <CardDescription className="text-amber-800/80">
                Platform rules, catalog setups, and system governance items requiring review.
              </CardDescription>
            </div>
          </div>
          {alerts.length > 0 && (
            <Badge variant="warning" size="md">
              {alerts.length} Alert{alerts.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        {alerts.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="All configurations are up to date"
            description="Platform rules, price lists, approval chains, and warehouses are operating smoothly."
          />
        ) : (
          <div className="space-y-3">
            {alerts.map((item) => {
              const sev = severityMap[item.severity] || severityMap.medium;

              return (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-[#714B67]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <Badge variant={sev.variant} size="sm">
                        {sev.label}
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
                          {item.actionText || 'Configure Rules'}
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

export default ConfigurationAttentionSection;
