import React from 'react';
import { INVENTORY_STATUS_LABELS, INVENTORY_STATUS_VARIANTS } from '../types/inventoryTypes';

export const InventoryStatusBadge = ({ status }) => {
  const label = INVENTORY_STATUS_LABELS[status] || status;
  const variant = INVENTORY_STATUS_VARIANTS[status] || 'neutral';

  const styles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800 animate-pulse',
    danger: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 font-bold',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant] || styles.neutral}`}>
      {label}
    </span>
  );
};
