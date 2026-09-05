import React from 'react';
import { Shield, Award, Percent, ChevronRight } from 'lucide-react';
import { Card } from '../../../components/ui/Card/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';

/**
 * ApprovalLevelCard Component
 * Visual card representing a single governance approval level in the chain sequence.
 */
export const ApprovalLevelCard = ({ level, onEdit, canEdit = true }) => {
  const isLevelZero = Number(level.level) === 0;

  return (
    <Card variant="default" className="p-5 hover:border-[#714B67]/40 transition-all text-left relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Level Identity & Role */}
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-sm shrink-0 shadow-xs ${
              isLevelZero
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : Number(level.level) === 1
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-rose-100 text-rose-800 border border-rose-200'
            }`}
          >
            L{level.level}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h4 className="font-heading font-extrabold text-base text-slate-900">
                {level.title || `Level ${level.level} Governance Rule`}
              </h4>
              <StatusBadge status={level.status || 'ACTIVE'} size="sm" />
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-600 flex-wrap">
              <span className="flex items-center gap-1 text-slate-700 font-bold">
                <Award className="w-3.5 h-3.5 text-[#714B67]" />
                Role: <span className="text-[#714B67]">{level.role}</span>
              </span>

              <span className="flex items-center gap-1 font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                <Percent className="w-3 h-3 text-slate-500" />
                Max Limit: {level.thresholdPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Evaluation Outcome Badge & Edit Button */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <div className="text-right hidden md:block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Governance Outcome
            </span>
            <span className="font-mono text-xs font-bold text-slate-700">
              {level.outcome}
            </span>
          </div>

          {canEdit && onEdit && (
            <button
              type="button"
              onClick={() => onEdit(level)}
              className="px-3 py-1.5 text-xs font-bold text-[#714B67] bg-[#F7F2F5] hover:bg-[#EFE4EC] border border-[#714B67]/20 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Configure Level</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Description & Trigger */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <p className="leading-relaxed">{level.description}</p>
        <span className="font-mono text-[11px] font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 shrink-0">
          Trigger: {level.triggerCondition}
        </span>
      </div>
    </Card>
  );
};

export default ApprovalLevelCard;
