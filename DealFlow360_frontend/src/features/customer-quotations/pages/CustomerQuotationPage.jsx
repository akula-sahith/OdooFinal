import React from 'react';
import { FileText, Plus, ShieldCheck } from 'lucide-react';
import { useCustomerQuotations } from '../hooks/useCustomerQuotations';
import { CustomerQuotationFilters } from '../components/CustomerQuotationFilters';
import { CustomerQuotationTable } from '../components/CustomerQuotationTable';

export const CustomerQuotationPage = () => {
  const {
    quotations,
    meta,
    loading,
    error,
    filters,
    updateFilters,
    setPage,
    refetch,
  } = useCustomerQuotations();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticated Customer Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Commercial Quotations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review, negotiate, accept, or decline commercial proposals issued to your organization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl shadow-2xs transition"
          >
            Refresh List
          </button>
        </div>
      </div>

      {/* Error state alert */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      {/* Filters Bar */}
      <CustomerQuotationFilters
        filters={filters}
        onFilterChange={updateFilters}
        onReset={() => updateFilters({ search: '', status: 'ALL', page: 1 })}
        loading={loading}
      />

      {/* Table Listing */}
      <CustomerQuotationTable quotations={quotations} loading={loading} />

      {/* Pagination Footer */}
      {!loading && meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700 text-xs">
          <span className="text-slate-500">
            Showing Page <strong className="text-slate-800 dark:text-slate-200">{meta.page}</strong> of{' '}
            <strong className="text-slate-800 dark:text-slate-200">{meta.totalPages}</strong> ({meta.total} total proposals)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(meta.page - 1)}
              disabled={meta.page <= 1}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40 font-semibold text-slate-700 dark:text-slate-200"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40 font-semibold text-slate-700 dark:text-slate-200"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
