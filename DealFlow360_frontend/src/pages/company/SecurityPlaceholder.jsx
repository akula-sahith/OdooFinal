import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Lock, Server } from 'lucide-react';

export const SecurityPlaceholder = () => {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Platform Security Center"
        subtitle="MFA enforcement, active staff sessions, TLS encryption policy, and login parameters."
        badgeText="Security Policy Active"
        badgeVariant="plum"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#714B67]" /> Multi-Factor Authentication (MFA)
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            MFA is enforced globally for all staff roles across company portals.
          </p>
          <div className="p-3 bg-[#F7F2F5] border border-[#714B67]/20 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold text-[#714B67]">GLOBAL MFA POLICY</span>
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-[#714B67] text-white rounded-full">ENFORCED</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-[#714B67]" /> TLS & Session Security
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Secure HTTP Only cookies, AES-256 session encryption, and strict origin checks.
          </p>
          <div className="p-3 bg-[#F7F2F5] border border-[#714B67]/20 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold text-[#714B67]">TLS 1.3 ENCRYPTION</span>
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-[#714B67] text-white rounded-full">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
