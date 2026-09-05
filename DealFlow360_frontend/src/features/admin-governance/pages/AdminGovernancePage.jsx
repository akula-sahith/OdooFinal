/**
 * AdminGovernancePage Component
 * Main Admin Governance Hub at /company/admin
 */

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Key,
  Sliders,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  GitMerge,
  Tag,
  Warehouse,
  Percent,
  Activity,
} from 'lucide-react';

import { adminGovernanceService } from '../services/adminGovernanceService';
import { KpiCard } from '../../analytics/components/KpiCard';

export function AdminGovernancePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminGovernanceService.getGovernanceDashboard();
      setData(res);
    } catch (e) {
      setError('Failed to load governance dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

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
            <ShieldCheck className="w-7 h-7 text-purple-400" />
            Admin Governance & System Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Centralized platform configuration, user roles, governance policies, tax rates, and immutable audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold self-start sm:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>System Status: OPERATIONAL</span>
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

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={loadDashboard} className="px-3 py-1 bg-rose-800 text-white rounded font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Governance KPI Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-900/60 border border-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Total Users"
            value={data?.totalUsers ?? '—'}
            subtitle={data?.activeUsers != null ? `${data.activeUsers} Active accounts` : 'Active accounts'}
            icon={Users}
            variant="purple"
          />
          <KpiCard
            title="Configured Roles"
            value={data?.rolesCount ?? '—'}
            subtitle="RBAC security roles"
            icon={Key}
            variant="blue"
          />
          <KpiCard
            title="Approval Rules"
            value={data?.approvalRulesCount ?? '—'}
            subtitle="Active governance rules"
            icon={GitMerge}
            variant="emerald"
          />
          <KpiCard
            title="Active Price Lists"
            value={data?.activePriceLists ?? '—'}
            subtitle="Base pricing catalogs"
            icon={Tag}
            variant="amber"
          />
          <KpiCard
            title="Warehouses"
            value={data?.warehousesCount ?? '—'}
            subtitle="Fulfillment locations"
            icon={Warehouse}
            variant="default"
          />
          <KpiCard
            title="Discount Tiers"
            value={data?.discountTiersCount ?? '—'}
            subtitle="Governance discount caps"
            icon={Percent}
            variant="purple"
          />
          <KpiCard
            title="Audit Log Events"
            value={data?.auditEventCount != null ? data.auditEventCount.toLocaleString() : '—'}
            subtitle="Immutable activity trails"
            icon={FileSpreadsheet}
            variant="blue"
          />
          <KpiCard
            title="Pending Alerts"
            value={data?.pendingGovernanceIssues ?? 0}
            subtitle="Requires admin attention"
            icon={Activity}
            variant="emerald"
          />
        </div>
      )}

      {/* Recent Activity & Quick Governance Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Audit Events Stream */}
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg space-y-4">
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            Recent Governance Audit Events
          </h4>

          <div className="space-y-3">
            {(data?.recentAuditEvents || []).map((event) => (
              <div key={event.id} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-white">{event.action}</span>
                  <span className="text-[10px] text-slate-400">{new Date(event.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Actor: {event.user}</span>
                  <span className="font-mono text-emerald-400">{event.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Governance Links */}
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg space-y-4">
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            Admin Quick Management Shortcuts
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NavLink
              to="/company/admin/users"
              className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/50 flex items-center gap-3 transition group"
            >
              <Users className="w-5 h-5 text-purple-400 group-hover:scale-110 transition" />
              <div>
                <div className="text-xs font-bold text-white">Staff Users</div>
                <div className="text-[10px] text-slate-400">Manage user status & roles</div>
              </div>
            </NavLink>

            <NavLink
              to="/company/admin/roles"
              className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/50 flex items-center gap-3 transition group"
            >
              <Key className="w-5 h-5 text-blue-400 group-hover:scale-110 transition" />
              <div>
                <div className="text-xs font-bold text-white">Roles & Permissions</div>
                <div className="text-[10px] text-slate-400">RBAC permission matrix</div>
              </div>
            </NavLink>

            <NavLink
              to="/company/admin/approval-rules"
              className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/50 flex items-center gap-3 transition group"
            >
              <GitMerge className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
              <div>
                <div className="text-xs font-bold text-white">Approval Rules</div>
                <div className="text-[10px] text-slate-400">Configure discount thresholds</div>
              </div>
            </NavLink>

            <NavLink
              to="/company/admin/settings"
              className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/50 flex items-center gap-3 transition group"
            >
              <Sliders className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
              <div>
                <div className="text-xs font-bold text-white">System Settings</div>
                <div className="text-[10px] text-slate-400">Typed platform preferences</div>
              </div>
            </NavLink>

            <NavLink
              to="/company/admin/audit-logs"
              className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/50 flex items-center gap-3 transition group"
            >
              <FileSpreadsheet className="w-5 h-5 text-teal-400 group-hover:scale-110 transition" />
              <div>
                <div className="text-xs font-bold text-white">Audit Logs</div>
                <div className="text-[10px] text-slate-400">Immutable trail viewer</div>
              </div>
            </NavLink>

            <NavLink
              to="/company/admin/security"
              className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/50 flex items-center gap-3 transition group"
            >
              <Lock className="w-5 h-5 text-rose-400 group-hover:scale-110 transition" />
              <div>
                <div className="text-xs font-bold text-white">Security Center</div>
                <div className="text-[10px] text-slate-400">Account locks & MFA status</div>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminGovernancePage;
