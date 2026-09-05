import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export const AlertMessage = ({
  variant = 'error',
  title,
  message,
  details,
  onDismiss,
  className = '',
}) => {
  const variantConfig = {
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
      titleColor: 'text-rose-900 font-bold',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
      titleColor: 'text-amber-900 font-bold',
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
      titleColor: 'text-emerald-900 font-bold',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
      titleColor: 'text-blue-900 font-bold',
    },
  };

  const current = variantConfig[variant] || variantConfig.error;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={`p-4 rounded-xl border flex items-start gap-3 shadow-xs ${current.bg} ${className}`}
      role="alert"
    >
      <div className="mt-0.5">{current.icon}</div>
      <div className="flex-1 text-left space-y-0.5 text-xs sm:text-sm">
        {title && <h4 className={`text-sm ${current.titleColor}`}>{title}</h4>}
        <p className="leading-relaxed opacity-95 font-medium">{message}</p>
        {details && (
          <p className="mt-1 text-xs opacity-80 font-mono bg-white/60 p-2 rounded border border-black/5">
            {details}
          </p>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-lg hover:bg-black/5 text-slate-500 hover:text-slate-800 transition-colors focus:outline-none"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};
