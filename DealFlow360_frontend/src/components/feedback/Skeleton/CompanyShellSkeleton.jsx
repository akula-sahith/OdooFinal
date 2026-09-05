import React from 'react';

export const CompanyShellSkeleton = () => {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex overflow-hidden animate-pulse">
      {/* Sidebar Skeleton */}
      <div className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white p-4 space-y-6 shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-200" />
          <div className="h-5 bg-slate-200 rounded w-32" />
        </div>

        {/* Navigation Sections */}
        <div className="space-y-6 pt-4 flex-1">
          {[1, 2, 3].map((section) => (
            <div key={section} className="space-y-2">
              <div className="h-3 bg-slate-200 rounded w-20 mb-3" />
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-3 h-10 px-3 rounded-xl bg-slate-100/70">
                  <div className="w-4 h-4 rounded bg-slate-200" />
                  <div className="h-4 bg-slate-200 rounded w-28" />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* User profile area */}
        <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-200" />
          <div className="space-y-1 flex-1">
            <div className="h-3.5 bg-slate-200 rounded w-24" />
            <div className="h-2.5 bg-slate-200 rounded w-16" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar Skeleton */}
        <div className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
          <div className="h-5 bg-slate-200 rounded w-48" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200" />
            <div className="w-8 h-8 rounded-full bg-slate-200" />
            <div className="w-32 h-8 rounded-xl bg-slate-200" />
          </div>
        </div>

        {/* Page Header & Content Skeleton */}
        <div className="p-6 md:p-8 space-y-6 flex-1">
          <div className="space-y-2">
            <div className="h-7 bg-slate-200 rounded w-64" />
            <div className="h-4 bg-slate-200 rounded w-96" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((card) => (
              <div key={card} className="h-32 rounded-2xl bg-white border border-slate-200 p-5 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-24" />
                <div className="h-8 bg-slate-200 rounded w-36" />
              </div>
            ))}
          </div>

          <div className="h-72 rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
            <div className="h-5 bg-slate-200 rounded w-40" />
            <div className="h-48 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};
