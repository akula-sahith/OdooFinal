import React from 'react';
import { motion } from 'framer-motion';

export const SecondaryButton = ({
  children,
  portal = 'customer',
  icon,
  fullWidth = true,
  disabled,
  className = '',
  ...props
}) => {
  const isCustomer = portal === 'customer';

  return (
    <motion.button
      whileHover={{ y: disabled ? 0 : -1, scale: disabled ? 1 : 1.008 }}
      whileTap={{ scale: disabled ? 1 : 0.985 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      disabled={disabled}
      className={`relative h-10 sm:h-11 px-4 sm:px-5 flex items-center justify-center gap-2 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-300/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${
        isCustomer ? 'focus:ring-blue-600' : 'focus:ring-[#714B67]'
      } ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="text-slate-500">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};
