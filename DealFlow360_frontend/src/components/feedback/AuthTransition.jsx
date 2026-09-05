import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2 } from 'lucide-react';

export const AuthTransition = ({
  message = 'Preparing your enterprise workspace...',
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col items-center justify-center p-6 selection:bg-teal-500 selection:text-white">
      {/* Background radial gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 pointer-events-none opacity-40">
        <div className="absolute -top-10 left-1/3 w-72 h-72 bg-purple-100/70 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/3 w-64 h-64 bg-teal-100/60 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 text-center space-y-5 max-w-sm"
      >
        {/* DealFlow360 Brand Symbol */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-white border border-purple-200 shadow-lg flex items-center justify-center text-[#714B67]">
          <ShieldCheck className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <h2 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">
            DEALFLOW360
          </h2>
          <p className="text-xs font-bold uppercase tracking-wider text-[#00A09D]">
            Enterprise B2B Platform
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2 text-xs font-semibold text-slate-600 bg-white/80 px-4 py-2 rounded-full border border-slate-200 shadow-2xs backdrop-blur-xs">
          <Loader2 className="w-4 h-4 animate-spin text-[#714B67]" />
          <span>{message}</span>
        </div>
      </motion.div>
    </div>
  );
};
