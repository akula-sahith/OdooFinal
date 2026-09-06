import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import { billingApi } from '../../api/billingApi';
import { productApi } from '../../api/productApi';
import { Layout } from '../../components/common/Layout';
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle,
  Truck,
  FileText,
  CreditCard,
  Building,
  RefreshCw,
  AlertTriangle,
  Lock,
  X,
  CheckCircle2,
  Calendar,
  Layers,
  DollarSign,
  Package,
  Clock
} from 'lucide-react';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Payment Recording Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [securityPin, setSecurityPin] = useState('1234');
  const [paymentRef, setPaymentRef] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  const loadOrderDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const [res, prodRes] = await Promise.all([
        orderApi.getOrderById(id),
        productApi.getAllProducts().catch(() => []),
      ]);

      if (res && res.order) {
        setOrderData(res);
      } else {
        setError(`Order #${id} not found.`);
      }
      setProducts(Array.isArray(prodRes) ? prodRes : []);
    } catch (err) {
      setError(err.message || 'Failed to load order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadOrderDetail();
    }
  }, [id]);

  const handleOpenPaymentModal = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentRef(`PAY-REF-${Date.now().toString().slice(-6)}`);
    setShowPaymentModal(true);
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    if (!securityPin || securityPin.length < 4) {
      alert('Please enter a valid 4-digit PIN (e.g. 1234).');
      return;
    }

    setProcessingPayment(true);
    try {
      const ref = `PIN-AUTH-${securityPin}-${paymentRef || 'TX'}`;
      await billingApi.recordPayment(
        selectedInvoice.id,
        paymentMethod,
        selectedInvoice.totalAmount,
        ref
      );

      alert(`Payment recorded successfully! Invoice #INV-${selectedInvoice.id} status updated to PAID.`);
      setShowPaymentModal(false);
      await loadOrderDetail();
    } catch (err) {
      alert(err.message || 'Failed to record payment.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const getProductName = (prodId) => {
    const p = products.find((pr) => String(pr.id || pr.dbId) === String(prodId));
    return p ? p.name : `Product #${prodId}`;
  };

  const getWarehouseName = (whId) => {
    if (!orderData?.warehouses) return `Warehouse #${whId}`;
    const wh = orderData.warehouses.find((w) => String(w.id) === String(whId));
    return wh ? `${wh.name} (${wh.location})` : `Warehouse #${whId}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-mono">Loading Order Details &amp; Lifecycle Progress...</p>
        </div>
      </Layout>
    );
  }

  if (error || !orderData) {
    return (
      <Layout>
        <div className="bg-white border border-rose-200 rounded-2xl p-12 text-center space-y-4 shadow-xs">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Order Not Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">{error || 'The requested order could not be retrieved.'}</p>
          <button
            onClick={() => navigate('/orders')}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs"
          >
            Back to Orders Directory
          </button>
        </div>
      </Layout>
    );
  }

  const { order, lines = [], fulfillmentOrders = [], fulfillmentSplits = [], invoices = [], payments = [], subscriptions = [], quotation } = orderData;

  // Determine Lifecycle Stage States
  const isQuotationConfirmed = order.status === 'CONFIRMED' || quotation?.status === 'CONFIRMED';
  const isOrderCreated = !!order.id;
  const isFulfillmentAllocated = fulfillmentSplits.length > 0 || fulfillmentOrders.length > 0;
  const isInvoiceGenerated = invoices.length > 0;
  const primaryInvoice = invoices[0] || null;
  const isPaid = primaryInvoice?.status === 'PAID' || payments.some((p) => p.status === 'SUCCESS');

  return (
    <Layout>
      <div className="space-y-6">
        {/* Top Header Bar */}
        <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/orders')}
              className="p-2.5 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all shadow-xs"
              title="Back to Orders List"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-sky-600 font-bold uppercase tracking-wider">SALES ORDER LIFECYCLE</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                    isPaid
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : isInvoiceGenerated
                      ? 'bg-sky-50 text-sky-700 border-sky-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {isPaid ? 'PAID & CONFIRMED ✓' : order.status || 'CONFIRMED'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-sky-600" />
                Order #{order.id} Details
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                Customer #{order.customerId} • Currency: {order.currency || 'USD'} • Created: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Today'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadOrderDetail}
              className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 shadow-xs"
              title="Refresh Details"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {primaryInvoice && !isPaid && (
              <button
                onClick={() => handleOpenPaymentModal(primaryInvoice)}
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-105"
              >
                <CreditCard className="w-4 h-4" />
                Pay Invoice #${primaryInvoice.id} (${Number(primaryInvoice.totalAmount).toFixed(2)})
              </button>
            )}
          </div>
        </div>

        {/* 6-STAGE ORDER LIFECYCLE PROGRESSION BANNER */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            Problem Statement Order Execution Lifecycle:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Step 1: Quotation Confirmed */}
            <div className="p-3.5 rounded-xl border bg-emerald-50/80 border-emerald-200 text-emerald-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase">1. Quotation</span>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs font-bold">CONFIRMED ✓</p>
              <p className="text-[10px] text-emerald-700 font-mono">Ref #{order.quotationId || 'QTN-1'}</p>
            </div>

            {/* Step 2: Order Created */}
            <div className="p-3.5 rounded-xl border bg-emerald-50/80 border-emerald-200 text-emerald-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase">2. Order Created</span>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs font-bold">Order #{order.id}</p>
              <p className="text-[10px] text-emerald-700 font-mono">${Number(order.totalAmount || 0).toFixed(2)}</p>
            </div>

            {/* Step 3: Fulfillment Split */}
            <div className={`p-3.5 rounded-xl border space-y-1 ${
              isFulfillmentAllocated
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase">3. Fulfillment</span>
                {isFulfillmentAllocated ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-slate-400" />}
              </div>
              <p className="text-xs font-bold">{isFulfillmentAllocated ? 'Depot Allocated' : 'Pending Allocation'}</p>
              <p className="text-[10px] font-mono">{fulfillmentSplits.length} Depot Split(s)</p>
            </div>

            {/* Step 4: Billing Generated */}
            <div className={`p-3.5 rounded-xl border space-y-1 ${
              isInvoiceGenerated
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase">4. Billing</span>
                {isInvoiceGenerated ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-slate-400" />}
              </div>
              <p className="text-xs font-bold">{isInvoiceGenerated ? 'Invoice Issued' : 'Generating...'}</p>
              <p className="text-[10px] font-mono">{primaryInvoice ? `INV-#${primaryInvoice.id}` : 'One-Time / Sub'}</p>
            </div>

            {/* Step 5: Payment Recorded */}
            <div className={`p-3.5 rounded-xl border space-y-1 ${
              isPaid
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                : 'bg-sky-50 border-sky-200 text-sky-800'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase">5. Payment</span>
                {isPaid ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <CreditCard className="w-4 h-4 text-sky-600" />}
              </div>
              <p className="text-xs font-bold">{isPaid ? 'Recorded ✓' : 'Payment Required'}</p>
              <p className="text-[10px] font-mono">{payments.length} Transaction(s)</p>
            </div>

            {/* Step 6: Invoice Status Update */}
            <div className={`p-3.5 rounded-xl border space-y-1 ${
              isPaid
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase">6. Invoice Status</span>
                {isPaid ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-slate-400" />}
              </div>
              <p className="text-xs font-bold">{isPaid ? 'Status: PAID' : 'Status: ISSUED'}</p>
              <p className="text-[10px] font-mono">{isPaid ? 'Settled' : 'Awaiting Payment'}</p>
            </div>
          </div>
        </div>

        {/* SECTION 1: ORDERED LINE ITEMS & COMMERCIAL TOTALS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-sky-600" />
            Ordered Commercial Line Items ({lines.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Billing Category</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Unit Price</th>
                  <th className="py-3 px-4">Tax %</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {lines.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-slate-400 italic">No order lines found.</td>
                  </tr>
                ) : (
                  lines.map((line) => {
                    const isSub = products.find((p) => String(p.id || p.dbId) === String(line.productId))?.isSubscription;
                    return (
                      <tr key={line.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-bold text-slate-900">{getProductName(line.productId)}</td>
                        <td className="py-3 px-4 font-mono">
                          {isSub ? (
                            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-semibold">
                              Subscription (Monthly)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-semibold">
                              One-Time Line
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold">{line.quantity}</td>
                        <td className="py-3 px-4 font-mono">${Number(line.unitPrice || 0).toFixed(2)}</td>
                        <td className="py-3 px-4 font-mono">{line.taxPercent || 18}%</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-sky-700">
                          ${Number(line.totalAmount || line.subtotalAmount || line.unitPrice * line.quantity).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-end">
            <div className="w-full sm:w-72 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold">${Number(order.subtotalAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax:</span>
                <span className="font-semibold">${Number(order.taxAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                <span>Total Order Amount:</span>
                <span className="text-sky-700">${Number(order.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: FULFILLMENT & MULTI-WAREHOUSE SPLIT ALLOCATION */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-sky-600" />
              Automated Fulfillment &amp; Multi-Warehouse Stock Allocation ({fulfillmentSplits.length} Splits)
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-sky-50 text-sky-700 border border-sky-200 font-semibold">
              Calculated Split Engine
            </span>
          </div>

          {fulfillmentSplits.length === 0 ? (
            <div className="p-6 bg-slate-50 rounded-xl text-center text-xs text-slate-500 italic">
              No warehouse stock split recorded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fulfillmentSplits.map((split) => {
                const isBackorder = split.backorderReason === 'STOCK_DEFICIT' || split.isBackorder;
                return (
                  <div
                    key={split.id}
                    className={`p-4 rounded-xl border space-y-2 text-xs font-mono shadow-xs ${
                      isBackorder ? 'bg-amber-50/60 border-amber-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-sky-600" />
                        {getWarehouseName(split.warehouseId)}
                      </span>
                    </div>

                    <div className="text-slate-700 font-sans">
                      Product: <span className="font-semibold text-slate-900">{getProductName(split.orderLineId)}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 font-mono">
                      <span className="text-slate-500">Quantity Allocated:</span>
                      <span className="font-bold text-sky-700 text-sm">{split.quantityAllocated} units</span>
                    </div>

                    {isBackorder ? (
                      <div className="p-2 bg-amber-100/70 border border-amber-300 text-amber-800 rounded font-semibold text-[10px] flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-700" />
                        Backorder Required (Stock Deficit)
                      </div>
                    ) : (
                      <div className="text-[10px] text-emerald-700 font-bold">
                        Stock Reserved ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION 3: BILLING & RECURRING SUBSCRIPTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* One-Time Invoices */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600" />
              Generated Commercial Invoices ({invoices.length})
            </h3>

            {invoices.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-xl text-center text-xs text-slate-500 italic">
                No invoice generated yet for this order.
              </div>
            ) : (
              <div className="space-y-3">
                {invoices.map((inv) => (
                  <div key={inv.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 font-mono text-sm">Invoice #INV-{inv.id}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {inv.status || 'ISSUED'}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between font-mono">
                      <span className="text-slate-500">Total Invoice Amount:</span>
                      <span className="text-base font-extrabold text-sky-700">${Number(inv.totalAmount || 0).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200 pt-2 font-mono">
                      <span>Due: {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '30 Days'}</span>
                      {inv.status !== 'PAID' && (
                        <button
                          onClick={() => handleOpenPaymentModal(inv)}
                          className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] rounded-lg shadow-xs"
                        >
                          Record Payment
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recurring Subscriptions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              Recurring Subscription Schedules ({subscriptions.length})
            </h3>

            {subscriptions.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-xl text-center text-xs text-slate-500 italic">
                No recurring subscriptions attached to this order.
              </div>
            ) : (
              <div className="space-y-3">
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-2 text-xs font-mono shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">Subscription #{sub.id}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                        {sub.status || 'ACTIVE'}
                      </span>
                    </div>

                    <div className="text-purple-800 font-sans">
                      Frequency: <span className="font-bold">Monthly Recurring Billing</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-purple-200 pt-2 font-mono">
                      <span>Period Start: {sub.currentPeriodStart ? new Date(sub.currentPeriodStart).toLocaleDateString() : 'Today'}</span>
                      <span className="text-emerald-700 font-bold">Schedule Active ✓</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DEMO SECURITY PIN PAYMENT AUTHORIZATION MODAL */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl w-full max-w-md space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-xl border border-sky-200">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Record Payment</h3>
                  <p className="text-[11px] text-slate-500">Invoice #INV-{selectedInvoice.id} • Order #{order.id}</p>
                </div>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono">
                <div className="flex justify-between text-slate-500">
                  <span>Invoice Amount Due:</span>
                  <span className="font-bold text-sky-700 text-base">${Number(selectedInvoice.totalAmount).toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-mono uppercase text-[10px]">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-mono focus:outline-none focus:border-sky-500"
                >
                  <option value="CREDIT_CARD">Credit Card / Debit</option>
                  <option value="BANK_TRANSFER">Bank Wire Transfer</option>
                  <option value="DEMO_PIN_PAYMENT">Demo PIN Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-mono uppercase text-[10px] flex justify-between">
                  <span>Enter 4-Digit Security PIN</span>
                  <span className="text-sky-600 font-bold">Demo PIN: 1234</span>
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-center text-sky-700 font-mono text-lg font-bold tracking-[0.5em] focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingPayment || securityPin.length < 4}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  {processingPayment ? 'Processing...' : 'Authorize Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};
