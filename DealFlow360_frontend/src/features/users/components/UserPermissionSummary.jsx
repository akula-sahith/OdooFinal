import React from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { PERMISSION_GROUPS } from '../../permissions/types/permissionTypes';

/**
 * UserPermissionSummary Component
 * Displays effective RBAC permissions granted to a staff user via their security role.
 */
export const UserPermissionSummary = ({
  roleName = 'Assigned Role',
  effectivePermissions = [],
}) => {
  const userPermissionSet = new Set(effectivePermissions);

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#714B67]" />
            Effective RBAC Capabilities & Access Controls
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Permissions active for this user account via the{' '}
            <span className="font-semibold text-slate-800">{roleName}</span> security role.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-[#714B67] text-xs font-bold font-mono">
          {effectivePermissions.length} Active Permissions
        </div>
      </div>

      {effectivePermissions.length === 0 ? (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
          This user has no active fine-grained permissions assigned.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PERMISSION_GROUPS.map((group) => {
            const groupPermissions = group.permissions;
            const grantedInGroup = groupPermissions.filter((p) => userPermissionSet.has(p.key));
            if (grantedInGroup.length === 0) return null;

            return (
              <div key={group.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>{group.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono font-normal">
                    {grantedInGroup.length} / {groupPermissions.length}
                  </span>
                </h4>
                <div className="space-y-1.5 mt-3">
                  {groupPermissions.map((perm) => {
                    const isGranted = userPermissionSet.has(perm.key);
                    return (
                      <div
                        key={perm.key}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isGranted
                            ? 'bg-white border border-emerald-200 text-slate-800 shadow-2xs'
                            : 'text-slate-400 opacity-60'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isGranted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                          )}
                          <span>{perm.label}</span>
                        </span>
                        <code className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {perm.key}
                        </code>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserPermissionSummary;
