import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { portalApi } from '../../api/portalApi';
import { quotationApi } from '../../api/quotationApi';
import { productApi } from '../../api/productApi';
import { Navbar } from '../../components/common/Navbar';
import {
  MessageSquare,
  CheckCircle,
  Send,
  AlertTriangle,
  FileText,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  CreditCard,
  Lock,
  Sparkles,
  X,
  CheckCircle2,
  DollarSign,
  Clock
} from 'lucide-react';

export const CustomerPortalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeQuoteId, setActiveQuoteId] = useState(id || '');
  const [quotation, setQuotation] = useState(null);
  const [lines, setLines] = useState([]);
  const [products, setProducts] = useState([]);
  const [availableQuotes, setAvailableQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  // Counter proposal state
  const [counterDiscountPercent, setCounterDiscountPercent] = useState('');
  const [lineComments, setLineComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Payment Demo PIN Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [securityPin, setSecurityPin] = useState('1234');
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [paymentSuccessResult, setPaymentSuccessResult] = useState(null);

  const loadPortalView = async (qId) => {
    setLoading(true);
    setNotFound(false);
    setError('');
    try {
      const [allQuotesRes, prodRes] = await Promise.all([
        quotationApi.getAllQuotations().catch(() => []),
        productApi.getAllProducts().catch(() => []),
      ]);

      const quotesList = Array.isArray(allQuotesRes) ? allQuotesRes : [];
      setProducts(Array.isArray(prodRes) ? prodRes : []);
      setAvailableQuotes(quotesList);

      // Determine target quote ID
      let targetQuoteId = qId;
      if (!targetQuoteId) {
        const sentQuotes = quotesList.filter(
          (q) => q.status === 'SENT' || q.status === 'UNDER_NEGOTIATION' || q.status === 'CONFIRMED'
        );
        if (sentQuotes.length > 0) {
          targetQuoteId = String(sentQuotes[sentQuotes.length - 1].id);
        } else if (quotesList.length > 0) {
          targetQuoteId = String(quotesList[quotesList.length - 1].id);
        }
      }

      if (targetQuoteId) {
        setActiveQuoteId(String(targetQuoteId));
        const pRes = await portalApi.getPortalQuotationView(targetQuoteId).catch(() => null);
        if (pRes && pRes.quotation) {
          setQuotation(pRes.quotation);
          setLines(pRes.lines || []);
        } else {
          setNotFound(true);
        }
      } else {
        setNotFound(true);
      }
    } catch (err) {
      setError(err.message || 'Quotation not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortalView(id);
  }, [id]);

  const handleSwitchQuote = (newId) => {
    setActiveQuoteId(newId);
    navigate(`/portal/quotations/${newId}`);
    loadPortalView(newId);
  };

  const handleSubmitNegotiation = async (e) => {
    e.preventDefault();
    if (!counterDiscountPercent && !lineComments) {
      alert('Please enter a counter discount % or line comment.');
      return;
    }

    setSubmitting(true);
    try {
      await portalApi.submitNegotiation({
        customerId: quotation?.customerId || 1,
        quotationId: Number(activeQuoteId),
        requestType: 'COUNTER_DISCOUNT',
        description: lineComments || 'Customer counter offer request',
        counterDiscountPercent: counterDiscountPercent ? Number(counterDiscountPercent) : null,
        lineComments: lineComments,
      });

      alert('Counter offer submitted! Quotation status updated to UNDER_NEGOTIATION and re-routed for manager approval.');
      setCounterDiscountPercent('');
      setLineComments('');
      await loadPortalView(activeQuoteId);
    } catch (err) {
      alert(err.message || 'Negotiation submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDirectConfirmQuotation = async () => {
    if (quotation?.status === 'CONFIRMED') {
      alert('This quotation has already been confirmed!');
      return;
    }
    setConfirming(true);
    try {
      const res = await portalApi.confirmQuotation(activeQuoteId);
      alert('Quotation confirmed! Order created, warehouse fulfillment split calculated, and invoice issued.');
      const orderId = res?.order?.id || activeQuoteId;
      navigate(`/orders/${orderId}`);
    } catch (err) {
      alert(err.message || 'Quotation confirmation failed.');
    } finally {
      setConfirming(false);
    }
  };

  const handleOpenPaymentModal = () => {
    if (quotation?.status === 'CONFIRMED') {
      alert('This order has already been confirmed!');
      return;
    }
    setShowPaymentModal(true);
  };

  const handleProcessPayment = async (e) => {
    if (e) e.preventDefault();
    if (!securityPin || securityPin.length < 4) {
      alert('Please enter a valid 4-digit security PIN (e.g. 1234).');
      return;
    }

    setConfirming(true);
    try {
      const res = await portalApi.confirmQuotation(activeQuoteId, securityPin, paymentMethod);
      setShowPaymentModal(false);
      setPaymentSuccessResult(res);
      await loadPortalView(activeQuoteId);
    } catch (err) {
      alert(err.message || 'Payment processing & order confirmation failed.');
    } finally {
      setConfirming(false);
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

  const calculatePortalFinancials = () => {
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

  const financials = calculatePortalFinancials();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Bar with Quote Selector */}
        <div className="bg-white border border-blue-100 p-6 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-sky-600 font-bold">CUSTOMER PORTAL VIEW</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  quotation?.status === 'CONFIRMED'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : quotation?.status === 'UNDER_NEGOTIATION'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : quotation?.status === 'SENT'
                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {quotation?.status || 'SENT'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              B2B Quotation #{activeQuoteId || '...'} Negotiation Portal
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review transparent pricing terms, discount savings, propose counter offers, or confirm order in 1 click
            </p>
          </div>

          <div className="flex items-center gap-3">
            {availableQuotes.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Select Quote:</span>
                <select
                  value={activeQuoteId}
                  onChange={(e) => handleSwitchQuote(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-mono focus:outline-none focus:border-sky-500"
                >
                  {availableQuotes.map((q) => (
                    <option key={q.id} value={q.id}>
                      Quote #{q.id} ({q.status}) - ${Number(q.totalAmount || 0).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {quotation?.status === 'CONFIRMED' ? (
              <button
                onClick={() => navigate(`/orders/${activeQuoteId}`)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <CheckCircle className="w-4 h-4" />
                View Created Sales Order Details &amp; Flow →
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDirectConfirmQuotation}
                  disabled={confirming || !quotation}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  {confirming ? 'Creating Order...' : 'Confirm Quotation & Create Order'}
                </button>

                <button
                  onClick={handleOpenPaymentModal}
                  disabled={confirming || !quotation}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4 text-sky-600" />
                  Pay &amp; Confirm
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 font-mono">Loading portal quotation...</p>
          </div>
        ) : notFound && !quotation ? (
          <div className="py-16 text-center bg-white border border-dashed border-slate-200 rounded-2xl p-8 space-y-3">
            <FileText className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-800">No Quotations Received Yet</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Your sales representative will publish your B2B quotation here for review and negotiation.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quotation Details (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-600" />
                    Quotation Line Items ({lines.length})
                  </h3>
                  <button
                    onClick={() => loadPortalView(activeQuoteId)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Item Description</th>
                        <th className="py-3 px-4">Billing Type</th>
                        <th className="py-3 px-4">Qty</th>
                        <th className="py-3 px-4">Offered Unit Price</th>
                        <th className="py-3 px-4">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {lines.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-6 text-center text-slate-400 italic">
                            No line items in this quotation.
                          </td>
                        </tr>
                      ) : (
                        lines.map((line) => {
                          const base = getProductBasePrice(line.productId);
                          const unit = Number(line.unitPrice || 0);
                          const isSub = products.find((p) => String(p.id || p.dbId) === String(line.productId))?.isSubscription;

                          return (
                            <tr key={line.id} className="hover:bg-slate-50/60">
                              <td className="py-3.5 px-4 font-semibold text-slate-900">
                                {getProductName(line.productId)}
                              </td>
                              <td className="py-3.5 px-4 font-mono">
                                {isSub ? (
                                  <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-semibold">
                                    Subscription (Monthly)
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-semibold">
                                    One-Time Charge
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 font-mono">{line.quantity}</td>
                              <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                                ${unit.toFixed(2)} {isSub ? '/ mo' : ''}
                              </td>
                              <td className="py-3.5 px-4 font-mono font-bold text-sky-700">
                                ${Number(line.subtotalAmount || line.subtotal || line.totalAmount || unit * line.quantity).toFixed(2)}
                                {isSub ? ' / mo' : ''}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Complete Financial Breakdown Summary Footer */}
                <div className="p-5 bg-slate-50/80 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Base List Subtotal</span>
                    <span className="text-slate-700 text-sm font-semibold">
                      ${financials.listSubtotal.toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Total Discount Savings</span>
                    <span className="text-amber-600 text-sm font-bold">
                      -${financials.discountAmount.toFixed(2)} ({financials.overallDiscountPercent}% OFF)
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Tax / Shipping</span>
                    <span className="text-slate-700 text-sm font-semibold">
                      ${financials.taxAmount.toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Net Total Payable</span>
                    <span className="text-sky-700 text-base font-extrabold">
                      ${financials.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Negotiation Tool Side Form */}
            <div className="space-y-4">
              <div className="bg-white border border-blue-100 p-5 rounded-2xl space-y-4 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-sky-600" />
                  Live Negotiation Tool
                </h3>

                <p className="text-xs text-slate-500">
                  Propose counter discount terms or line change requests without back-and-forth emails.
                </p>

                <form onSubmit={handleSubmitNegotiation} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Counter Discount Proposal (%)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="50"
                      value={counterDiscountPercent}
                      onChange={(e) => setCounterDiscountPercent(e.target.value)}
                      placeholder="e.g. 18.5%"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-mono text-sm focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Line Comment / Change Request
                    </label>
                    <textarea
                      rows="4"
                      value={lineComments}
                      onChange={(e) => setLineComments(e.target.value)}
                      placeholder="Specify requested quantity changes or custom packaging requirements..."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-sky-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submitting ? 'Submitting...' : 'Submit Counter Offer'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Demo Security PIN Payment Authorization Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl w-full max-w-lg space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-xl border border-sky-200">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Payment &amp; Order Authorization</h3>
                  <p className="text-[11px] text-slate-500">Order #{activeQuoteId} • Demo PIN Authorization</p>
                </div>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categorized Billing Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="font-semibold text-slate-700 uppercase font-mono text-[10px] tracking-wider">
                Itemized Billing Structure:
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {lines.map((line) => {
                  const isSub = products.find((p) => String(p.id || p.dbId) === String(line.productId))?.isSubscription;
                  const amt = Number(line.totalAmount || line.subtotalAmount || line.unitPrice * line.quantity);
                  return (
                    <div
                      key={line.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        isSub ? 'bg-purple-50 border-purple-200' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{getProductName(line.productId)}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Qty: {line.quantity}</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-bold text-sky-700 text-sm">${amt.toFixed(2)}</span>
                        <span className="block text-[10px] font-semibold text-slate-500">
                          {isSub ? 'Monthly Subscription Charge' : 'One-Time Charge'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Subtotal Totals Box */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 font-mono text-xs">
                {(() => {
                  let subTotalMonthly = 0;
                  let oneTimeSubtotal = 0;
                  lines.forEach((l) => {
                    const isSub = products.find((p) => String(p.id || p.dbId) === String(l.productId))?.isSubscription;
                    const amt = Number(l.totalAmount || l.subtotalAmount || l.unitPrice * l.quantity);
                    if (isSub) subTotalMonthly += amt;
                    else oneTimeSubtotal += amt;
                  });

                  return (
                    <>
                      <div className="flex justify-between text-slate-600">
                        <span>One-Time Charges:</span>
                        <span className="text-slate-800 font-bold">${oneTimeSubtotal.toFixed(2)}</span>
                      </div>
                      {subTotalMonthly > 0 && (
                        <div className="flex justify-between text-purple-700">
                          <span>Monthly Recurring Charge:</span>
                          <span className="font-bold">${subTotalMonthly.toFixed(2)} / month</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-sky-700">
                        <span>Total Initial Charge:</span>
                        <span>${(oneTimeSubtotal + subTotalMonthly).toFixed(2)}</span>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Security PIN Authorization Entry */}
              <form onSubmit={handleProcessPayment} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-sky-600" />
                      Enter Security PIN to Pay &amp; Confirm
                    </span>
                    <span className="text-[10px] font-mono text-sky-600 font-bold">Demo PIN: 1234</span>
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    value={securityPin}
                    onChange={(e) => setSecurityPin(e.target.value)}
                    placeholder="Enter 4-digit PIN (e.g. 1234)"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-center text-sky-700 font-mono text-lg tracking-[0.5em] font-bold focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={confirming || securityPin.length < 4}
                    className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {confirming ? 'Processing Payment...' : 'Submit Payment & Confirm Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Post-Payment & Invoice Success Modal */}
      {paymentSuccessResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl w-full max-w-md space-y-5 shadow-xl text-center">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono text-sky-600 font-bold uppercase tracking-wider">Payment Authorized &amp; Order Placed ✓</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Invoice Generated Successfully!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your payment was received, invoice issued, and monthly subscription schedules activated.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs font-mono text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="text-slate-900 font-bold">#{paymentSuccessResult.order?.id || activeQuoteId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice Number:</span>
                <span className="text-emerald-700 font-bold">
                  {paymentSuccessResult.invoice?.id ? `INV-${paymentSuccessResult.invoice.id}` : 'INV-2026-001'} (PAID ✓)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Initial Paid Amount:</span>
                <span className="text-emerald-700 font-bold">
                  ${Number(paymentSuccessResult.payment?.amount || financials.totalAmount).toFixed(2)}
                </span>
              </div>
              {paymentSuccessResult.subscriptions && paymentSuccessResult.subscriptions.length > 0 && (
                <div className="flex justify-between text-purple-700 pt-1 border-t border-slate-200">
                  <span>Active Subscriptions:</span>
                  <span className="font-bold">{paymentSuccessResult.subscriptions.length} Plan(s) Monthly Charge</span>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Link
                to="/billing"
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              >
                <FileText className="w-4 h-4" />
                View Invoices &amp; Billing Board
              </Link>
              <button
                onClick={() => setPaymentSuccessResult(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

