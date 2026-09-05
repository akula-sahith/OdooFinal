/**
 * CustomerListPage Component
 * Production B2B Customer Directory at /company/customers
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Search, Plus, Building2, DollarSign, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { formatCurrencyUSD } from '../../analytics/types/analyticsTypes';

export function CustomerListPage() {
  const { id } = useParams();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const initialCustomers = [
    {
      id: 'CUST-001',
      name: 'Apex Global Logistics Ltd',
      industry: 'Supply Chain & Freight',
      contactPerson: 'Robert Sterling',
      email: 'procurement@apexlogistics.com',
      phone: '+1 (555) 234-5678',
      creditLimitUSD: 250000,
      totalSpentUSD: 145800,
      outstandingUSD: 95800,
      ordersCount: 12,
      status: 'ACTIVE',
    },
    {
      id: 'CUST-002',
      name: 'Titan Enterprise Tech Solutions',
      industry: 'Enterprise Software & Cloud',
      contactPerson: 'Amanda Vance',
      email: 'purchasing@titanenterprisetech.com',
      phone: '+1 (555) 876-5432',
      creditLimitUSD: 150000,
      totalSpentUSD: 82080,
      outstandingUSD: 82080,
      ordersCount: 8,
      status: 'ACTIVE',
    },
    {
      id: 'CUST-003',
      name: 'Nexus Global Networks Corp',
      industry: 'Telecommunications',
      contactPerson: 'Marcus Chen',
      email: 'vendor.management@nexusglobal.com',
      phone: '+1 (555) 345-6789',
      creditLimitUSD: 300000,
      totalSpentUSD: 64000,
      outstandingUSD: 0,
      ordersCount: 6,
      status: 'ACTIVE',
    },
    {
      id: 'CUST-004',
      name: 'Horizon Energy Systems',
      industry: 'Renewable Utilities',
      contactPerson: 'Elena Rostova',
      email: 'b2b@horizonenergy.com',
      phone: '+1 (555) 987-6543',
      creditLimitUSD: 100000,
      totalSpentUSD: 42000,
      outstandingUSD: 12000,
      ordersCount: 4,
      status: 'INACTIVE',
    },
  ];

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dealflow360_customers');
      let loaded = initialCustomers;
      if (saved) {
        loaded = JSON.parse(saved);
      } else {
        localStorage.setItem('dealflow360_customers', JSON.stringify(initialCustomers));
      }
      setCustomers(loaded);
      if (id) {
        const found = loaded.find((c) => c.id === id);
        if (found) setSelectedCustomer(found);
      }
    } catch (e) {
      setCustomers(initialCustomers);
    }
  }, [id]);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Users className="w-7 h-7 text-purple-400" />
            B2B Customer Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise B2B client accounts, credit limits, total revenue history, and outstanding balances.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Accounts</span>
          <div className="text-2xl font-black text-white mt-1">{customers.length} Accounts</div>
        </div>
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase">Active B2B Clients</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {customers.filter((c) => c.status === 'ACTIVE').length} Active
          </div>
        </div>
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-[11px] font-semibold text-purple-400 uppercase">Total Lifetime Sales</span>
          <div className="text-2xl font-black text-purple-400 mt-1">
            {formatCurrencyUSD(customers.reduce((s, c) => s + c.totalSpentUSD, 0))}
          </div>
        </div>
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-[11px] font-semibold text-amber-400 uppercase">Outstanding Receivables</span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {formatCurrencyUSD(customers.reduce((s, c) => s + c.outstandingUSD, 0))}
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer name, ID, or industry..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-700">
              <tr>
                <th className="px-4 py-3">Customer ID & Name</th>
                <th className="px-4 py-3">Industry</th>
                <th className="px-4 py-3">Primary Contact</th>
                <th className="px-4 py-3 text-right">Credit Limit</th>
                <th className="px-4 py-3 text-right">Total Spent</th>
                <th className="px-4 py-3 text-right">Outstanding</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-semibold text-white">
                    <div>{cust.name}</div>
                    <span className="font-mono text-[10px] text-slate-500">{cust.id}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{cust.industry}</td>
                  <td className="px-4 py-3 text-slate-300">
                    <div>{cust.contactPerson}</div>
                    <div className="text-[10px] text-slate-500">{cust.email}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-300">
                    {formatCurrencyUSD(cust.creditLimitUSD)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-400">
                    {formatCurrencyUSD(cust.totalSpentUSD)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-amber-400">
                    {formatCurrencyUSD(cust.outstandingUSD)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        cust.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {cust.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 text-xs font-medium"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-lg w-full shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white">{selectedCustomer.name}</h4>
                <span className="font-mono text-[10px] text-purple-400">{selectedCustomer.id}</span>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-800/50 rounded-xl">
                <span className="text-slate-400 text-[10px]">Industry</span>
                <div className="font-bold text-white mt-0.5">{selectedCustomer.industry}</div>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl">
                <span className="text-slate-400 text-[10px]">Contact Person</span>
                <div className="font-bold text-white mt-0.5">{selectedCustomer.contactPerson}</div>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl">
                <span className="text-slate-400 text-[10px]">Total Orders</span>
                <div className="font-bold text-white mt-0.5">{selectedCustomer.ordersCount} Orders</div>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl">
                <span className="text-slate-400 text-[10px]">Outstanding Balance</span>
                <div className="font-bold text-amber-400 mt-0.5">{formatCurrencyUSD(selectedCustomer.outstandingUSD)}</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerListPage;
