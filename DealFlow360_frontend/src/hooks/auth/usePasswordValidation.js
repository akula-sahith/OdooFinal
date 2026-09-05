import { useMemo } from 'react';

export function usePasswordValidation(password = '') {
  return useMemo(() => {
    const rules = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    };

    const score = Object.values(rules).filter(Boolean).length;
    const isValid = score === 5;

    let strengthLabel = 'Weak';
    let strengthColor = 'bg-rose-500';

    if (score <= 2) {
      strengthLabel = 'Weak';
      strengthColor = 'bg-rose-500';
    } else if (score === 3) {
      strengthLabel = 'Fair';
      strengthColor = 'bg-amber-500';
    } else if (score === 4) {
      strengthLabel = 'Good';
      strengthColor = 'bg-blue-500';
    } else if (score === 5) {
      strengthLabel = password.length >= 12 ? 'Very Strong' : 'Strong';
      strengthColor = 'bg-emerald-500';
    }

    return {
      rules,
      score,
      isValid,
      strengthLabel,
      strengthColor,
    };
  }, [password]);
}
