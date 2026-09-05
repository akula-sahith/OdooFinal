/**
 * AuditLogsPage Component
 * Immutable System Audit Log Browser at /company/admin/audit-logs
 * Strictly READ-ONLY with search, filter, and pagination.
 */

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FileSpreadsheet, Search, Lock, ShieldCheck } from 'lucide-react';
import { adminGovernanceService } from '../services/adminGovernanceService';

export function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [resultFilter, setResultFilter] = useState('ALL');

  const loadAuditLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminGovernanceService.getAuditLogs({
        search: searchTerm,
        result: resultFilter,
      });
      setLogs(res.data || []);
    } catch (e) {
      setError('Failed to load audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, [searchTerm, resultFilter]);

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
            <FileSpreadsheet className="w-7 h-7 text-teal-400" />
            Immutable Audit Trails & System Logs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Historical audit logs of platform configuration changes, governance sign-offs, and security authentication events.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 text-xs font-bold self-start sm:self-auto">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Audit Immutability Enforced</span>
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

      {/* Immutability Banner */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 text-slate-300 rounded-xl text-xs flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <span>
          <strong>Audit Compliance Requirement:</strong> Audit records are historical evidence and cannot be edited or deleted via the Admin interface. Server-side log integrity is active.
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by User, Action, or Entity ID..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Result:</span>
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-medium"
          >
            <option value="ALL">All Results</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="DENIED">DENIED</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs animate-pulse">
            Loading immutable audit logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No audit records match the current filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">User / Actor</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3 font-mono">Entity ID</th>
                  <th className="px-4 py-3 text-center">Result</th>
                  <th className="px-4 py-3 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">{log.user}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-amber-400">{log.action}</td>
                    <td className="px-4 py-3 text-slate-300">{log.entity}</td>
                    <td className="px-4 py-3 font-mono text-slate-400">{log.entityId}</td>
                    <td className="px-4 py-3 text-center font-bold">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          log.result === 'SUCCESS'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {log.result}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-500">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuditLogsPage;
