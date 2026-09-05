import React from 'react';

export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 overflow-hidden animate-pulse shadow-2xs">
      {/* Table Header Skeleton */}
      <div className="bg-slate-50/80 px-6 py-3.5 border-b border-slate-200 grid grid-cols-12 gap-4">
        {Array.from({ length: columns }).map((_, idx) => (
          <div key={idx} className="col-span-3 h-4 bg-slate-200 rounded w-3/4" />
        ))}
      </div>

      {/* Rows Skeleton */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="px-6 py-4 grid grid-cols-12 gap-4 items-center">
            {Array.from({ length: columns }).map((_, cIdx) => (
              <div key={cIdx} className="col-span-3 h-4 bg-slate-100 rounded w-5/6" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
