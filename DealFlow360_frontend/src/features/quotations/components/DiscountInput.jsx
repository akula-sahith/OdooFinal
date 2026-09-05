import React from 'react';
import { Percent, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Input } from '../../../components/ui/Input/Input';

/**
 * DiscountInput Component
 * Allows salespeople to specify discount percentages with real-time authority feedback.
 */
export const DiscountInput = ({
  value = 0,
  onChange,
  maxAuthorized = 5,
  governanceResult = null,
  disabled = false,
  label = 'Requested Commercial Discount (%)',
  className = '',
}) => {
  const handleDiscountChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      onChange(0);
      return;
    }

    const num = Number(val);
    if (isNaN(num) || num < 0 || !isFinite(num)) return;
    if (num > 100) return; // Cap maximum discount at 100%

    onChange(num);
  };

  const decision = governanceResult?.governanceDecision;

  return (
    <div className={`space-y-1.5 text-left ${className}`}>
      <label className="block text-xs font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative flex items-center">
        <Input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={value === 0 && !disabled ? '' : value}
          onChange={handleDiscountChange}
          placeholder="0.00"
          disabled={disabled}
          className="pr-8 text-xs font-semibold font-mono"
        />
        <span className="absolute right-3 text-xs font-bold text-slate-400 pointer-events-none">
          %
        </span>
      </div>

      {/* Real-Time Authority Feedback Helper Text */}
      {governanceResult && (
        <div className="text-[11px] pt-1">
          {decision === 'WITHIN_AUTHORITY' && (
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
              ✓ Within your authorized discount limit ({maxAuthorized}%).
            </span>
          )}

          {decision === 'PENDING_MANAGER_APPROVAL' && (
            <span className="text-amber-700 font-semibold flex items-center gap-1.5">
              <AlertTriangle size={13} className="text-amber-600 shrink-0" />
              ⚠ Sales Manager approval required.
            </span>
          )}

          {decision === 'PENDING_FINANCE_APPROVAL' && (
            <span className="text-purple-700 font-semibold flex items-center gap-1.5">
              <ShieldAlert size={13} className="text-purple-600 shrink-0" />
              ⚠ Finance / Operations approval required.
            </span>
          )}

          {decision === 'REJECTED_BY_POLICY' && (
            <span className="text-rose-700 font-semibold flex items-center gap-1.5">
              <ShieldAlert size={13} className="text-rose-600 shrink-0" />
              ⛔ Exceeds maximum governance threshold permitted by policy.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
