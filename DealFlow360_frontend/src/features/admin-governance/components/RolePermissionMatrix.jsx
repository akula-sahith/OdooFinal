/**
 * RolePermissionMatrix Component
 * Interactive RBAC Matrix comparing roles against granular domain permissions.
 * Includes explicit role-change safety warning modal.
 */

import React, { useState } from 'react';
import { Shield, Check, X, AlertTriangle, Save } from 'lucide-react';

export function RolePermissionMatrix({ onSavePermissions = null }) {
  const roles = [
    { code: 'ADMIN', label: 'Administrator', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { code: 'SALES_MANAGER', label: 'Sales Manager', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { code: 'SALESPERSON', label: 'Salesperson', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { code: 'FINANCE', label: 'Finance & Billing', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { code: 'OPERATIONS', label: 'Operations & Logistics', badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
  ];

  const permissionDomains = [
    { key: 'products', label: 'Products & Categories', perm: 'products.view' },
    { key: 'pricing', label: 'Price Lists & Currency', perm: 'pricing.view' },
    { key: 'discounts', label: 'Discount Governance Tiers', perm: 'discounts.view' },
    { key: 'quotations', label: 'Quotations & Approvals', perm: 'quotations.view' },
    { key: 'orders', label: 'Order Processing', perm: 'orders.view' },
    { key: 'fulfillment', label: 'Fulfillment & Logistics', perm: 'fulfillment.view' },
    { key: 'invoices', label: 'Commercial Invoicing', perm: 'invoices.view' },
    { key: 'payments', label: 'Payments & Receivables', perm: 'payments.view' },
    { key: 'analytics', label: 'Executive Reporting & Analytics', perm: 'analytics.view' },
    { key: 'users', label: 'User & Staff Management', perm: 'users.view' },
    { key: 'roles', label: 'Role & Permission Governance', perm: 'roles.view' },
    { key: 'settings', label: 'System & Org Settings', perm: 'settings.view' },
    { key: 'audit', label: 'Immutable Audit Logs', perm: 'audit.view' },
  ];

  // Initial Matrix State
  const [matrixState, setMatrixState] = useState({
    ADMIN: { products: true, pricing: true, discounts: true, quotations: true, orders: true, fulfillment: true, invoices: true, payments: true, analytics: true, users: true, roles: true, settings: true, audit: true },
    SALES_MANAGER: { products: true, pricing: true, discounts: true, quotations: true, orders: true, fulfillment: false, invoices: false, payments: false, analytics: true, users: false, roles: false, settings: false, audit: false },
    SALESPERSON: { products: true, pricing: false, discounts: false, quotations: true, orders: true, fulfillment: false, invoices: false, payments: false, analytics: true, users: false, roles: false, settings: false, audit: false },
    FINANCE: { products: false, pricing: false, discounts: false, quotations: false, orders: true, fulfillment: false, invoices: true, payments: true, analytics: true, users: false, roles: false, settings: false, audit: false },
    OPERATIONS: { products: true, pricing: false, discounts: false, quotations: false, orders: true, fulfillment: true, invoices: false, payments: false, analytics: true, users: false, roles: false, settings: false, audit: false },
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const togglePermission = (roleCode, domainKey) => {
    if (roleCode === 'ADMIN' && domainKey === 'roles') {
      return; // Lock ADMIN role governance permission
    }

    setMatrixState((prev) => ({
      ...prev,
      [roleCode]: {
        ...prev[roleCode],
        [domainKey]: !prev[roleCode][domainKey],
      },
    }));
  };

  const handleApplyChanges = async () => {
    setSaving(true);
    try {
      if (onSavePermissions) {
        await onSavePermissions(matrixState);
      }
      setShowConfirmModal(false);
      setToastMessage('Role permissions successfully updated and enforced server-side.');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (e) {
      alert('Failed to save role permissions.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            Role-Permission Access Control Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Configure domain access policies across authorized staff roles. Changes take effect immediately upon save.
          </p>
        </div>

        <button
          onClick={() => setShowConfirmModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 transition self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          Save Matrix Changes
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300 border-collapse">
          <thead>
            <tr className="bg-slate-800/80 border-b border-slate-700">
              <th className="p-3 font-semibold text-slate-400 min-w-[200px]">Permission Domain</th>
              {roles.map((role) => (
                <th key={role.code} className="p-3 text-center min-w-[130px]">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${role.badge}`}>
                    {role.code}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {permissionDomains.map((domain) => (
              <tr key={domain.key} className="hover:bg-slate-800/40 transition">
                <td className="p-3 font-medium text-white">
                  <div>{domain.label}</div>
                  <code className="text-[10px] text-slate-500 font-mono">{domain.perm}</code>
                </td>

                {roles.map((role) => {
                  const isGranted = matrixState[role.code]?.[domain.key] ?? false;
                  const isLocked = role.code === 'ADMIN' && domain.key === 'roles';

                  return (
                    <td key={role.code} className="p-3 text-center">
                      <button
                        onClick={() => togglePermission(role.code, domain.key)}
                        disabled={isLocked}
                        className={`p-1.5 rounded-lg border transition ${
                          isGranted
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-slate-800/60 border-slate-700 text-slate-500 hover:bg-slate-800'
                        } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        title={isLocked ? 'Admin governance permission is required' : 'Click to toggle'}
                      >
                        {isGranted ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Change Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Confirm Role Permission Changes</h4>
                <p className="text-xs text-slate-400">Role-Permission Governance Warning</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Changing permissions for active roles will immediately grant or remove access rights for associated staff users. Protected routes and backend APIs will enforce these rules.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyChanges}
                disabled={saving}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 disabled:opacity-50"
              >
                {saving ? 'Saving Changes...' : 'Confirm & Save Permissions'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RolePermissionMatrix;
