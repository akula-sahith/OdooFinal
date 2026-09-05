/**
 * ApprovalRulesPage Component
 * Admin Approval Rules Configuration at /company/admin/approval-rules
 */

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { GitMerge, Plus, Check, ShieldAlert, Sliders } from 'lucide-react';

import { adminGovernanceService } from '../services/adminGovernanceService';
import { formatCurrencyUSD } from '../../analytics/types/analyticsTypes';

export function ApprovalRulesPage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ruleType: 'DISCOUNT_PERCENT',
    threshold: 15,
    approvalLevel: 2,
    approverRole: 'SALES_MANAGER',
    priority: 1,
  });

  const loadRules = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGovernanceService.getApprovalRules();
      setRules(data);
    } catch (e) {
      setError('Failed to load approval rules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await adminGovernanceService.updateApprovalRuleStatus(id, nextStatus);
      setRules((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
      );
    } catch (e) {
      alert('Failed to update approval rule status.');
    }
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();
    try {
      const created = await adminGovernanceService.createApprovalRule(formData);
      setRules((prev) => [...prev, created]);
      setShowModal(false);
      setFormData({
        name: '',
        description: '',
        ruleType: 'DISCOUNT_PERCENT',
        threshold: 15,
        approvalLevel: 2,
        approverRole: 'SALES_MANAGER',
        priority: 1,
      });
    } catch (e) {
      alert('Failed to create approval rule.');
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
            <GitMerge className="w-7 h-7 text-emerald-400" />
            Approval Rule Governance Configuration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure automated escalation thresholds for discounts, high-value quotations, and commercial sign-offs.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New Approval Rule
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

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={loadRules} className="px-3 py-1 bg-rose-800 text-white rounded font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Rules Table */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-700">
              <tr>
                <th className="px-4 py-3">Priority & Rule Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 text-center">Threshold</th>
                <th className="px-4 py-3 text-center">Level</th>
                <th className="px-4 py-3">Approver Role</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-slate-400 border border-slate-700">
                        P{rule.priority}
                      </span>
                      <span>{rule.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{rule.description}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-blue-400">{rule.ruleType}</td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-400">
                    {rule.ruleType === 'DISCOUNT_PERCENT'
                      ? `> ${rule.threshold}%`
                      : `> ${formatCurrencyUSD(rule.threshold)}`}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-300">Level {rule.approvalLevel}</td>
                  <td className="px-4 py-3 font-semibold text-purple-400">{rule.approverRole}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rule.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {rule.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleToggleStatus(rule.id, rule.status)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
                    >
                      Toggle {rule.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Approval Rule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-lg w-full shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-emerald-400" />
              Configure Approval Governance Rule
            </h4>

            <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Rule Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Executive Discount Approval"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe when this rule triggers"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Rule Type</label>
                  <select
                    value={formData.ruleType}
                    onChange={(e) => setFormData({ ...formData, ruleType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="DISCOUNT_PERCENT">Discount Percent (%)</option>
                    <option value="QUOTATION_VALUE">Quotation Total Value ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Threshold</label>
                  <input
                    type="number"
                    value={formData.threshold}
                    onChange={(e) => setFormData({ ...formData, threshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Approver Role</label>
                  <select
                    value={formData.approverRole}
                    onChange={(e) => setFormData({ ...formData, approverRole: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="SALESPERSON">Salesperson</option>
                    <option value="SALES_MANAGER">Sales Manager</option>
                    <option value="FINANCE">Finance</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Priority Rank (1 = highest)</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    min={1}
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
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg"
                >
                  Save Governance Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApprovalRulesPage;
