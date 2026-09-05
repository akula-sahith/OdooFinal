import React, { useState, useEffect } from 'react';
import {
  FileText,
  Building2,
  Tag,
  Package,
  Calendar,
  AlertCircle,
  Save,
  Phone,
  Mail,
  Clock,
  Percent,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card/Card';
import { Input } from '../../../components/ui/Input/Input';
import { Textarea } from '../../../components/ui/Textarea/Textarea';
import { Button } from '../../../components/ui/Button/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { formatCurrency } from '../../../constants/currency';
import { PriceListSelector } from './PriceListSelector';
import { QuotationProductSelector } from './QuotationProductSelector';
import { QuotationItemTable } from './QuotationItemTable';
import { DiscountInput } from './DiscountInput';
import { DiscountBreakdown } from './DiscountBreakdown';
import { useQuotationPricing } from '../hooks/useQuotationPricing';
import { useQuotationItems } from '../hooks/useQuotationItems';
import { useDiscountGovernance } from '../hooks/useDiscountGovernance';
import {
  calculateLineSubtotal,
  calculateLineDiscountAmount,
  calculateNetLineAmount,
  calculateSubtotal,
  calculateDiscountTotal,
  calculateNetSubtotal,
  calculateGrandTotal,
  calculateEffectiveDiscountPercentage,
} from '../utils/quotationCalculations';

/**
 * QuotationForm Component
 * Complete Quotation Builder Form with integrated Discount Tier Governance and Risk Evaluation.
 */
export const QuotationForm = ({
  initialValues = {},
  selectedRequest = null,
  eligiblePriceLists = [],
  onSubmit,
  isSubmitting = false,
  submitError = null,
}) => {
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [validFrom, setValidFrom] = useState(
    initialValues.validFrom || new Date().toISOString().split('T')[0]
  );
  const [validUntil, setValidUntil] = useState(
    initialValues.validUntil ||
      new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );

  const [formError, setFormError] = useState('');

  // Pricing & Price List Hook
  const {
    priceListId,
    currency,
    selectPriceList,
    revalidateLineItems,
  } = useQuotationPricing(
    initialValues.priceListId || (eligiblePriceLists[0]?.id || 'PL-001'),
    initialValues.currency || 'INR'
  );

  // Line Items Hook
  const {
    items,
    setItems,
    addItem,
    updateQuantity,
    removeItem,
    subtotal,
  } = useQuotationItems(initialValues.items || []);

  // Header-level discount input percentage
  const [requestedDiscountPercentage, setRequestedDiscountPercentage] = useState(
    initialValues.discountPercentage || 0
  );

  // Discount Governance Hook
  const { governanceResult, loading: govLoading } = useDiscountGovernance(
    requestedDiscountPercentage,
    subtotal,
    'Salesperson',
    'SP-014'
  );

  // Price List Change handler with item revalidation
  const handlePriceListChange = async (newPriceListId) => {
    selectPriceList(newPriceListId);
    if (items.length > 0) {
      const revalidated = await revalidateLineItems(items);
      setItems(revalidated);
    }
  };

  const handleAddProduct = (product, quantity) => {
    return addItem(product, quantity);
  };

  const handleUpdateItem = (productId, newQty, newDiscountPct) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId || item.quotationItemId === productId) {
          const qty = Number(newQty);
          const discPct = Number(newDiscountPct || 0);
          const lineSubtotal = calculateLineSubtotal(qty, item.unitBasePrice);
          const lineDiscount = calculateLineDiscountAmount(lineSubtotal, discPct);
          const netLine = calculateNetLineAmount(lineSubtotal, lineDiscount);

          return {
            ...item,
            quantity: qty,
            requestedDiscountPercentage: discPct,
            discountAmount: lineDiscount,
            lineSubtotal,
            netLineAmount: netLine,
            lineTotal: netLine,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId) => {
    removeItem(productId);
  };

  // Recalculate line-item discount amounts if header discount percentage changes
  const handleHeaderDiscountChange = (newPct) => {
    setRequestedDiscountPercentage(newPct);
    setItems((prev) =>
      prev.map((item) => {
        const lineSub = item.lineSubtotal || calculateLineSubtotal(item.quantity, item.unitBasePrice);
        const lineDisc = calculateLineDiscountAmount(lineSub, newPct);
        const netLine = calculateNetLineAmount(lineSub, lineDisc);
        return {
          ...item,
          requestedDiscountPercentage: newPct,
          discountAmount: lineDisc,
          netLineAmount: netLine,
          lineTotal: netLine,
        };
      })
    );
  };

  // Calculated totals
  const currentSubtotal = calculateSubtotal(items);
  const currentDiscountTotal = calculateDiscountTotal(items);
  const effectiveDiscountPct = calculateEffectiveDiscountPercentage(currentSubtotal, currentDiscountTotal);
  const netSubtotal = calculateNetSubtotal(currentSubtotal, currentDiscountTotal);
  const grandTotal = calculateGrandTotal(currentSubtotal, currentDiscountTotal, 0);

  const handleSubmitDraft = (e, submitForApproval = false) => {
    e.preventDefault();
    setFormError('');

    if (!selectedRequest && !initialValues.requestId) {
      setFormError('A confirmed Customer Request must be selected.');
      return;
    }

    if (!priceListId) {
      setFormError('Please select a Price List for base pricing authority.');
      return;
    }

    if (!items || items.length === 0) {
      setFormError('At least one product line item is required to build a proposal.');
      return;
    }

    if (!title.trim()) {
      setFormError('Quotation title is required.');
      return;
    }

    if (new Date(validUntil) <= new Date(validFrom)) {
      setFormError('Valid Until date must be after Valid From date.');
      return;
    }

    const payload = {
      ...initialValues,
      requestId: selectedRequest?.id || selectedRequest?.requestId || initialValues.requestId,
      requestTitle: selectedRequest?.title || initialValues.requestTitle,
      customerId: selectedRequest?.customerId || initialValues.customerId,
      customerName: selectedRequest?.customerName || initialValues.customerName,
      companyName: selectedRequest?.companyName || initialValues.companyName,
      customerEmail: selectedRequest?.customerEmail || initialValues.customerEmail,
      priceListId,
      currency,
      title: title.trim(),
      description: description.trim(),
      validFrom,
      validUntil,
      items,
      subtotal: currentSubtotal,
      discountTotal: currentDiscountTotal,
      discountPercentage: effectiveDiscountPct || requestedDiscountPercentage,
      discountStatus: governanceResult?.governanceDecision || 'WITHIN_AUTHORITY',
      discountAuthority: governanceResult?.applicableTier?.approvalRole || 'Salesperson',
      approvalRequired: governanceResult?.approvalRequired || false,
      approvalLevel: governanceResult?.approvalLevel || 'NONE',
      riskLevel: governanceResult?.riskLevel || 'NORMAL',
      taxTotal: 0,
      grandTotal,
      submitForApproval,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmitDraft} className="space-y-6 text-left">
      {(formError || submitError) && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold text-rose-800">Form Validation Error</h5>
            <p>{formError || submitError}</p>
          </div>
        </div>
      )}

      {/* SECTION A & B: Request & Customer Read-Only Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section A: Request Information */}
        <Card className="p-5 border border-slate-200 bg-white shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-50 text-[#714B67]">
                <FileText size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Section A: Request Information</h3>
                <p className="text-xs text-slate-500">Source commercial requirement</p>
              </div>
            </div>
            {selectedRequest?.status && (
              <StatusBadge status={selectedRequest.status} size="sm" />
            )}
          </div>

          <div className="text-xs space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span className="font-medium text-slate-500">Request Number:</span>
              <span className="font-mono font-bold text-slate-900">
                {selectedRequest?.requestId || selectedRequest?.id || initialValues.requestId || 'REQ-10025'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-500">Created Date:</span>
              <span className="text-slate-800">{selectedRequest?.createdAt ? new Date(selectedRequest.createdAt).toLocaleDateString() : '2026-09-01'}</span>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-700 block mb-1">Confirmed Requirements:</span>
              <p className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-700 text-[11px] leading-relaxed">
                {selectedRequest?.requirements || selectedRequest?.description || 'Confirmed B2B requirements.'}
              </p>
            </div>
          </div>
        </Card>

        {/* Section B: Customer Information */}
        <Card className="p-5 border border-slate-200 bg-white shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Building2 size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Section B: Customer Details</h3>
              <p className="text-xs text-slate-500">Read-only Customer Master reference</p>
            </div>
          </div>

          <div className="text-xs space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span className="font-medium text-slate-500">Company Name:</span>
              <span className="font-bold text-slate-900">
                {selectedRequest?.companyName || selectedRequest?.customerName || initialValues.companyName || 'Acme Corporation'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-500 flex items-center gap-1">
                <Mail size={12} className="text-slate-400" /> Email:
              </span>
              <span className="text-slate-800 font-mono">
                {selectedRequest?.customerEmail || initialValues.customerEmail || 'procurement@acme.com'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-500 flex items-center gap-1">
                <Phone size={12} className="text-slate-400" /> Phone:
              </span>
              <span className="text-slate-800 font-mono">
                {selectedRequest?.customerPhone || '+1 (555) 234-5678'}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* SECTION C: Price List Selection & Currency Lock */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Section C: Pricing Authority</h4>
        <PriceListSelector
          priceLists={eligiblePriceLists}
          selectedPriceListId={priceListId}
          onSelectPriceList={handlePriceListChange}
          hasItems={items.length > 0}
          disabled={isSubmitting}
        />
      </div>

      {/* SECTION D: Product Selector & Quotation Items Table */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Section D: Quotation Product Lines</h4>
        
        <QuotationProductSelector
          priceListId={priceListId}
          currency={currency}
          onAddProduct={handleAddProduct}
          disabled={isSubmitting}
        />

        <QuotationItemTable
          items={items}
          currency={currency}
          onUpdateItem={handleUpdateItem}
          onRemoveItem={handleRemoveItem}
          readOnly={isSubmitting}
        />
      </div>

      {/* SECTION E: Commercial Discount Entry & Governance Panel */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Section E: Commercial Discount Governance</h4>
        
        <Card className="p-5 border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="max-w-md">
            <DiscountInput
              value={requestedDiscountPercentage}
              onChange={handleHeaderDiscountChange}
              maxAuthorized={governanceResult?.maximumAuthorizedDiscount || 5}
              governanceResult={governanceResult}
              disabled={isSubmitting || items.length === 0}
            />
          </div>
        </Card>

        {governanceResult && (
          <DiscountBreakdown
            governanceResult={governanceResult}
            currency={currency}
            subtotal={currentSubtotal}
          />
        )}
      </div>

      {/* SECTION F: Pricing Summary Preview */}
      <Card className="p-5 border border-slate-200 bg-slate-50/70 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Section F: Final Pricing Breakdown</h4>
          <span className="text-xs font-bold text-[#714B67] bg-purple-50 px-2.5 py-1 rounded border border-purple-200">
            Currency: {currency}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Base Subtotal:</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{formatCurrency(currentSubtotal, currency)}</span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Commercial Discount ({effectiveDiscountPct}%):</span>
            <span className="font-mono font-bold text-amber-700 text-sm">-{formatCurrency(currentDiscountTotal, currency)}</span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Net Subtotal:</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{formatCurrency(netSubtotal, currency)}</span>
          </div>

          <div className="p-3 bg-purple-50 rounded-lg border border-[#714B67]/30">
            <span className="text-[#714B67] font-semibold block">Grand Total:</span>
            <span className="font-mono font-extrabold text-[#714B67] text-base">{formatCurrency(grandTotal, currency)}</span>
          </div>
        </div>
      </Card>

      {/* SECTION G: Proposal Validity & Metadata */}
      <Card className="p-5 border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <Clock size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Section G: Proposal Validity & Terms</h3>
            <p className="text-xs text-slate-500">Proposal terms and valid date range</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quotation Title <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. Commercial Proposal for Enterprise Server Infrastructure"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className="text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Valid From <span className="text-rose-500">*</span>
            </label>
            <Input
              type="date"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
              disabled={isSubmitting}
              className="text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Valid Until <span className="text-rose-500">*</span>
            </label>
            <Input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              disabled={isSubmitting}
              className="text-xs"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Proposal Notes / Special Terms (Optional)
            </label>
            <Textarea
              rows={3}
              placeholder="Add specific delivery terms, scope constraints, or commercial terms..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="text-xs"
            />
          </div>
        </div>
      </Card>

      {/* SECTION H: Save & Submit Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <div className="text-xs text-slate-500">
          Governance Status: <strong className="font-mono text-[#714B67]">{governanceResult?.governanceDecision || 'WITHIN_AUTHORITY'}</strong>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="outline"
            disabled={isSubmitting || items.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold"
          >
            <Save size={16} />
            {isSubmitting ? 'Saving Draft...' : 'Save Draft Quotation'}
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={(e) => handleSubmitDraft(e, true)}
            disabled={isSubmitting || items.length === 0 || governanceResult?.governanceDecision === 'REJECTED_BY_POLICY'}
            className="flex items-center gap-2 px-6 py-2.5 text-xs bg-[#714B67] hover:bg-[#5a3b52] font-bold shadow-sm"
          >
            <Save size={16} />
            {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
          </Button>
        </div>
      </div>
    </form>
  );
};
