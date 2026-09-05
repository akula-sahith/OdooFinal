/**
 * SecurityGovernancePage Component
 * Admin Security Monitoring & Governance at /company/admin/security
 * Displays account status, failed logins, MFA compliance, and security logs.
 */

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Lock, ShieldAlert, Key, UserX, CheckCircle } from 'lucide-react';
import { adminGovernanceService } from '../services/adminGovernanceService';
import { KpiCard } from '../../analytics/components/KpiCard';

export function SecurityGovernancePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSecurity = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminGovernanceService.getSecurityEvents();
      setData(res);
    } catch (e) {
      setError('Failed to load security governance metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSecurity();
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
            <Lock className="w-7 h-7 text-rose-400" />
            Security Governance & Monitoring
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor active staff sessions, failed authentication attempts, account lockouts, and MFA compliance.
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

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={loadSecurity} className="px-3 py-1 bg-rose-800 text-white rounded font-bold">
            Retry
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Active Sessions"
          value={data?.activeSessionsCount ?? 4}
          subtitle="Authenticated staff sessions"
          icon={Key}
          variant="purple"
        />
        <KpiCard
          title="Failed Logins Today"
          value={data?.failedLoginsToday ?? 1}
          subtitle="Denied sign-in attempts"
          icon={ShieldAlert}
          variant="amber"
        />
        <KpiCard
          title="MFA Status"
          value={data?.mfaEnforcementStatus ?? 'ENFORCED'}
          subtitle="Staff multi-factor security"
          icon={CheckCircle}
          variant="emerald"
        />
        <KpiCard
          title="Locked Accounts"
          value={data?.lockedAccounts?.length ?? 1}
          subtitle="Locked after failed attempts"
          icon={UserX}
          variant="rose"
        />
      </div>

      {/* Locked Accounts Table & Security Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <UserX className="w-5 h-5 text-rose-400" />
            Currently Locked User Accounts
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-700">
                <tr>
                  <th className="px-3 py-2">Email Address</th>
                  <th className="px-3 py-2 text-center">Attempts</th>
                  <th className="px-3 py-2 text-right">Locked Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {(data?.lockedAccounts || []).map((acc, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="px-3 py-2 font-mono text-rose-300">{acc.email}</td>
                    <td className="px-3 py-2 text-center font-bold text-amber-400">{acc.attempts}</td>
                    <td className="px-3 py-2 text-right text-slate-400">
                      {new Date(acc.lockedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-400" />
            Recent Security & Permission Audit Logs
          </h4>

          <div className="space-y-3">
            {(data?.recentSecurityLogs || []).map((log) => (
              <div key={log.id} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-white">{log.action}</span>
                  <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Actor: {log.user}</span>
                  <span className="font-mono text-rose-400">{log.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecurityGovernancePage;
