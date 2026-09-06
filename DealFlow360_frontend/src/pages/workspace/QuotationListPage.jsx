import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { quotationApi } from '../../api/quotationApi';
import { customerApi } from '../../api/customerApi';
import { productApi } from '../../api/productApi';
import { Layout } from '../../components/common/Layout';
import { Plus, Search, Filter, RefreshCw, FileText, ArrowRight, DollarSign, Calendar, AlertCircle } from 'lucide-react';

export const QuotationListPage = () => {
  const [quotations, setQuotations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [priceLists, setPriceLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Create Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedPriceListId, setSelectedPriceListId] = useState('1');
  const [currency, setCurrency] = useState('USD');
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [quotesRes, custRes, priceRes] = await Promise.all([
        quotationApi.getAllQuotations(),
        customerApi.getAllCustomers(),
        productApi.getAllPriceLists(),
      ]);
      setQuotations(Array.isArray(quotesRes) ? quotesRes : []);
      setCustomers(Array.isArray(custRes) ? custRes : []);
      setPriceLists(Array.isArray(priceRes) ? priceRes : []);
    } catch (err) {
      setError(err.message || 'Failed to load quotations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateQuotation = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      alert('Please select a customer.');
      return;
    }
    setCreating(true);
    try {
      const newQuote = await quotationApi.createQuotation(selectedCustomerId, selectedPriceListId, currency);
      setShowCreateModal(false);
      navigate(`/quotations/${newQuote.id}`);
    } catch (err) {
      alert(err.message || 'Failed to create quotation.');
    } finally {
      setCreating(false);
    }
  };

  const getCustomerName = (custGoalId) => {
    const found = customers.find((c) => c.id === custGoalId || c.dbId === custGoalId);
    return found ? (found.companyName || found.name) : `Customer #${custGoalId}`;
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
      case 'CONFIRMED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING_APPROVAL':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'UNDER_NEGOTIATION':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'SENT':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredQuotations = quotations.filter((q) => {
    const matchesStatus = statusFilter === 'ALL' || q.status?.toUpperCase() === statusFilter;
    const custName = getCustomerName(q.customerId).toLowerCase();
    const matchesSearch = !searchTerm || custName.includes(searchTerm.toLowerCase()) || String(q.id).includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-blue-100 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-6 h-6 text-sky-600" />
              Sales Workspace &amp; Quotations
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Build quotations, govern discounts, surface upsell rules, and route approvals
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              title="Refresh Quotations"
              className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 transition-colors shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Create Quotation
            </button>
          </div>
        </div>

        {/* Quick Workspace Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
              statusFilter === 'ALL'
                ? 'bg-sky-50 text-sky-700 border-sky-200 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Quotations ({quotations.length})
          </button>

          <button
            onClick={() => setStatusFilter('PENDING_APPROVAL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'PENDING_APPROVAL'
                ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Waiting Approval ({quotations.filter((q) => q.status === 'PENDING_APPROVAL').length})
          </button>

          <button
            onClick={() => setStatusFilter('UNDER_NEGOTIATION')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'UNDER_NEGOTIATION'
                ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            Customer Negotiation ({quotations.filter((q) => q.status === 'UNDER_NEGOTIATION').length})
          </button>

          <button
            onClick={() => setStatusFilter('CONFIRMED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
              statusFilter === 'CONFIRMED'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Confirmed Deals ({quotations.filter((q) => q.status === 'CONFIRMED').length})
          </button>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer or Quote ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="SENT">Sent to Customer</option>
              <option value="UNDER_NEGOTIATION">Under Negotiation</option>
              <option value="CONFIRMED">Confirmed</option>
            </select>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            {error}
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 font-mono">Fetching backend quotations...</p>
          </div>
        ) : filteredQuotations.length === 0 ? (
          <div className="py-16 text-center bg-white border border-dashed border-slate-200 rounded-2xl p-8 space-y-3">
            <FileText className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-800">No Quotations Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Get started by creating your first B2B quotation for a customer.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white font-semibold text-xs rounded-xl shadow-xs hover:bg-sky-700"
            >
              <Plus className="w-3.5 h-3.5" />
              New Quotation
            </button>
          </div>
        ) : (
          /* Quotation Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuotations.map((quote) => (
              <div
                key={quote.id}
                onClick={() => navigate(`/quotations/${quote.id}`)}
                className="bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-sky-300 p-5 rounded-2xl cursor-pointer transition-all hover:shadow-md group relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono text-sky-600 font-semibold">
                        QUOTE #{quote.id}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                        {getCustomerName(quote.customerId)}
                      </h3>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${getStatusBadgeClass(
                        quote.status
                      )}`}
                    >
                      {quote.status || 'DRAFT'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Total Amount</span>
                      <span className="text-slate-900 font-bold text-sm">
                        ${Number(quote.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Discount</span>
                      <span className="text-slate-600 font-medium">
                        ${Number(quote.discountAmount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : 'Today'}
                  </span>
                  <span className="text-sky-600 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Open Builder &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Quotation Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl w-full max-w-md space-y-5 shadow-xl">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-600" />
                Create New B2B Quotation
              </h2>

              <form onSubmit={handleCreateQuotation} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Customer
                  </label>
                  <select
                    required
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="">-- Choose Customer --</option>
                    {customers.map((c) => (
                      <option key={c.id || c.dbId} value={c.id || c.dbId}>
                        {c.companyName || c.name} ({c.portalEmail || 'Customer'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Price List
                  </label>
                  <select
                    value={selectedPriceListId}
                    onChange={(e) => setSelectedPriceListId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  >
                    {priceLists.length > 0 ? (
                      priceLists.map((p) => (
                        <option key={p.id || p.dbId} value={p.id || p.dbId}>
                          {p.name || `Price List #${p.id}`}
                        </option>
                      ))
                    ) : (
                      <option value="1">Standard Commercial Price List</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={creating}
                    className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs"
                  >
                    {creating ? 'Creating...' : 'Initialize Quotation'}
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
