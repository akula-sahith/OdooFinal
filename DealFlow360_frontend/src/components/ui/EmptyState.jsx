import React from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Layers,
  title = 'No Items Available',
  description = 'Data records will appear here when available.',
  action,
  notice = 'Module integration in progress (Phase 3). No fake business data.',
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`w-full p-8 sm:p-12 text-center rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col items-center justify-center my-4 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-100/90 border border-slate-200 flex items-center justify-center text-[#714B67] mb-4 shadow-2xs">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 mb-1">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto mb-4 leading-relaxed">
        {description}
      </p>

      {notice && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-[11px] text-slate-500 font-semibold mb-5 border border-slate-200">
          <span>{notice}</span>
        </div>
      )}

      {action && <div>{action}</div>}
    </motion.div>
  );
};
