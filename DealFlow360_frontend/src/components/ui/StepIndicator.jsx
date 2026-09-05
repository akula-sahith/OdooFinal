import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const StepIndicator = ({ steps = [], currentStep = 1, portal = 'customer' }) => {
  const isCustomer = portal === 'customer';
  const activeColor = isCustomer ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#714B67] border-[#714B67] text-white';
  const activeLineColor = isCustomer ? 'bg-blue-600' : 'bg-[#714B67]';

  return (
    <div className="w-full py-1 mb-3 sm:mb-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-4 right-4 h-0.5 -translate-y-1/2 bg-slate-200 -z-0" />

        <motion.div
          className={`absolute top-1/2 left-4 h-0.5 -translate-y-1/2 ${activeLineColor} -z-0 transition-all duration-300`}
          style={{
            width: `${((currentStep - 1) / Math.max(1, steps.length - 1)) * 90}%`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <motion.div
                initial={false}
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 transition-colors duration-200 ${
                  isCompleted
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : isCurrent
                    ? `${activeColor} shadow-md`
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
              </motion.div>
              <span
                className={`mt-2 text-[10px] sm:text-xs font-semibold transition-colors ${
                  isCurrent
                    ? isCustomer
                      ? 'text-blue-700 font-bold'
                      : 'text-[#714B67] font-bold'
                    : isCompleted
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
