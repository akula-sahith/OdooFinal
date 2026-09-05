import React from 'react';
import { TableSkeleton } from './TableSkeleton';

export const PageSkeleton = ({ type = 'table' }) => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2 pb-4 border-b border-slate-200">
        <div className="h-6 bg-slate-200 rounded w-48" />
        <div className="h-4 bg-slate-100 rounded w-80" />
      </div>

      {type === 'table' ? (
        <TableSkeleton rows={5} columns={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((k) => (
            <div key={k} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
              <div className="h-5 bg-slate-200 rounded w-36" />
              <div className="h-24 bg-slate-50 rounded-xl" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
