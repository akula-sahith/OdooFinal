import React from 'react';
import { Check, X } from 'lucide-react';
import { usePasswordValidation } from '../../hooks/auth/usePasswordValidation';

export const PasswordStrength = ({ password = '' }) => {
  const { rules, score, strengthLabel, strengthColor } = usePasswordValidation(password);

  if (!password) return null;

  const checklistItems = [
    { label: 'Minimum 8 characters', met: rules.minLength },
    { label: 'Uppercase letter (A-Z)', met: rules.hasUppercase },
    { label: 'Lowercase letter (a-z)', met: rules.hasLowercase },
    { label: 'Number (0-9)', met: rules.hasNumber },
    { label: 'Special character (!@#$%^&*)', met: rules.hasSpecialChar },
  ];

  return (
    <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-left">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600 font-medium">Password strength:</span>
        <span className={`font-bold ${score >= 4 ? 'text-emerald-600' : score === 3 ? 'text-amber-600' : 'text-rose-600'}`}>
          {strengthLabel}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-full transition-all duration-300 rounded-full ${
              level <= score ? strengthColor : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
        {checklistItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-xs">
            {item.met ? (
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 shrink-0 font-bold">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            ) : (
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 text-slate-400 shrink-0">
                <X className="w-2.5 h-2.5 stroke-[2.5]" />
              </span>
            )}
            <span className={item.met ? 'text-slate-800 font-medium' : 'text-slate-500'}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
