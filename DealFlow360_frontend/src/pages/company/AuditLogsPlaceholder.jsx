import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { FileSpreadsheet } from 'lucide-react';

export const AuditLogsPlaceholder = () => {
  const logs = [];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Immutable System Audit Logs"
        subtitle="Audit records of user actions, permission updates, quotation approvals, and security events."
        badgeText="Immutable Log Store"
        badgeVariant="plum"
      />

      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden p-6 space-y-4">
        {logs.length > 0 ? (
          <div className="rounded-xl border border-slate-200/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Log ID</th>
                    <th className="py-3 px-4">Actor / Account</th>
                    <th className="py-3 px-4">Action Description</th>
                    <th className="py-3 px-4">Target Resource</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Origin IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {logs.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#714B67]">{l.id}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{l.actor}</td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{l.action}</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700">{l.resource}</span></td>
                      <td className="py-3 px-4 text-slate-500 font-medium">{l.timestamp}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{l.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Clean Zero State Shell */
          <div className="py-16 text-center space-y-3 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <div className="w-12 h-12 bg-[#F7F2F5] text-[#714B67] rounded-2xl flex items-center justify-center mx-auto border border-[#714B67]/20">
              <FileSpreadsheet className="w-6 h-6 text-[#00A09D]" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-sm font-extrabold text-slate-900">No System Audit Logs</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                System events and authentication activity will populate this audit trail.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
