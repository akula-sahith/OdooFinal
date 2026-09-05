/**
 * TaxConfigPage Component
 * Admin Tax Configuration at /company/admin/taxes
 */

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Percent, Plus, ShieldCheck } from 'lucide-react';
import { adminGovernanceService } from '../services/adminGovernanceService';

export function TaxConfigPage() {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    rate: 18,
    country: 'IN',
    effectiveFrom: '2026-01-01',
    effectiveTo: '2026-12-31',
  });

  const loadTaxes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGovernanceService.getTaxConfigurations();
      setTaxes(data);
    } catch (e) {
      setError('Failed to load tax configurations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTaxes();
  }, []);

  const handleCreateTax = async (e) => {
    e.preventDefault();
    if (formData.rate < 0) {
      alert('Tax rate must be greater than or equal to 0%.');
      return;
    }

    try {
      const created = await adminGovernanceService.createTaxConfiguration(formData);
      setTaxes((prev) => [...prev, created]);
      setShowModal(false);
      setFormData({
        name: '',
        code: '',
        rate: 18,
        country: 'IN',
        effectiveFrom: '2026-01-01',
        effectiveTo: '2026-12-31',
      });
    } catch (e) {
      alert('Failed to create tax configuration.');
    }
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
            <Percent className="w-7 h-7 text-amber-400" />
            Tax Configuration Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure regional tax rates, effective periods, and tax codes for future invoice calculations.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Tax Configuration
        </button>
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

      {/* Non-retroactive Warning Banner */}
      <div className="p-4 bg-blue-950/40 border border-blue-800 text-blue-300 rounded-xl text-xs flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
        <span>
          <strong>Non-Retroactive Governance Policy:</strong> Tax configuration updates do NOT modify historical commercial invoices. Existing issued invoices retain their historical tax rate calculations.
        </span>
      </div>

      {/* Taxes Table */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-700">
              <tr>
                <th className="px-4 py-3">Tax Name</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3 text-center">Rate (%)</th>
                <th className="px-4 py-3 text-center">Country / Region</th>
                <th className="px-4 py-3 text-center">Effective Period</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {taxes.map((tax) => (
                <tr key={tax.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-semibold text-white">{tax.name}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-amber-400">{tax.code}</td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-400">{tax.rate}%</td>
                  <td className="px-4 py-3 text-center text-slate-300">{tax.country}</td>
                  <td className="px-4 py-3 text-center text-slate-400">
                    {tax.effectiveFrom} to {tax.effectiveTo}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {tax.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4 text-xs">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Percent className="w-5 h-5 text-amber-400" />
              New Regional Tax Configuration
            </h4>

            <form onSubmit={handleCreateTax} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">Tax Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Standard GST 18%"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Tax Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. GST-18"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    min={0}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Effective From</label>
                  <input
                    type="date"
                    value={formData.effectiveFrom}
                    onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Effective To</label>
                  <input
                    type="date"
                    value={formData.effectiveTo}
                    onChange={(e) => setFormData({ ...formData, effectiveTo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg"
                >
                  Save Tax Config
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaxConfigPage;
