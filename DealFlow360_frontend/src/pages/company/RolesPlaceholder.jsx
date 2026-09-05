import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { CheckCircle2, Key } from 'lucide-react';

export const RolesPlaceholder = () => {
  const roles = [
    {
      id: 'role_admin',
      name: 'Admin',
      description: 'Full system authorization across all company modules, user provisioning, security, and global settings.',
      usersCount: 1,
      clearance: 'Level 4 - Full System Master',
      permissions: [
        'dashboard.view', 'customers.view', 'customers.manage',
        'users.view', 'users.manage', 'roles.view', 'roles.manage',
        'products.view', 'products.manage', 'pricing.view', 'pricing.manage',
        'quotations.view', 'quotations.manage', 'approvals.view', 'approvals.manage',
        'orders.view', 'orders.manage', 'security.view', 'audit_logs.view',
        'settings.view', 'settings.manage'
      ],
    },
    {
      id: 'role_manager',
      name: 'Sales Manager',
      description: 'Departmental authority over quotations, high-discount approvals, order overrides, and team accounts.',
      usersCount: 1,
      clearance: 'Level 3 - Managerial Supervision',
      permissions: [
        'dashboard.view', 'customers.view', 'customers.manage',
        'users.view', 'products.view', 'pricing.view',
        'quotations.view', 'quotations.manage', 'approvals.view',
        'orders.view', 'orders.manage'
      ],
    },
    {
      id: 'role_sales',
      name: 'Salesperson',
      description: 'Operational access to create draft proposals, register B2B client accounts, look up product SKUs, and view assigned orders.',
      usersCount: 1,
      clearance: 'Level 2 - Regional B2B Access',
      permissions: [
        'dashboard.view', 'customers.view', 'products.view',
        'quotations.view', 'orders.view'
      ],
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="RBAC Security Roles & Permission Matrix"
        subtitle="Configure role-based access control (RBAC) rules, clearance levels, and operational scope."
        badgeText="3 Security Roles"
        badgeVariant="plum"
      />

      <div className="space-y-4">
        {roles.map((r) => (
          <div key={r.id} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-extrabold text-slate-900">{r.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#F7F2F5] text-[#714B67] border border-[#714B67]/30">
                    {r.clearance}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{r.description}</p>
              </div>

              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl shrink-0">
                {r.usersCount} Staff Assigned
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#714B67]" /> Granted Permissions ({r.permissions.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {r.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold bg-slate-50 text-slate-700 border border-slate-200/80"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#714B67]" /> {perm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
