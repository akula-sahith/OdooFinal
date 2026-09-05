import React from 'react';

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-slate-200 rounded w-24" />
              <div className="w-8 h-8 rounded-xl bg-slate-100" />
            </div>
            <div className="h-8 bg-slate-200 rounded w-32" />
            <div className="h-3 bg-slate-100 rounded w-20" />
          </div>
        ))}
      </div>

      {/* Main Graph & Action Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="h-5 bg-slate-200 rounded w-48" />
          <div className="h-64 bg-slate-50 rounded-xl" />
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="h-5 bg-slate-200 rounded w-36" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-12 bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-200" />
                <div className="h-3 bg-slate-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
