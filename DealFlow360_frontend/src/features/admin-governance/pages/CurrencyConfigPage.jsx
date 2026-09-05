/**
 * CurrencyConfigPage Component
 * Organization Base Currency & Exchange Rates Configuration at /company/admin/currencies
 */

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { DollarSign, ShieldAlert, Check } from 'lucide-react';
import { EXCHANGE_RATES } from '../../analytics/types/analyticsTypes';

export function CurrencyConfigPage() {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [savedMsg, setSavedMsg] = useState('');

  const currencies = [
    { code: 'USD', name: 'United States Dollar ($)', rate: EXCHANGE_RATES.USD },
    { code: 'EUR', name: 'Euro (€)', rate: EXCHANGE_RATES.EUR },
    { code: 'GBP', name: 'British Pound (£)', rate: EXCHANGE_RATES.GBP },
    { code: 'INR', name: 'Indian Rupee (₹)', rate: EXCHANGE_RATES.INR },
    { code: 'CAD', name: 'Canadian Dollar (C$)', rate: EXCHANGE_RATES.CAD },
  ];

  const handleSaveBaseCurrency = (e) => {
    e.preventDefault();
    setSavedMsg(`Organization base currency set to ${baseCurrency}.`);
    setTimeout(() => setSavedMsg(''), 4000);
  };

  const adminNavTabs = [
    { label: 'Overview', to: '/company/admin', end: true },
    { label: 'Staff Users', to: '/company/admin/users' },
    { label: 'Roles & Matrix', to: '/company/admin/roles' },
    { label: 'Approval Rules', to: '/company/admin/approval-rules' },
    { label: 'Warehouses', to: '/company/admin/warehouses' },
    { label: 'Tax Configuration', to: '/company/admin/taxes' },
    { label: 'Currencies', to: '/company/admin/currencies' },
    { label: 'System Settings', to: '/company/admin/settings' },
    { label: 'Audit Logs', to: '/company/admin/audit-logs' },
    { label: 'Security Center', to: '/company/admin/security' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <DollarSign className="w-7 h-7 text-emerald-400" />
            Multi-Currency Governance Configuration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure organization default currency and reference conversion rates for USD aggregation.
          </p>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-2">
        {adminNavTabs.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      {savedMsg && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Warning */}
      <div className="p-4 bg-amber-950/40 border border-amber-800 text-amber-300 rounded-xl text-xs flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
        <span>
          <strong>Currency Conversion Notice:</strong> DealFlow360 prevents raw un-converted summation across currencies. Updating the base currency changes executive dashboard normalization, but historical transactional currency tags remain intact.
        </span>
      </div>

      {/* Main Base Currency Selection & Rates Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSaveBaseCurrency} className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4 text-xs">
          <h4 className="text-base font-bold text-white">Organization Default Base Currency</h4>
          <p className="text-slate-400">Select the primary currency for reporting and executive analytics.</p>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Default Currency</label>
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-semibold"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition shadow-md shadow-emerald-500/20"
          >
            Update Base Currency
          </button>
        </form>

        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4 text-xs">
          <h4 className="text-base font-bold text-white">Supported Currency Exchange Rates</h4>
          <p className="text-slate-400">Normalized reference rates against 1 USD base.</p>

          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-700">
              <tr>
                <th className="px-3 py-2">Currency Code</th>
                <th className="px-3 py-2">Currency Name</th>
                <th className="px-3 py-2 text-right">Rate (vs 1 USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {currencies.map((c) => (
                <tr key={c.code} className="hover:bg-slate-800/40">
                  <td className="px-3 py-2 font-bold text-white">{c.code}</td>
                  <td className="px-3 py-2 text-slate-400">{c.name}</td>
                  <td className="px-3 py-2 text-right font-mono font-bold text-emerald-400">{c.rate} USD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CurrencyConfigPage;
