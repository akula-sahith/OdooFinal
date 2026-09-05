import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Reusable PageHeader Component
 * Provides a uniform header structure across all DealFlow360 page views.
 */
export const PageHeader = ({
  breadcrumbs = [], // [{ label: 'Dashboard', href: '/company/dashboard' }]
  title,
  description,
  subtitle,
  actions,
  action,
  badge,
  className = '',
}) => {
  const headerDescription = description || subtitle;
  const headerActions = actions || action;
  return (
    <div className={`space-y-2 mb-6 text-left ${className}`}>
      {/* Breadcrumb Navigation */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium select-none mb-1">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.label || index}>
                {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                {crumb.href && !isLast ? (
                  <Link to={crumb.href} className="hover:text-[#714B67] transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={isLast ? 'text-slate-800 font-semibold' : ''}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* Main Title & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-heading">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {headerDescription && (
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-3xl">
              {headerDescription}
            </p>
          )}
        </div>

        {headerActions && (
          <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0">
            {headerActions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
