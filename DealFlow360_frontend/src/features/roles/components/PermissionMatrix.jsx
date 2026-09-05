import React from 'react';
import { Check, Shield, Lock } from 'lucide-react';
import { PERMISSION_GROUPS } from '../../permissions/types/permissionTypes';

/**
 * PermissionMatrix Component
 * Interactive RBAC capability assignment matrix grouped by enterprise modules.
 */
export const PermissionMatrix = ({
  selectedPermissions = [],
  onChange,
  readOnly = false,
}) => {
  const selectedSet = new Set(selectedPermissions);

  const handleTogglePermission = (permKey) => {
    if (readOnly) return;
    const nextSet = new Set(selectedSet);
    if (nextSet.has(permKey)) {
      nextSet.delete(permKey);
    } else {
      nextSet.add(permKey);
    }
    onChange(Array.from(nextSet));
  };

  const handleToggleGroup = (group) => {
    if (readOnly) return;
    const groupKeys = group.permissions.map((p) => p.key);
    const allSelected = groupKeys.every((k) => selectedSet.has(k));

    const nextSet = new Set(selectedSet);
    if (allSelected) {
      groupKeys.forEach((k) => nextSet.delete(k));
    } else {
      groupKeys.forEach((k) => nextSet.add(k));
    }
    onChange(Array.from(nextSet));
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h4 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#714B67]" />
            Module Permission Capabilities Matrix
          </h4>
          <p className="text-xs text-slate-500">
            Grant or revoke granular action capabilities across DealFlow360 business modules.
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-[#714B67] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          {selectedPermissions.length} Capabilities Assigned
        </span>
      </div>

      <div className="space-y-5">
        {PERMISSION_GROUPS.map((group) => {
          const groupKeys = group.permissions.map((p) => p.key);
          const assignedCount = groupKeys.filter((k) => selectedSet.has(k)).length;
          const isAllGroupSelected = groupKeys.length > 0 && assignedCount === groupKeys.length;

          return (
            <div
              key={group.id}
              className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs transition-all hover:border-slate-300"
            >
              {/* Group Header */}
              <div className="p-3.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs text-slate-900 tracking-wider uppercase">
                    {group.title}
                  </h5>
                  <p className="text-xs text-slate-500 font-normal">{group.description}</p>
                </div>

                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => handleToggleGroup(group)}
                    className="text-xs font-bold text-[#714B67] hover:text-[#5A3B52] bg-white px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {isAllGroupSelected ? 'Deselect Group' : 'Select All'}
                  </button>
                )}
              </div>

              {/* Permission Items Grid */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.permissions.map((perm) => {
                  const isChecked = selectedSet.has(perm.key);
                  return (
                    <div
                      key={perm.key}
                      onClick={() => !readOnly && handleTogglePermission(perm.key)}
                      className={`p-3 rounded-xl border transition-all flex items-start gap-3 select-none ${
                        readOnly
                          ? 'cursor-default'
                          : 'cursor-pointer hover:border-[#714B67]/40'
                      } ${
                        isChecked
                          ? 'bg-purple-50/40 border-[#714B67]/40'
                          : 'bg-white border-slate-200/80'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isChecked
                            ? 'bg-[#714B67] border-[#714B67] text-white'
                            : 'bg-white border-slate-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className="space-y-0.5 text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900">
                            {perm.label}
                          </span>
                          <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                            {perm.action}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          {perm.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PermissionMatrix;
