import React from 'react';
import { ShieldCheck, Building2, Hash, Calendar, Key, Lock } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';

/**
 * CustomerAccountSummary Component
 * Renders account status badge, customer ID, company metadata, and security parameters.
 */
export const CustomerAccountSummary = ({ profile = {} }) => {
  const status = profile.accountStatus || 'ACTIVE';
  const customerId = profile.customerId || 'CUST-001';

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-6 text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-100 border border-purple-200 text-[#714B67] flex items-center justify-center font-extrabold text-lg">
            {profile.companyName ? profile.companyName[0] : 'C'}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{profile.companyName || 'Enterprise Customer'}</h3>
            <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              Account ID: {customerId}
            </p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
          <span className="text-slate-400 font-semibold block mb-1">Primary Procurement Email</span>
          <span className="font-bold text-slate-800 font-mono">{profile.email || 'N/A'}</span>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
          <span className="text-slate-400 font-semibold block mb-1">Account Member Since</span>
          <span className="font-bold text-slate-800">
            {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-[#714B67]" />
          Account Security & Credentials
        </h4>
        <div className="p-3 bg-purple-50/60 border border-purple-200/60 rounded-xl text-xs text-slate-700 flex items-center justify-between">
          <span className="font-medium flex items-center gap-2">
            <Key className="w-4 h-4 text-[#714B67]" />
            Password & Multi-Factor Authentication
          </span>
          <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
            Protected
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccountSummary;
