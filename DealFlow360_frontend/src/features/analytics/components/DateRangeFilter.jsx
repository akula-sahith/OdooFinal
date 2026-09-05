/**
 * DateRangeFilter Component
 * Centralized date filtering control supporting Today, This Week, This Month, This Quarter, This Year, and Custom Range.
 */

import React, { useState } from 'react';
import { Calendar, Filter, RefreshCw } from 'lucide-react';
import { DATE_RANGES, DATE_RANGE_LABELS } from '../types/analyticsTypes';

export function DateRangeFilter({
  selectedRange,
  fromDate,
  toDate,
  onRangeChange,
  onRefresh,
  loading = false,
  extraFilters = null,
}) {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [tempFrom, setTempFrom] = useState(fromDate || '');
  const [tempTo, setTempTo] = useState(toDate || '');

  const handleSelect = (key) => {
    if (key === DATE_RANGES.CUSTOM) {
      setShowCustomModal(true);
    } else {
      setShowCustomModal(false);
      onRangeChange(key);
    }
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    onRangeChange(DATE_RANGES.CUSTOM, tempFrom, tempTo);
    setShowCustomModal(false);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl mb-6 shadow-sm">
      {/* Date Range Selector Buttons */}
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="flex items-center gap-2 pr-3 text-slate-400 text-sm font-medium border-r border-slate-800">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Period:</span>
        </div>

        {Object.keys(DATE_RANGES).map((key) => {
          const isActive = selectedRange === key;
          return (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
              }`}
            >
              {DATE_RANGE_LABELS[key]}
            </button>
          );
        })}
      </div>

      {/* Extra Filters & Refresh Button */}
      <div className="flex items-center gap-3">
        {extraFilters}

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Custom Date Modal / Dropdown overlay */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full shadow-2xl">
            <h4 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              Select Custom Date Range
            </h4>

            <form onSubmit={handleApplyCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">From Date</label>
                <input
                  type="date"
                  value={tempFrom}
                  onChange={(e) => setTempFrom(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">To Date</label>
                <input
                  type="date"
                  value={tempTo}
                  onChange={(e) => setTempTo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-500 text-slate-950 rounded-lg hover:bg-emerald-400 shadow-md shadow-emerald-500/20"
                >
                  Apply Filter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateRangeFilter;
