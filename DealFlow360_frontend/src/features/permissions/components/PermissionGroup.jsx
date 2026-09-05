import React from 'react';
import { Shield, Key } from 'lucide-react';

/**
 * PermissionGroup Component
 * Renders a domain permission module block with capability definitions and action tokens.
 */
export const PermissionGroup = ({ group }) => {
  if (!group || !group.permissions || group.permissions.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#714B67]" />
            {group.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{group.description}</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#714B67] text-xs font-mono font-bold">
          {group.permissions.length} Tokens
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {group.permissions.map((perm) => (
          <div
            key={perm.key}
            className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 px-2 rounded-lg transition-colors"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 text-xs sm:text-sm">{perm.label}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                  {perm.action}
                </span>
              </div>
              <p className="text-xs text-slate-500">{perm.description}</p>
            </div>

            <div className="shrink-0 flex items-center gap-1.5 self-start sm:self-center">
              <Key className="w-3.5 h-3.5 text-[#714B67]" />
              <code className="text-xs font-mono font-bold text-[#714B67] bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg">
                {perm.key}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionGroup;
