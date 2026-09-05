import React from 'react';
import { Check, X, Shield } from 'lucide-react';
import { PERMISSION_GROUPS } from '../../permissions/types/permissionTypes';

/**
 * RolePermissionSummary Component
 * Renders categorized capability badges grouped by business module.
 */
export const RolePermissionSummary = ({ permissions = [], showUnassigned = true }) => {
  const permSet = new Set(permissions);

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h4 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#714B67]" />
            Effective Capability Breakdown
          </h4>
          <p className="text-xs text-slate-500">
            Categorized action permissions inherited by users assigned to this security role.
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          {permissions.length} Active Grants
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PERMISSION_GROUPS.map((group) => {
          const grantedInGroup = group.permissions.filter((p) => permSet.has(p.key));
          const unassignedInGroup = group.permissions.filter((p) => !permSet.has(p.key));

          if (grantedInGroup.length === 0 && !showUnassigned) return null;

          return (
            <div key={group.id} className="p-4 bg-slate-50/60 border border-slate-200/80 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 tracking-wider uppercase">
                  {group.title}
                </span>
                <span className="text-[11px] font-mono font-semibold text-slate-500">
                  {grantedInGroup.length}/{group.permissions.length} Enabled
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {grantedInGroup.map((p) => (
                  <span
                    key={p.key}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold"
                  >
                    <Check className="w-3 h-3 text-emerald-600 shrink-0 stroke-[3]" />
                    {p.label}
                  </span>
                ))}

                {showUnassigned &&
                  unassignedInGroup.map((p) => (
                    <span
                      key={p.key}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100/70 text-slate-400 border border-slate-200/60 rounded-lg text-[11px] font-normal line-through opacity-70"
                    >
                      <X className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                      {p.label}
                    </span>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RolePermissionSummary;
