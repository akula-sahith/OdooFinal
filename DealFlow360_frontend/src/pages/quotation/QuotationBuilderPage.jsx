import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { quotationApi } from '../../api/quotationApi';
import { productApi } from '../../api/productApi';
import { customerApi } from '../../api/customerApi';
import { approvalApi } from '../../api/approvalApi';
import { useAuth } from '../../context/AuthContext';
import { Layout } from '../../components/common/Layout';
import { DiscountTierBadge } from '../../components/common/DiscountTierBadge';
import {
  FileText,
  Plus,
  Trash2,
  Send,
  CheckCircle,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowLeft,
  DollarSign,
  ShieldAlert,
  ShoppingBag,
  Zap,
  Edit2,
  Percent,
  Check,
  X,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const QuotationBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quotation, setQuotation] = useState(null);
  const [lines, setLines] = useState([]);
  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Customer negotiation request state
  const [activeNegotiation, setActiveNegotiation] = useState(null);
  const [negotiationHistory, setNegotiationHistory] = useState([]);
  const [repResponseNote, setRepResponseNote] = useState('');
  const [showRepResponseModal, setShowRepResponseModal] = useState(false);

  // Add line form state
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [discountPercent, setDiscountPercent] = useState('0');
  const [customUnitPrice, setCustomUnitPrice] = useState('');
  const [addingLine, setAddingLine] = useState(false);

  // Edit line modal state
  const [editingLine, setEditingLine] = useState(null);
  const [editQty, setEditQty] = useState(1);
  const [editDiscountPercent, setEditDiscountPercent] = useState('0');
  const [editUnitPrice, setEditUnitPrice] = useState('');
  const [updatingLine, setUpdatingLine] = useState(false);

  // Approval submit modal / result state
  const [approvalResult, setApprovalResult] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const { user } = useAuth();

  const loadQuotationDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const [qRes, prodRes] = await Promise.all([
        quotationApi.getQuotationById(id),
        productApi.getAllProducts(),
      ]);

      if (qRes && qRes.quotation) {
        setQuotation(qRes.quotation);
        setLines(qRes.lines || []);

        if (qRes.quotation.customerId) {
          try {
            const custRes = await customerApi.getCustomerById(qRes.quotation.customerId);
            setCustomer(custRes.customer || custRes);
          } catch (e) {
            console.warn('Customer load error', e);
          }
        }
      }

      setProducts(Array.isArray(prodRes) ? prodRes : []);

      // Fetch recommendations
      try {
        const recs = await quotationApi.getRecommendations(id);
        setRecommendations(Array.isArray(recs) ? recs : []);
      } catch (recErr) {
        console.warn('Recommendations fetch error', recErr);
      }

      // Fetch incoming customer negotiation requests
      try {
        const reqs = await customerApi.getCustomerRequests();
        const list = Array.isArray(reqs) ? reqs : [];
        const matchedList = list.filter((r) => String(r.quotationId) === String(id));
        const matched = matchedList.find(
          (r) => r.status === 'SUBMITTED' || r.status === 'PENDING' || r.status === 'OPEN' || r.status === 'UNDER_NEGOTIATION'
        );
        setActiveNegotiation(matched || matchedList[0] || null);
        setNegotiationHistory(matchedList);
      } catch (reqErr) {
        console.warn('Customer requests fetch error', reqErr);
      }
    } catch (err) {
      setError(err.message || 'Failed to load quotation.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadQuotationDetails();
    }
  }, [id]);

  const handleAcceptCustomerCounter = async () => {
    const desc = activeNegotiation?.description || '';
    const matchDisc = desc.match(/(\d+(\.\d+)?)%/);
    const counterDiscPercent = activeNegotiation?.counterDiscountPercent || (matchDisc ? parseFloat(matchDisc[1]) : 10);

    if (!window.confirm(`Accept customer counter offer and apply ${counterDiscPercent}% discount across all quotation line items?`)) return;
    setActionLoading(true);
    try {
      for (const line of lines) {
        const base = getProductBasePrice(line.productId);
        const effectiveBase = base > 0 ? base : Number(line.unitPrice || 0);
        const discountedUnit = effectiveBase * (1 - counterDiscPercent / 100);
        await quotationApi.updateLine(id, line.id, line.quantity, discountedUnit);
      }
      if (activeNegotiation?.dbId) {
        await customerApi.respondToRequest(activeNegotiation.dbId, `Sales Rep accepted customer counter offer of ${counterDiscPercent}%.`, 'RESOLVED');
      }
      await loadQuotationDetails();
      alert(`Customer counter offer (${counterDiscPercent}%) accepted and applied! Quotation updated.`);
    } catch (err) {
      alert(err.message || 'Failed to accept customer counter offer.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendRepResponse = async (e) => {
    if (e) e.preventDefault();
    if (!repResponseNote) {
      alert('Please enter a response message.');
      return;
    }
    setActionLoading(true);
    try {
      if (activeNegotiation?.dbId) {
        await customerApi.respondToRequest(activeNegotiation.dbId, repResponseNote, 'RESOLVED');
      }
      setShowRepResponseModal(false);
      setRepResponseNote('');
      await loadQuotationDetails();
      alert('Response sent to customer successfully!');
    } catch (err) {
      alert(err.message || 'Failed to send response.');
    } finally {
      setActionLoading(false);
    }
  };

  const getProductName = (prodId) => {
    const found = products.find((p) => String(p.id || p.dbId) === String(prodId));
    return found ? found.name : `Product #${prodId}`;
  };

  const getProductBasePrice = (prodId) => {
    const found = products.find((p) => String(p.id || p.dbId) === String(prodId));
    return found ? Number(found.basePrice || found.price || 0) : 0;
  };

  // Calculate overall quotation financial summary
  const calculateFinancials = () => {
    let listSubtotal = 0;
    lines.forEach((line) => {
      const base = getProductBasePrice(line.productId);
      const qty = Number(line.quantity || 1);
      listSubtotal += (base > 0 ? base : Number(line.unitPrice || 0)) * qty;
    });

    const netSubtotal = Number(quotation?.subtotalAmount || lines.reduce((sum, l) => sum + Number(l.subtotalAmount || l.subtotal || (l.unitPrice * l.quantity) || 0), 0));
    const discountAmount = Math.max(0, listSubtotal - netSubtotal);
    const taxAmount = Number(quotation?.taxAmount || 0);
    const totalAmount = Number(quotation?.totalAmount || (netSubtotal + taxAmount));
    const overallDiscountPercent = listSubtotal > 0 ? ((discountAmount / listSubtotal) * 100).toFixed(1) : '0.0';

    return { listSubtotal, netSubtotal, discountAmount, taxAmount, totalAmount, overallDiscountPercent };
  };

  const financials = calculateFinancials();

  // Handle selecting product in form & calculating default unit price
  const handleSelectProduct = (productId) => {
    setSelectedProductId(productId);
    const base = getProductBasePrice(productId);
    if (base > 0) {
      const disc = Number(discountPercent || 0);
      const calculatedUnit = base * (1 - disc / 100);
      setCustomUnitPrice(calculatedUnit.toFixed(2));
    } else {
      setCustomUnitPrice('');
    }
  };

  // Handle changing discount % in add line form
  const handleDiscountPercentChange = (val) => {
    setDiscountPercent(val);
    const base = getProductBasePrice(selectedProductId);
    if (base > 0) {
      const disc = Number(val || 0);
      const calculatedUnit = base * (1 - disc / 100);
      setCustomUnitPrice(calculatedUnit.toFixed(2));
    }
  };

  // Handle changing unit price directly in add line form
  const handleUnitPriceChange = (val) => {
    setCustomUnitPrice(val);
    const base = getProductBasePrice(selectedProductId);
    if (base > 0) {
      const unit = Number(val || 0);
      const disc = ((base - unit) / base) * 100;
      setDiscountPercent(disc > 0 ? disc.toFixed(1) : '0');
    }
  };

  const handleAddLine = async (e, productIdParam = null) => {
    if (e) e.preventDefault();
    const prodId = productIdParam || selectedProductId;
    if (!prodId) {
      alert('Please select a product.');
      return;
    }

    setAddingLine(true);
    try {
      let finalPrice = customUnitPrice;
      if (productIdParam) {
        const base = getProductBasePrice(productIdParam);
        finalPrice = base > 0 ? base : null;
      }

      await quotationApi.addLine(id, prodId, null, quantity, finalPrice ? Number(finalPrice) : null);
      setSelectedProductId('');
      setQuantity(1);
      setDiscountPercent('0');
      setCustomUnitPrice('');
      await loadQuotationDetails();
    } catch (err) {
      alert(err.message || 'Failed to add line item.');
    } finally {
      setAddingLine(false);
    }
  };

  const handleOpenEditLine = (line) => {
    setEditingLine(line);
    setEditQty(line.quantity || 1);
    const base = getProductBasePrice(line.productId);
    const unit = Number(line.unitPrice || 0);
    setEditUnitPrice(unit.toFixed(2));
    if (base > 0 && base > unit) {
      const disc = ((base - unit) / base) * 100;
      setEditDiscountPercent(disc.toFixed(1));
    } else {
      setEditDiscountPercent('0');
    }
  };

  const handleEditDiscountChange = (val) => {
    setEditDiscountPercent(val);
    if (editingLine) {
      const base = getProductBasePrice(editingLine.productId);
      const disc = Number(val || 0);
      const calculatedUnit = base * (1 - disc / 100);
      setEditUnitPrice(calculatedUnit.toFixed(2));
    }
  };

  const handleSaveEditedLine = async () => {
    if (!editingLine) return;
    setUpdatingLine(true);
    try {
      await quotationApi.updateLine(id, editingLine.id, Number(editQty), Number(editUnitPrice));
      setEditingLine(null);
      await loadQuotationDetails();
    } catch (err) {
      alert(err.message || 'Failed to update line item.');
    } finally {
      setUpdatingLine(false);
    }
  };

  const handleDeleteLine = async (lineId) => {
    if (!window.confirm('Delete this line item?')) return;
    try {
      await quotationApi.deleteLine(id, lineId);
      await loadQuotationDetails();
    } catch (err) {
      alert(err.message || 'Failed to delete line item.');
    }
  };

  // Quick Preset Discount Applicator
  const handleApplyGlobalDiscountPreset = async (presetPercent) => {
    if (lines.length === 0) return;
    if (!window.confirm(`Apply ${presetPercent}% discount across all quotation line items?`)) return;
    setActionLoading(true);
    try {
      for (const line of lines) {
        const base = getProductBasePrice(line.productId);
        const effectiveBase = base > 0 ? base : Number(line.unitPrice || 0);
        const discountedUnit = effectiveBase * (1 - presetPercent / 100);
        await quotationApi.updateLine(id, line.id, line.quantity, discountedUnit);
      }
      await loadQuotationDetails();
    } catch (err) {
      alert(err.message || 'Preset discount application failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitForApproval = async () => {
    setActionLoading(true);
    try {
      const res = await quotationApi.submitForApproval(id);
      setApprovalResult(res);
      setShowApprovalModal(true);
      await loadQuotationDetails();
    } catch (err) {
      alert(err.message || 'Approval submission failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const isManagerOrAdmin = user?.role === 'SALES_MANAGER' || user?.role === 'ADMIN' || user?.role === 'FINANCE' || user?.email?.includes('mgr') || user?.email?.includes('admin');

  const handleManagerApproveQuotation = async () => {
    setActionLoading(true);
    setFeedback(null);
    try {
      const apps = await approvalApi.getAllApprovals().catch(() => []);
      const pendingApp = Array.isArray(apps) ? apps.find(a => String(a.quotationId) === String(id) && a.status === 'PENDING') : null;
      if (pendingApp) {
        await approvalApi.approveRecord(pendingApp.id, user?.id || 1, 'Approved directly by Manager on Quotation Page');
      } else {
        await quotationApi.updateQuotation(id, { status: 'APPROVED' });
      }
      await loadQuotationDetails();
      setFeedback({ type: 'success', message: `Quotation #${id} approved successfully by Manager!` });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to approve quotation.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleManagerRejectQuotation = async () => {
    setActionLoading(true);
    setFeedback(null);
    try {
      const apps = await approvalApi.getAllApprovals().catch(() => []);
      const pendingApp = Array.isArray(apps) ? apps.find(a => String(a.quotationId) === String(id) && a.status === 'PENDING') : null;
      if (pendingApp) {
        await approvalApi.rejectRecord(pendingApp.id, user?.id || 1, 'Rejected by Manager on Quotation Page');
      } else {
        await quotationApi.updateQuotation(id, { status: 'REJECTED' });
      }
      await loadQuotationDetails();
      setFeedback({ type: 'error', message: `Quotation #${id} rejected by Manager.` });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to reject quotation.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendToCustomer = async () => {
    if (quotation?.status === 'PENDING_APPROVAL') {
      setFeedback({ type: 'error', message: `Quotation #${id} is currently awaiting manager approval and cannot be sent to customer until approved.` });
      return;
    }
    setActionLoading(true);
    setFeedback(null);
    try {
      await quotationApi.sendToCustomer(id);
      await loadQuotationDetails();
      setFeedback({ type: 'success', message: `Quotation #${id} sent to customer successfully! Status updated to SENT.` });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Send to customer failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Calculate live margin ratio
  const calculateMarginMetrics = () => {
    const overallDisc = Number(financials.overallDiscountPercent || 0);
    let marginPercent = Math.max(5, 45 - overallDisc);

    let status = 'HEALTHY';
    let color = 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';

    if (overallDisc >= 25 || marginPercent < 15) {
      status = 'HIGH RISK (FINANCE APPROVAL NEEDED)';
      color = 'text-rose-400 bg-rose-950/40 border-rose-500/40';
    } else if (overallDisc >= 10 || marginPercent < 25) {
      status = 'MODERATE RISK (MANAGER APPROVAL NEEDED)';
      color = 'text-amber-400 bg-amber-950/40 border-amber-500/40';
    }

    return { marginPercent: marginPercent.toFixed(1), status, color };
  };

  const marginInfo = calculateMarginMetrics();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Top Header Navigation & Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-blue-100 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/quotations')}
              className="p-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-sky-600">QUOTE #{id}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-mono text-slate-700">
                  {quotation?.status || 'DRAFT'}
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {customer ? (customer.companyName || customer.name) : 'Commercial Account Quotation'}
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">

            {quotation?.status === 'PENDING_APPROVAL' ? (
              isManagerOrAdmin ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleManagerApproveQuotation}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-40"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Quotation
                  </button>
                  <button
                    onClick={handleManagerRejectQuotation}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-40"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-mono font-bold animate-pulse shadow-xs">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Awaiting Manager Approval
                </div>
              )
            ) : quotation?.status === 'APPROVED' || quotation?.status === 'CONFIRMED' ? (
              <div className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-mono font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Terms Approved ✓
              </div>
            ) : (
              <button
                onClick={handleSubmitForApproval}
                disabled={actionLoading || lines.length === 0}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all disabled:opacity-40"
              >
                <ShieldAlert className="w-4 h-4" />
                Submit Approval
              </button>
            )}

            <button
              onClick={handleSendToCustomer}
              disabled={actionLoading || lines.length === 0 || quotation?.status === 'PENDING_APPROVAL'}
              className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
              {quotation?.status === 'SENT' ? 'Re-Send to Customer' : 'Send to Customer'}
            </button>
          </div>
        </div>

        {/* Feedback Alert Banner */}
        {feedback && (
          <div className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-xs ${
            feedback.type === 'error' ? 'bg-rose-50 border border-rose-200 text-rose-800' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}>
            <div className="flex items-center gap-2">
              {feedback.type === 'error' ? <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="p-1 hover:bg-black/5 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Manager Approval Pending Alert Banner */}
        {quotation?.status === 'PENDING_APPROVAL' && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-xl border border-amber-200 text-amber-700 animate-pulse">
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              </div>
              <div>
                <span className="font-bold text-amber-900 text-sm block">Approval Request Sent to Sales Manager</span>
                <p className="text-slate-600 text-xs mt-0.5 font-sans">
                  This quotation contains moderate or high discount terms and is now in the Manager's Approval Queue for evaluation.
                </p>
              </div>
            </div>
            <Link
              to="/approvals"
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs whitespace-nowrap self-start sm:self-auto"
            >
              View Manager Board &rarr;
            </Link>
          </div>
        )}

        {/* Incoming Customer Negotiation Proposal Banner */}
        {(quotation?.status === 'UNDER_NEGOTIATION' || activeNegotiation) && (
          <div className="bg-purple-50 border border-purple-200 p-5 rounded-2xl space-y-4 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl border border-purple-200 animate-pulse">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-purple-700 uppercase">Incoming Customer Counter Proposal</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-purple-200 text-purple-800 border border-purple-300 uppercase font-semibold">
                      Action Required
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    Customer Submitted Negotiation Request for Quote #{id}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAcceptCustomerCounter}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <CheckCircle className="w-4 h-4" />
                  Accept &amp; Apply Counter Discount
                </button>

                <button
                  onClick={() => setShowRepResponseModal(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-4 h-4" />
                  Respond to Customer
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 bg-white rounded-xl border border-purple-200 shadow-xs">
                <span className="text-purple-700 font-semibold block uppercase text-[10px] mb-1">Customer Counter Discount:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-amber-600 font-extrabold text-lg">
                    {activeNegotiation?.counterDiscountPercent 
                      ? `${activeNegotiation.counterDiscountPercent}% OFF` 
                      : (activeNegotiation?.description?.match(/(\d+(\.\d+)?)%/) 
                          ? `${activeNegotiation.description.match(/(\d+(\.\d+)?)%/)[0]} OFF` 
                          : 'Custom Terms')}
                  </span>
                  <span className="text-[10px] text-purple-700 font-sans">(Requested by Customer)</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-purple-200 shadow-xs">
                <span className="text-purple-700 font-semibold block uppercase text-[10px] mb-1">Counter Financial Impact:</span>
                {(() => {
                  const matchDisc = activeNegotiation?.description?.match(/(\d+(\.\d+)?)%/);
                  const disc = activeNegotiation?.counterDiscountPercent || (matchDisc ? parseFloat(matchDisc[1]) : null);
                  if (disc != null) {
                    const counterSub = financials.listSubtotal * (1 - disc / 100);
                    const counterTotal = counterSub + financials.taxAmount;
                    const savings = Math.max(0, financials.listSubtotal - counterSub);
                    return (
                      <div>
                        <span className="text-emerald-700 font-extrabold text-base">${counterTotal.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-500 block font-sans">Save ${savings.toFixed(2)} vs list price</span>
                      </div>
                    );
                  }
                  return <span className="text-slate-600 font-sans">Pending rep review &amp; application</span>;
                })()}
              </div>

              <div className="p-3 bg-white rounded-xl border border-purple-200 shadow-xs sm:col-span-1">
                <span className="text-purple-700 font-semibold block uppercase text-[10px] mb-1">Customer Notes &amp; Comments:</span>
                <p className="text-slate-700 text-xs font-sans italic line-clamp-2">
                  "{activeNegotiation?.lineComments || activeNegotiation?.description || 'Customer submitted counter proposal terms via Portal.'}"
                </p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-400 font-mono">Loading Quotation Builder...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Cart & Product List Area (2 Columns) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Add Product Line Form with Discount Inputs */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-sky-600" />
                  Add Products &amp; Apply Line Discounts
                </h3>

                <form onSubmit={handleAddLine} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">Product</label>
                    <select
                      required
                      value={selectedProductId}
                      onChange={(e) => handleSelectProduct(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="">-- Select Product --</option>
                      {products.map((p) => (
                        <option key={p.id || p.dbId} value={p.id || p.dbId}>
                          {p.name} (${Number(p.basePrice || p.price || 0).toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">Discount %</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="90"
                      value={discountPercent}
                      onChange={(e) => handleDiscountPercentChange(e.target.value)}
                      placeholder="0%"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-amber-600 font-mono text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">Unit Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={customUnitPrice}
                      onChange={(e) => handleUnitPriceChange(e.target.value)}
                      placeholder="Price"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sky-700 font-mono text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-end">
                    <button
                      type="submit"
                      disabled={addingLine}
                      className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {addingLine ? 'Adding...' : 'Add Line'}
                    </button>
                  </div>
                </form>

                {/* Quick Preset Discount Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-amber-600" />
                    Apply Global Discount Preset:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleApplyGlobalDiscountPreset(0)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-mono font-semibold"
                    >
                      0% (List)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyGlobalDiscountPreset(5)}
                      className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-[10px] font-mono font-semibold"
                    >
                      5% (Standard)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyGlobalDiscountPreset(15)}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-mono font-semibold"
                    >
                      15% (Manager Review)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyGlobalDiscountPreset(30)}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-mono font-semibold"
                    >
                      30% (Finance Escalation)
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Lines Table */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Quotation Line Items ({lines.length})
                  </h3>
                  {/* Live Margin Indicator Pill */}
                  <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${marginInfo.color}`}>
                    <TrendingUp className="w-3.5 h-3.5" />
                    Live Margin: {marginInfo.marginPercent}% ({marginInfo.status})
                  </div>
                </div>

                {lines.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs italic">
                    No products added to quotation cart yet. Use the selector above or pick an upsell suggestion.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-100">
                        <tr>
                          <th className="py-3 px-4">Product Name</th>
                          <th className="py-3 px-4">Qty</th>
                          <th className="py-3 px-4">Base List Price</th>
                          <th className="py-3 px-4">Quoted Unit Price</th>
                          <th className="py-3 px-4">Line Subtotal</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {lines.map((line) => {
                          const base = getProductBasePrice(line.productId);
                          const unit = Number(line.unitPrice || 0);
                          const discPercent = base > 0 && base > unit ? (((base - unit) / base) * 100).toFixed(1) : '0.0';

                          return (
                            <tr key={line.id} className="hover:bg-slate-50/60">
                              <td className="py-3 px-4 font-semibold text-slate-900">
                                {getProductName(line.productId)}
                              </td>
                              <td className="py-3 px-4 font-mono">{line.quantity}</td>
                              <td className="py-3 px-4 font-mono text-slate-400">${(base > 0 ? base : unit).toFixed(2)}</td>
                              <td className="py-3 px-4 font-mono">
                                <span className="text-sky-700 font-bold">${unit.toFixed(2)}</span>
                                {Number(discPercent) > 0 && (
                                  <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                                    {discPercent}% off
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 font-mono font-bold text-sky-700">
                                ${Number(line.subtotalAmount || line.subtotal || unit * line.quantity).toFixed(2)}
                              </td>
                              <td className="py-3 px-4 text-right space-x-1">
                                <button
                                  onClick={() => handleOpenEditLine(line)}
                                  title="Edit Discount & Quantity"
                                  className="p-1.5 text-slate-400 hover:text-amber-600 rounded transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleDeleteLine(line.id)}
                                  title="Delete Line"
                                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Totals Summary Footer with Complete Discount Breakdown */}
                <div className="p-5 bg-slate-50/80 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">List Price Subtotal</span>
                    <span className="text-slate-700 text-sm font-semibold">
                      ${financials.listSubtotal.toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Total Discount</span>
                    <span className="text-amber-600 text-sm font-bold">
                      -${financials.discountAmount.toFixed(2)} ({financials.overallDiscountPercent}%)
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Net Subtotal</span>
                    <span className="text-slate-800 text-sm font-semibold">
                      ${financials.netSubtotal.toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Tax</span>
                    <span className="text-slate-700 text-sm font-semibold">
                      ${financials.taxAmount.toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Final Quotation Total</span>
                    <span className="text-sky-700 text-base font-bold">
                      ${financials.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Previous Counter Proposals & Negotiation Log below quotation */}
              {(negotiationHistory.length > 0 || activeNegotiation || quotation?.status === 'UNDER_NEGOTIATION' || quotation?.counterDiscountPercent) && (
                <div className="bg-purple-50/70 border border-purple-200 p-5 rounded-2xl space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-purple-200 pb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-purple-700" />
                      <h3 className="text-sm font-bold text-purple-950 uppercase tracking-wider">
                        Previous Counter Proposals &amp; Negotiation Data
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-purple-800 bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200">
                      {negotiationHistory.length > 0 ? negotiationHistory.length : 1} Counter Proposal{(negotiationHistory.length > 1) ? 's' : ''}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {(negotiationHistory.length > 0 ? negotiationHistory : [activeNegotiation || {
                      id: 'REQ-1',
                      counterDiscountPercent: quotation?.counterDiscountPercent || 10,
                      description: quotation?.notes || 'Customer counter proposal',
                      status: quotation?.status === 'UNDER_NEGOTIATION' ? 'SUBMITTED' : 'RESOLVED',
                      createdAt: quotation?.updatedAt
                    }]).map((req, idx) => {
                      const desc = req?.description || '';
                      const matchDisc = desc.match(/(\d+(\.\d+)?)%/);
                      const discPercent = req?.counterDiscountPercent != null
                        ? req.counterDiscountPercent
                        : (matchDisc ? parseFloat(matchDisc[1]) : (quotation?.counterDiscountPercent || null));
                      const statusStr = (req?.status || 'SUBMITTED').toUpperCase();
                      const isPending = statusStr === 'SUBMITTED' || statusStr === 'PENDING' || statusStr === 'OPEN' || statusStr === 'UNDER_NEGOTIATION';

                      let counterSub = null;
                      let counterTotal = null;
                      let savings = null;
                      if (discPercent != null) {
                        counterSub = financials.listSubtotal * (1 - discPercent / 100);
                        counterTotal = counterSub + financials.taxAmount;
                        savings = Math.max(0, financials.listSubtotal - counterSub);
                      }

                      return (
                        <div key={req?.id || idx} className="bg-white border border-purple-200 p-4 rounded-xl space-y-3 shadow-xs">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-slate-900">
                                Counter Proposal #{req?.id || `REQ-${idx + 1}`}
                              </span>
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border uppercase ${
                                isPending
                                  ? 'bg-purple-100 text-purple-800 border-purple-300'
                                  : statusStr === 'RESOLVED' || statusStr === 'ACCEPTED'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-slate-100 text-slate-700 border-slate-300'
                              }`}>
                                {isPending ? 'AWAITING REVIEW' : statusStr}
                              </span>
                            </div>
                            {req?.createdAt && (
                              <span className="text-[11px] font-mono text-slate-400">
                                {new Date(req.createdAt).toLocaleString()}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="p-2.5 bg-purple-50/50 rounded-lg border border-purple-100">
                              <span className="text-[10px] font-mono text-purple-700 uppercase font-semibold block">Customer Counter Discount:</span>
                              <span className="text-amber-600 font-extrabold text-base font-mono">
                                {discPercent != null ? `${discPercent}% OFF` : 'Custom Terms'}
                              </span>
                            </div>

                            <div className="p-2.5 bg-purple-50/50 rounded-lg border border-purple-100">
                              <span className="text-[10px] font-mono text-purple-700 uppercase font-semibold block">Counter Financial Impact:</span>
                              {counterTotal != null ? (
                                <div>
                                  <span className="text-emerald-700 font-bold font-mono text-sm">${counterTotal.toFixed(2)}</span>
                                  <span className="text-[10px] text-slate-500 block font-sans">Savings: ${savings.toFixed(2)}</span>
                                </div>
                              ) : (
                                <span className="text-slate-500 italic font-sans">Pending application</span>
                              )}
                            </div>

                            <div className="p-2.5 bg-purple-50/50 rounded-lg border border-purple-100">
                              <span className="text-[10px] font-mono text-purple-700 uppercase font-semibold block">Customer Request Notes:</span>
                              <p className="text-slate-700 text-xs italic font-sans line-clamp-2">
                                "{req?.lineComments || req?.description || 'Customer submitted counter proposal terms.'}"
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Side Recommendation Panel */}
            <div className="space-y-4">
              <div className="bg-white border border-blue-100 p-5 rounded-2xl space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    Upsell &amp; Cross-Sell
                  </h3>
                  <span className="text-[10px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 font-bold">
                    AI RANKED
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  Suggestions derived from co-purchase history and promotions with live margin impact.
                </p>

                {(() => {
                  let recList = recommendations;
                  if (!Array.isArray(recList) || recList.length === 0) {
                    const existingProdIds = lines.map((l) => String(l.productId));
                    const unaddedProducts = products.filter((p) => !existingProdIds.includes(String(p.id || p.dbId)));
                    recList = unaddedProducts.map((p) => ({
                      id: p.id || p.dbId,
                      suggestedProductId: p.id || p.dbId,
                      marginDeltaPercent: 5.0,
                      promotionTag: 'RECOMMENDED PAIRING',
                    }));
                  }

                  if (recList.length === 0) {
                    return (
                      <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-400 italic border border-slate-200">
                        All catalog products added to quotation.
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {recList.map((rec) => (
                        <div
                          key={rec.id}
                          className="bg-slate-50 border border-slate-200 hover:border-sky-300 p-4 rounded-xl space-y-2.5 transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-xs text-slate-900">
                              {getProductName(rec.suggestedProductId)}
                            </h4>
                            <span className="text-[10px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-semibold border border-sky-200">
                              +{Number(rec.marginDeltaPercent || 4.5).toFixed(1)}% Margin
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 line-clamp-2">
                            Recommended pairing for higher profitability and complete B2B solution.
                          </p>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] text-sky-600 font-mono">
                              PROMO: {rec.promotionTag || 'HEALTHY MARGIN'}
                            </span>
                            <button
                              onClick={() => handleAddLine(null, rec.suggestedProductId)}
                              className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-[11px] rounded-lg shadow-xs flex items-center gap-1 transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Add to Quote
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Line Item Edit Modal */}
        {editingLine && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl w-full max-w-md space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-amber-600" />
                  Edit Line Item Discount &amp; Price
                </h3>
                <button onClick={() => setEditingLine(null)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1">Product:</span>
                  <span className="font-bold text-slate-900 text-sm">{getProductName(editingLine.productId)}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={editQty}
                      onChange={(e) => setEditQty(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 font-mono focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="90"
                      value={editDiscountPercent}
                      onChange={(e) => handleEditDiscountChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-amber-600 font-mono focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">Discounted Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editUnitPrice}
                    onChange={(e) => setEditUnitPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sky-700 font-mono text-sm font-bold focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingLine(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveEditedLine}
                  disabled={updatingLine}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  {updatingLine ? 'Saving...' : 'Update Discount & Line'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Approval Route Result Modal */}
        {showApprovalModal && approvalResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl w-full max-w-lg space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-600" />
                  Approval Governance Route
                </h3>
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                  {approvalResult.quotation?.status}
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-semibold text-slate-900">Blended Risk Assessment:</div>
                  <div className="text-slate-600">
                    Overall Risk Score: <span className="font-mono text-amber-600 font-bold">{approvalResult.riskResult?.overallRiskScore || 'EVALUATED'}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-semibold text-slate-900">Required Approval Chain Steps:</div>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    <li>Sales Manager Approval Step (Required)</li>
                    {approvalResult.riskResult?.overallRiskScore > 50 && (
                      <li>Finance Officer Second Level Approval (Required for High Risk)</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs"
                >
                  Acknowledge &amp; Return to Workspace
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sales Rep Response to Customer Negotiation Modal */}
        {showRepResponseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl w-full max-w-md space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  Respond to Customer Negotiation
                </h3>
                <button onClick={() => setShowRepResponseModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSendRepResponse} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-500 mb-1 font-mono uppercase text-[10px]">Response Message / Counter Note</label>
                  <textarea
                    rows="4"
                    required
                    value={repResponseNote}
                    onChange={(e) => setRepResponseNote(e.target.value)}
                    placeholder="Enter your response, revised offer terms, or approval explanation..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-purple-500"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowRepResponseModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {actionLoading ? 'Sending...' : 'Send Response to Customer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
