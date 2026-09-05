import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const PrimaryButton = ({
  children,
  portal = 'customer',
  isLoading = false,
  loadingText = 'Processing...',
  icon,
  fullWidth = true,
  variant = 'solid',
  disabled,
  className = '',
  ...props
}) => {
  const isCustomer = portal === 'customer';

  let bgClass = isCustomer
    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/15'
    : 'bg-gradient-to-r from-[#714B67] to-[#593A51] hover:from-[#593A51] hover:to-[#452D3F] text-white shadow-purple-900/15';

  if (variant === 'danger') {
    bgClass = 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/15';
  }

  return (
    <motion.button
      whileHover={{ y: disabled || isLoading ? 0 : -1, scale: disabled || isLoading ? 1 : 1.008 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.985 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      disabled={disabled || isLoading}
      className={`relative h-10 sm:h-11 px-4 sm:px-5 flex items-center justify-center gap-2 rounded-xl font-semibold text-xs sm:text-sm shadow-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${
        isCustomer ? 'focus:ring-blue-600' : 'focus:ring-[#714B67]'
      } ${bgClass} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-white/90" />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {icon && <span className="text-white/90">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  );
};
