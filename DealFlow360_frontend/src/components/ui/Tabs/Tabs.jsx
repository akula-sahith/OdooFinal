import React from 'react';
import Badge from '../Badge';

/**
 * Reusable Tabs Component
 * Supports tab switching, count badges, disabled tabs, and active underline indicator.
 */
export const Tabs = ({
  tabs = [], // [{ id: 'overview', label: 'Overview', icon: Icon, count: 5, disabled: false }]
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`border-b border-slate-200 w-full ${className}`}>
      <nav className="flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              disabled={tab.disabled}
              onClick={() => onChange && onChange(tab.id)}
              className={`py-3 px-1 sm:px-2 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#714B67] disabled:opacity-50 disabled:cursor-not-allowed ${
                isActive
                  ? 'border-[#714B67] text-[#714B67]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {Icon && <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#714B67]' : 'text-slate-400'}`} />}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <Badge
                  variant={isActive ? 'plum' : 'neutral'}
                  size="sm"
                  className="px-1.5 py-0 text-[10px]"
                >
                  {tab.count}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Tabs;
