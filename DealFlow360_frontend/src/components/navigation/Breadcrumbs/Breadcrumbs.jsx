import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { getRouteMetadata } from '../../../app/config/routeMetadata';

export const Breadcrumbs = () => {
  const location = useLocation();
  const metadata = getRouteMetadata(location.pathname);
  const items = metadata?.breadcrumb || [{ label: 'Company', path: '/company/dashboard' }];

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
      <Link
        to="/company/dashboard"
        className="inline-flex items-center gap-1 text-slate-500 hover:text-[#714B67] transition-colors"
        aria-label="Home Dashboard"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {isLast || !item.path ? (
              <span className="font-bold text-slate-900 truncate max-w-[200px]" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-slate-900 transition-colors truncate max-w-[150px]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
