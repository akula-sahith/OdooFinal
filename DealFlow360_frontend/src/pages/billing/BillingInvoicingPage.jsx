import React, { useState, useEffect } from 'react';
import { billingApi } from '../../api/billingApi';
import { Layout } from '../../components/common/Layout';
import { CreditCard, DollarSign, Calendar, RefreshCw, FileText, CheckCircle, Plus, AlertCircle } from 'lucide-react';

export const BillingInvoicingPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal payment state
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [paymentRef, setPaymentRef] = useState('');
  const [recordingPayment, setRecordingPayment] = useState(false);

  const loadBillingData = async () => {
    setLoading(true);
    setError('');
    try {
      const [invRes, subRes, payRes] = await Promise.all([
        billingApi.getAllInvoices(),
        billingApi.getAllSubscriptions(),
        billingApi.getAllPayments(),
      ]);
      setInvoices(Array.isArray(invRes) ? invRes : []);
      setSubscriptions(Array.isArray(subRes) ? subRes : []);
      setPayments(Array.isArray(payRes) ? payRes : []);
    } catch (err) {
      setError(err.message || 'Failed to load billing data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillingData();
  }, []);

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!selectedInvoice || !paymentAmount) return;

    setRecordingPayment(true);
    try {
      await billingApi.recordPayment(
        selectedInvoice.id,
        paymentMethod,
        Number(paymentAmount),
        paymentRef || `PAY-${Date.now()}`
      );
      alert(`Payment of $${paymentAmount} recorded successfully!`);
      setSelectedInvoice(null);
      setPaymentAmount('');
      setPaymentRef('');
      await loadBillingData();
    } catch (err) {
      alert(err.message || 'Payment recording failed.');
    } finally {
      setRecordingPayment(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-blue-100 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-sky-600" />
              Hybrid Billing &amp; Subscriptions
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Reconciles one-time hardware sales with recurring subscription billing schedules and payments
            </p>
          </div>

          <button
            onClick={loadBillingData}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 text-xs font-semibold shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Invoices
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 font-mono">Fetching billing &amp; subscription records...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Invoices List (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-600" />
                    Commercial Invoices ({invoices.length})
                  </h3>
                </div>

                {invoices.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs italic">
                    No commercial invoices generated yet. Confirm an order from the customer portal or fulfillment screen to generate an invoice.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-100">
                        <tr>
                          <th className="py-3 px-5">Invoice ID</th>
                          <th className="py-3 px-5">Order Ref</th>
                          <th className="py-3 px-5">Status</th>
                          <th className="py-3 px-5">Total Amount</th>
                          <th className="py-3 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {invoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-50/60">
                            <td className="py-3 px-5 font-mono text-sky-600 font-bold">INV-#{inv.id}</td>
                            <td className="py-3 px-5 font-mono text-slate-800">Order #{inv.orderId || inv.id}</td>
                            <td className="py-3 px-5">
                              <span
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                                  inv.status === 'PAID'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}
                              >
                                {inv.status || 'UNPAID'}
                              </span>
                            </td>
                            <td className="py-3 px-5 font-mono font-bold text-slate-900">
                              ${Number(inv.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 px-5 text-right">
                              {inv.status !== 'PAID' && (
                                <button
                                  onClick={() => {
                                    setSelectedInvoice(inv);
                                    setPaymentAmount(inv.totalAmount || '');
                                  }}
                                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-[11px] rounded-lg shadow-xs"
                                >
                                  Record Payment
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Recurring Subscription Plans & Reconciled Lines */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  Active Subscriptions ({subscriptions.length})
                </h3>

                <p className="text-xs text-slate-500">
                  Recurring billing lines with mid-cycle proration and billing cycle schedules.
                </p>

                {subscriptions.length === 0 ? (
                  <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-400 italic border border-slate-200">
                    No recurring subscription contracts active.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {subscriptions.map((sub) => (
                      <div key={sub.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs">
                        <div className="flex items-center justify-between font-mono">
                          <span className="text-sky-700 font-bold">SUB-#{sub.id}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                            {sub.status || 'ACTIVE'}
                          </span>
                        </div>

                        <div className="text-slate-900 font-semibold">{sub.name || 'Cloud SaaS Plan'}</div>

                        <div className="flex items-center justify-between text-slate-500 font-mono text-[11px] pt-2 border-t border-slate-200">
                          <span>Billing: {sub.billingCycle || 'MONTHLY'}</span>
                          <span className="text-sky-700 font-bold">${Number(sub.price || 499).toFixed(2)}/mo</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Record Payment Modal */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl w-full max-w-md space-y-5 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-sky-600" />
                Record Payment for Invoice #{selectedInvoice.id}
              </h3>

              <form onSubmit={handleRecordPayment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Payment Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-sky-500"
                  >
                    <option value="CREDIT_CARD">Credit Card / Wire</option>
                    <option value="BANK_TRANSFER">Bank ACH Transfer</option>
                    <option value="CHECK">Commercial Check</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Payment Reference / Txn Hash
                  </label>
                  <input
                    type="text"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    placeholder="e.g. TXN-8930412"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={recordingPayment}
                    className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs"
                  >
                    {recordingPayment ? 'Recording...' : 'Confirm Payment'}
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
