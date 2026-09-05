import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, TrendingDown, TrendingUp, Minus, AlertCircle } from 'lucide-react';
import { validateVersionComparison } from '../validation/quotationFinalizationValidation';

export const QuotationVersionComparison = ({
  versions = [],
  onCompare,
  comparisonData,
  loading = false,
}) => {
  const [versionA, setVersionA] = useState(1);
  const [versionB, setVersionB] = useState(versions.length > 1 ? versions[0].version : 1);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    if (versions.length >= 2) {
      setVersionA(versions[versions.length - 1].version); // Oldest version
      setVersionB(versions[0].version); // Latest version
    }
  }, [versions]);

  const handleCompareClick = () => {
    const check = validateVersionComparison({ version: versionA }, { version: versionB });
    if (!check.isValid) {
      setValidationError(check.error);
      return;
    }
    setValidationError(null);
    onCompare(versionA, versionB);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-primary-500" />
            <span>Side-by-Side Version Comparison Matrix</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare commercial deltas, line item variations, discount changes, and price adjustments across quotation revisions.
          </p>
        </div>

        {/* Version Selectors */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Base:</span>
            <select
              value={versionA}
              onChange={(e) => setVersionA(Number(e.target.value))}
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-800 dark:text-slate-200"
            >
              {versions.map((v) => (
                <option key={`a_${v.version}`} value={v.version}>
                  Version {v.version}
                </option>
              ))}
            </select>
          </div>

          <span className="text-slate-400 text-xs font-bold">VS</span>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Target:</span>
            <select
              value={versionB}
              onChange={(e) => setVersionB(Number(e.target.value))}
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-800 dark:text-slate-200"
            >
              {versions.map((v) => (
                <option key={`b_${v.version}`} value={v.version}>
                  Version {v.version}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCompareClick}
            disabled={loading}
            className="px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs rounded-lg shadow-xs transition"
          >
            {loading ? 'Comparing...' : 'Compare Revisions'}
          </button>
        </div>
      </div>

      {validationError && (
        <div className="p-3 mb-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-600 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Side-by-Side Delta Comparison Grid */}
      {comparisonData ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Level Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Base Version (v{versionA}) Total
              </span>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {formatCurrency(comparisonData.versionA.grandTotal)}
              </div>
              <div className="text-xs text-slate-500">
                Discount: {comparisonData.versionA.discountPercentage || 0}%
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Target Version (v{versionB}) Total
              </span>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {formatCurrency(comparisonData.versionB.grandTotal)}
              </div>
              <div className="text-xs text-slate-500">
                Discount: {comparisonData.versionB.discountPercentage || 0}%
              </div>
            </div>

            {/* Delta Highlights Card */}
            <div
              className={`p-4 rounded-xl border space-y-1 ${
                comparisonData.delta.totalDelta < 0
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                  : comparisonData.delta.totalDelta > 0
                  ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200'
              }`}
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Net Commercial Variance
              </span>
              <div className="text-lg font-bold flex items-center gap-1.5">
                {comparisonData.delta.totalDelta < 0 ? (
                  <TrendingDown className="w-5 h-5 text-emerald-600" />
                ) : comparisonData.delta.totalDelta > 0 ? (
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                ) : (
                  <Minus className="w-5 h-5 text-slate-400" />
                )}
                <span>{formatCurrency(Math.abs(comparisonData.delta.totalDelta))}</span>
              </div>
              <p className="text-xs font-semibold">
                {comparisonData.delta.totalDelta < 0
                  ? 'Lower Price Offered to Customer'
                  : comparisonData.delta.totalDelta > 0
                  ? 'Higher Contract Value'
                  : 'No Net Value Difference'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
          <ArrowRightLeft className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select two versions above and click "Compare Revisions" to inspect commercial diffs.
          </p>
        </div>
      )}
    </div>
  );
};
