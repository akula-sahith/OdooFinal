import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { useCustomerQuotation } from '../hooks/useCustomerQuotation';
import { useQuotationNegotiation } from '../hooks/useQuotationNegotiation';
import { QuotationStatusBanner } from '../components/QuotationStatusBanner';
import { QuotationVersionSelector } from '../components/QuotationVersionSelector';
import { QuotationActionPanel } from '../components/QuotationActionPanel';
import { QuotationProductTable } from '../components/QuotationProductTable';
import { CustomerQuotationTimeline } from '../components/CustomerQuotationTimeline';
import { NegotiationThread } from '../components/NegotiationThread';
import { NegotiationMessageInput } from '../components/NegotiationMessageInput';
import { AcceptQuotationModal } from '../components/AcceptQuotationModal';
import { RejectQuotationModal } from '../components/RejectQuotationModal';
import { RequestChangesModal } from '../components/RequestChangesModal';

export const CustomerQuotationDetailPage = () => {
  const { quotationId } = useParams();
  const navigate = useNavigate();

  const {
    quotation,
    versions,
    selectedVersion,
    loading,
    submitting,
    error,
    actionError,
    isActionable,
    selectVersion,
    acceptQuotation,
    rejectQuotation,
    requestChanges,
    refetch,
  } = useCustomerQuotation(quotationId);

  const {
    messages,
    loading: threadLoading,
    sending: messageSending,
    sendMessage,
  } = useQuotationNegotiation(quotationId, quotation?.version);

  const [activeTab, setActiveTab] = useState('negotiation'); // 'negotiation' | 'terms'
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const handleConfirmAccept = async () => {
    try {
      await acceptQuotation();
      setShowAcceptModal(false);
    } catch (err) {
      // Handled by hook
    }
  };

  const handleConfirmReject = async (reason) => {
    try {
      await rejectQuotation(reason);
      setShowRejectModal(false);
    } catch (err) {
      // Handled by hook
    }
  };

  const handleConfirmRequestChanges = async (data) => {
    try {
      await requestChanges(data);
      setShowRequestModal(false);
    } catch (err) {
      // Handled by hook
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 md:space-y-8">
        <div className="h-6 w-36 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
        <div className="h-40 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
        <div className="h-64 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (error || !quotation) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Quotation Unavailable
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {error || 'The requested commercial quotation was not found or you do not have permission to view it.'}
        </p>
        <Link
          to="/customer/quotations"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl font-semibold text-xs shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Quotations</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn">
      {/* Top Breadcrumbs & Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/customer/quotations"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customer Quotations</span>
        </Link>

        {/* Version Selector */}
        <QuotationVersionSelector
          versions={versions}
          selectedVersion={selectedVersion}
          onSelectVersion={selectVersion}
        />
      </div>

      {/* Concurrency Action Error Banner */}
      {actionError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center justify-between gap-3 text-xs text-rose-700 dark:text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{actionError}</span>
          </div>
          <button
            onClick={() => refetch()}
            className="px-3 py-1 bg-rose-100 dark:bg-rose-900/50 hover:bg-rose-200 font-semibold text-[11px] rounded-lg transition"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Main Status & Executive Info Banner */}
      <QuotationStatusBanner quotation={quotation} />

      {/* Action Bar (Accept, Reject, Request Changes) */}
      <QuotationActionPanel
        quotation={quotation}
        isActionable={isActionable}
        submitting={submitting}
        onOpenAccept={() => setShowAcceptModal(true)}
        onOpenReject={() => setShowRejectModal(true)}
        onOpenRequestChanges={() => setShowRequestModal(true)}
      />

      {/* Products & Line Pricing Table */}
      <QuotationProductTable quotation={quotation} />

      {/* Bottom Grid: Timeline + Negotiation / Terms Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Customer Lifecycle Timeline */}
        <div className="lg:col-span-1">
          <CustomerQuotationTimeline quotation={quotation} />
        </div>

        {/* Right: Negotiation Thread & Commercial Terms Tabs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {/* Tab Header */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40">
              <button
                onClick={() => setActiveTab('negotiation')}
                className={`px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition ${
                  activeTab === 'negotiation'
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Negotiation & Communications</span>
                {messages.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-700 rounded-full font-mono">
                    {messages.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('terms')}
                className={`px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition ${
                  activeTab === 'terms'
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Terms & Description</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6">
              {activeTab === 'negotiation' ? (
                <div>
                  <NegotiationThread messages={messages} loading={threadLoading} />
                  <NegotiationMessageInput
                    onSendMessage={sendMessage}
                    sending={messageSending}
                    disabled={quotation.status === 'ACCEPTED' || quotation.status === 'REJECTED' || quotation.status === 'EXPIRED'}
                  />
                </div>
              ) : (
                <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
                      Proposal Description & Notes
                    </h4>
                    <p className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 leading-relaxed">
                      {quotation.description || 'No additional commercial notes specified.'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
                      Standard B2B Commercial Terms
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400 leading-relaxed">
                      <li>Prices are valid through {quotation.validUntil}.</li>
                      <li>Payment terms: Net 30 days upon formal invoice issuance.</li>
                      <li>Standard manufacturer warranty applicable to hardware items.</li>
                      <li>Freight & Logistics estimated based on standard dispatch location.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Modals */}
      <AcceptQuotationModal
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        onConfirm={handleConfirmAccept}
        quotation={quotation}
        submitting={submitting}
        error={actionError}
      />

      <RejectQuotationModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleConfirmReject}
        quotation={quotation}
        submitting={submitting}
        error={actionError}
      />

      <RequestChangesModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onConfirm={handleConfirmRequestChanges}
        quotation={quotation}
        submitting={submitting}
        error={actionError}
      />
    </div>
  );
};
