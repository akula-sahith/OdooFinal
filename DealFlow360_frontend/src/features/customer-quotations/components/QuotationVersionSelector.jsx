import React from 'react';
import { History, Check, ChevronDown } from 'lucide-react';

export const QuotationVersionSelector = ({
  versions = [],
  selectedVersion,
  onSelectVersion,
}) => {
  if (!versions || versions.length <= 1) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-lg border border-slate-200 dark:border-slate-700">
        <span>Version 1 (Latest)</span>
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center gap-2">
      <History className="w-4 h-4 text-slate-400" />
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">
        Version History:
      </span>
      <div className="flex items-center gap-1.5">
        {versions.map((ver) => {
          const isSelected = ver.version === selectedVersion;
          const isCurrent = ver.isCurrent || ver.version === Math.max(...versions.map((v) => v.version));

          return (
            <button
              key={ver.version}
              onClick={() => onSelectVersion(ver.version)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition border flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-primary-600 text-white border-primary-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <span>v{ver.version}</span>
              {isCurrent ? (
                <span className={`text-[10px] px-1 rounded ${isSelected ? 'bg-primary-700 text-primary-100' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                  Current
                </span>
              ) : (
                <span className={`text-[10px] ${isSelected ? 'text-primary-200' : 'text-slate-400'}`}>
                  Superseded
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
