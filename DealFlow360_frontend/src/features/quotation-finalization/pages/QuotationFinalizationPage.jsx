import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, History, ArrowRightLeft, FileCheck, AlertCircle, Lock } from 'lucide-react';
import { useQuotationFinalization } from '../hooks/useQuotationFinalization';
import { FinalizationStatusBanner } from '../components/FinalizationStatusBanner';
import { OrderReadinessBanner } from '../components/OrderReadinessBanner';
import { QuotationFinalizationSummary } from '../components/QuotationFinalizationSummary';
import { QuotationVersionHistory } from '../components/QuotationVersionHistory';
import { QuotationVersionComparison } from '../components/QuotationVersionComparison';
import { CommercialSnapshot } from '../components/CommercialSnapshot';

export const QuotationFinalizationPage = () => {
  const { quotationId } = useParams();
  const navigate = useNavigate();

  const {
    quotation,
    snapshot,
    versions,
    orderReadiness,
    loading,
    finalizing,
    error,
    comparison,
    comparing,
    compareVersions,
    finalizeQuotation,
    refetch,
  } = useQuotationFinalization(quotationId);

  const [activeTab, setActiveTab] = useState('snapshot'); // 'snapshot' | 'history' | 'compare'
  const [selectedVersionsForCompare, setSelectedVersionsForCompare] = useState([]);

  const handleSelectForCompare = (versionNum) => {
    let next = [...selectedVersionsForCompare];
    if (next.includes(versionNum)) {
      next = next.filter((v) => v !== versionNum);
    } else {
      if (next.length >= 2) next.shift();
      next.push(versionNum);
    }
    setSelectedVersionsForCompare(next);

    if (next.length === 2) {
      setActiveTab('compare');
      compareVersions(next[0], next[1]);
    }
  };

  const handleConfirmFinalization = async () => {
    try {
      await finalizeQuotation();
    } catch (err) {
      // Handled by hook
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <div className="h-6 w-44 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
        <div className="h-44 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
        <div className="h-64 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (error || !quotation) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Quotation Finalization Unavailable
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {error || 'The requested quotation finalization record was not found.'}
        </p>
        <button
          onClick={() => navigate('/m-entry-z7829a/workspace/quotations')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl font-semibold text-xs shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Company Quotations</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-5">
        <div className="space-y-1">
          <Link
            to={`/m-entry-z7829a/workspace/quotations/${quotationId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Quotation Proposal Detail</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span>Commercial Finalization & Order Readiness</span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300">
              Phase 10.6
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Immutable commercial record, version history, and order-ready snapshot boundary.
          </p>
        </div>

        {/* Finalize Action Button if accepted */}
        {quotation.status === 'ACCEPTED' && (
          <button
            onClick={handleConfirmFinalization}
            disabled={finalizing}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{finalizing ? 'Finalizing Record...' : 'Finalize & Lock Commercial Closure'}</span>
          </button>
        )}
      </div>

      {/* Main Status & Order Readiness Banners */}
      <FinalizationStatusBanner quotation={quotation} snapshot={snapshot} />

      <OrderReadinessBanner orderReadiness={orderReadiness} />

      {/* Commercial Overview Summary */}
      <QuotationFinalizationSummary quotation={quotation} snapshot={snapshot} />

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40">
          <button
            onClick={() => setActiveTab('snapshot')}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition ${
              activeTab === 'snapshot'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-800'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Accepted Commercial Snapshot</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition ${
              activeTab === 'compare'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-800'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Version Comparison Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition ${
              activeTab === 'history'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-800'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Version Audit History ({versions.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          {activeTab === 'snapshot' && <CommercialSnapshot snapshot={snapshot || quotation} />}

          {activeTab === 'compare' && (
            <QuotationVersionComparison
              versions={versions}
              onCompare={compareVersions}
              comparisonData={comparison}
              loading={comparing}
            />
          )}

          {activeTab === 'history' && (
            <QuotationVersionHistory
              versions={versions}
              onSelectCompare={handleSelectForCompare}
              selectedForCompare={selectedVersionsForCompare}
            />
          )}
        </div>
      </div>
    </div>
  );
};
