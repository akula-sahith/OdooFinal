import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import {
  Users,
  Search,
  Plus,
  Building,
  X,
  Trash2,
  Award,
} from 'lucide-react';

export const CustomersPlaceholder = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    taxId: '',
    creditLimit: '50000',
    totalPurchasedUnits: '0',
    totalOrdersAmount: '0',
  });

  const calculateTier = (amount = 0, units = 0) => {
    if (amount >= 100000 || units >= 1000) {
      return { tier: 'Enterprise Tier', discount: '15%', badgeColor: 'bg-[#F7F2F5] text-[#714B67] border-[#714B67]/30' };
    }
    if (amount >= 25000 || units >= 100) {
      return { tier: 'SMB Preferred Tier', discount: '10%', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
    return { tier: 'Standard B2B Tier', discount: '0%', badgeColor: 'bg-slate-100 text-slate-600 border-slate-200' };
  };

  // Load from Backend REST API
  useEffect(() => {
    async function fetchBackendCustomers() {
      try {
        const { customerService } = await import('../../features/customers/services/customerService');
        const res = await customerService.getCustomers();
        const list = Array.isArray(res) ? res : (res?.data || []);
        const mapped = list.map(c => ({
          id: `CUST-${c.id}`,
          companyName: c.companyName || c.name || `Customer #${c.id}`,
          contactName: c.contactName || 'Primary Contact',
          email: c.email || '',
          phone: c.phone || '',
          taxId: c.taxId || 'TAX-VALIDATED',
          totalOrdersAmount: Number(c.totalOrdersAmount || 0),
          totalPurchasedUnits: Number(c.totalPurchasedUnits || 0),
          source: 'System Account',
        }));
        setCustomers(mapped);
      } catch (e) {
        console.error('Failed fetching customers in CustomersPlaceholder:', e);
        setCustomers([]);
      }
    }
    fetchBackendCustomers();
  }, []);

  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.email) return;

    const newCustomer = {
      id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      companyName: formData.companyName,
      contactName: formData.contactName || 'Primary Contact',
      email: formData.email,
      phone: formData.phone || '+1 (555) 000-0000',
      taxId: formData.taxId || 'TAX-PENDING',
      creditLimit: parseFloat(formData.creditLimit) || 50000,
      totalOrdersAmount: parseFloat(formData.totalOrdersAmount) || 0,
      totalPurchasedUnits: parseInt(formData.totalPurchasedUnits) || 0,
      source: 'Staff Entry',
      status: 'Active',
      createdDate: new Date().toLocaleDateString(),
    };

    saveCustomers([newCustomer, ...customers]);
    setIsModalOpen(false);
    setFormData({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      taxId: '',
      creditLimit: '50000',
      totalPurchasedUnits: '0',
      totalOrdersAmount: '0',
    });
  };

  const handleSimulateOrder = (id) => {
    const updated = customers.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          totalOrdersAmount: c.totalOrdersAmount + 30000,
          totalPurchasedUnits: c.totalPurchasedUnits + 250,
        };
      }
      return c;
    });
    saveCustomers(updated);
  };

  const handleDelete = (id) => {
    saveCustomers(customers.filter((c) => c.id !== id));
  };

  const filteredCustomers = customers.filter((c) => {
    const tierInfo = calculateTier(c.totalOrdersAmount, c.totalPurchasedUnits);
    const matchesSearch =
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === 'All' ||
      (activeTab === 'Enterprise' && tierInfo.tier.includes('Enterprise')) ||
      (activeTab === 'SMB' && tierInfo.tier.includes('SMB')) ||
      (activeTab === 'Standard' && tierInfo.tier.includes('Standard'));
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="B2B Customer Directory & Automated Tiering"
        subtitle="Manage client accounts and automated tier segregation based on purchase volume."
        badgeText={`${customers.length} Accounts`}
        badgeVariant="plum"
      />

      {/* Unified Enterprise Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden space-y-4 p-6">
        {/* Tier Progression Subheader */}
        <div className="p-4 bg-[#F7F2F5] border border-[#714B67]/20 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#714B67] font-bold">
            <Award className="w-4 h-4 text-[#714B67]" />
            <span>Automated Tier Thresholds:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-700">
            <span><strong className="text-[#714B67]">Enterprise:</strong> &ge; $100k / 1,000 units (15% Off)</span>
            <span><strong className="text-slate-900">SMB Preferred:</strong> &ge; $25k / 100 units (10% Off)</span>
            <span><strong>Standard B2B:</strong> Self-Signup (0% Off)</span>
          </div>
        </div>

        {/* Toolbar: Search, Filter Tabs & Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by company name, email, tax ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {['All', 'Enterprise', 'SMB', 'Standard'].map((tab) => (
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
              <Plus className="w-4 h-4 text-white" /> Register Customer
            </button>
          </div>
        </div>

        {/* Table or Zero-State Shell */}
        {filteredCustomers.length > 0 ? (
          <div className="rounded-xl border border-slate-200/80 overflow-hidden pt-2">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Account ID</th>
                    <th className="py-3 px-4">Company Name</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Total Order Spend</th>
                    <th className="py-3 px-4">Purchased Units</th>
                    <th className="py-3 px-4">Automated Tier</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredCustomers.map((cust) => {
                    const tierInfo = calculateTier(cust.totalOrdersAmount, cust.totalPurchasedUnits);
                    return (
                      <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{cust.id}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <div>{cust.companyName}</div>
                          <div className="text-[11px] font-medium text-slate-400">{cust.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700">
                            {cust.source || 'Self-Registered'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-extrabold text-slate-900">
                          ${cust.totalOrdersAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-700">
                          {cust.totalPurchasedUnits.toLocaleString()} Units
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${tierInfo.badgeColor}`}>
                            {tierInfo.tier} ({tierInfo.discount} Off)
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleSimulateOrder(cust.id)}
                            className="px-2.5 py-1 bg-[#F7F2F5] hover:bg-[#714B67] hover:text-white text-[#714B67] text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                            title="Simulate +$30k Order"
                          >
                            + Order Volume
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(cust.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
          </div>
        ) : (
          /* Clean Zero-State Shell (NO FAKE DATA) */
          <div className="py-16 text-center space-y-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <div className="w-12 h-12 bg-[#F7F2F5] text-[#714B67] rounded-2xl flex items-center justify-center mx-auto border border-[#714B67]/20">
              <Users className="w-6 h-6 text-[#714B67]" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-sm font-extrabold text-slate-900">No B2B Customer Accounts Registered</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Customers can register on their own via the portal, or you can register a customer record manually using the button below.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#714B67] hover:bg-[#56384E] text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" /> Register B2B Account
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
                <Building className="w-5 h-5 text-[#714B67]" /> Register B2B Customer Account
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acorn Logistics Inc."
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full h-10 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full h-10 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="contact@acorn.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  Save Customer Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
