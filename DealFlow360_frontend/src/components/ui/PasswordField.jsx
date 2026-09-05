import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { FormField } from './FormField';

export const PasswordField = ({
  label,
  error,
  helperText,
  portal = 'customer',
  required = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      label={label}
      type={showPassword ? 'text' : 'password'}
      error={error}
      helperText={helperText}
      portal={portal}
      required={required}
      icon={<Lock className="w-4 h-4" />}
      suffixIcon={
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1}
          className="p-1 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
      {...props}
    />
  );
};
