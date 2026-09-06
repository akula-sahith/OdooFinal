import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import {
  FileText,
  Search,
  Plus,
  X,
  Trash2,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const QuotationsPlaceholder = () => {
  const [quotations, setQuotations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    title: '',
    subtotal: '12500',
    discountPct: '10',
    validDays: '30',
  });

  // Load from Backend REST API
  useEffect(() => {
    async function fetchBackendQuotations() {
      try {
        const { quotationService } = await import('../../features/quotations/services/quotationService');
        const res = await quotationService.getQuotations();
        const list = Array.isArray(res) ? res : (res?.data || []);
        const mapped = list.map(q => ({
          id: q.quotationNumber || `QT-${q.id}`,
          title: q.title || `Commercial Quotation #${q.id}`,
          customerName: q.customerName || `Customer #${q.customerId}`,
          discountPct: Number(q.totalDiscount || 0),
          totalAmount: Number(q.grandTotal || q.totalAmount || 0),
          status: q.status || 'Draft',
        }));
        setQuotations(mapped);
      } catch (e) {
        console.error('Failed fetching quotations in QuotationsPlaceholder:', e);
        setQuotations([]);
      }
    }
    fetchBackendQuotations();
  }, []);

  const handleCreateQuotation = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.title) return;

    const sub = parseFloat(formData.subtotal) || 10000;
    const disc = parseFloat(formData.discountPct) || 0;
    const total = sub * (1 - disc / 100);

    const expDate = new Date();
    expDate.setDate(expDate.getDate() + (parseInt(formData.validDays) || 30));

    const newQuote = {
      id: `QT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: formData.customerName,
      title: formData.title,
      subtotal: sub,
      discountPct: disc,
      totalAmount: total,
      status: disc > 15 ? 'Pending Approval' : 'Approved',
      createdDate: new Date().toLocaleDateString(),
      expiryDate: expDate.toLocaleDateString(),
    };

    saveQuotations([newQuote, ...quotations]);
    setIsModalOpen(false);
    setFormData({
      customerName: '',
      title: '',
      subtotal: '12500',
      discountPct: '10',
      validDays: '30',
    });
  };

  const handleDelete = (id) => {
    saveQuotations(quotations.filter((q) => q.id !== id));
  };

  const filteredQuotations = quotations.filter((q) => {
    const matchesSearch =
      q.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || q.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="B2B Sales Quotations"
        subtitle="Generate pricing proposals, calculate discount rules, and manage approval queues."
        badgeText={`${quotations.length} Proposals`}
        badgeVariant="plum"
      />

      {/* Unified Enterprise Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden space-y-4 p-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by quote #, client name, proposal title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {['All', 'Approved', 'Pending Approval'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab ? 'bg-[#714B67] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="h-9 px-4 bg-[#714B67] hover:bg-[#56384E] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-white" /> Create Quotation
            </button>
          </div>
        </div>

        {/* Data Table or Zero State */}
        {filteredQuotations.length > 0 ? (
          <div className="rounded-xl border border-slate-200/80 overflow-hidden pt-2">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Quote Number</th>
                    <th className="py-3 px-4">Proposal Title</th>
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Discount</th>
                    <th className="py-3 px-4">Grand Total</th>
                    <th className="py-3 px-4">Approval Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredQuotations.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#714B67]">{q.id}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{q.title}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{q.customerName}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-600">{q.discountPct}%</td>
                      <td className="py-3 px-4 font-extrabold text-slate-900">${q.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            q.status === 'Approved'
                              ? 'bg-[#F7F2F5] text-[#714B67] border border-[#714B67]/30'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {q.status === 'Approved' ? <CheckCircle2 className="w-3 h-3 text-[#714B67]" /> : <Clock className="w-3 h-3" />}
                          {q.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(q.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Clean Zero State Shell */
          <div className="py-16 text-center space-y-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <div className="w-12 h-12 bg-[#F7F2F5] text-[#714B67] rounded-2xl flex items-center justify-center mx-auto border border-[#714B67]/20">
              <FileText className="w-6 h-6 text-[#714B67]" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-sm font-extrabold text-slate-900">No Sales Quotations Created</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Generate B2B pricing proposals with automated discount calculations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#714B67] hover:bg-[#56384E] text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" /> Create Sales Quotation
            </button>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#714B67]" /> Create B2B Sales Quotation
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuotation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer / Account Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Global Logistics"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full h-10 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Proposal Title / Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Hardware Q3 Agreement"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-10 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Base Amount ($USD)</label>
                  <input
                    type="number"
                    placeholder="12500"
                    value={formData.subtotal}
                    onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                    className="w-full h-10 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Discount (%)</label>
                  <input
                    type="number"
                    placeholder="10"
                    value={formData.discountPct}
                    onChange={(e) => setFormData({ ...formData, discountPct: e.target.value })}
                    className="w-full h-10 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#714B67] hover:bg-[#56384E] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Generate Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
