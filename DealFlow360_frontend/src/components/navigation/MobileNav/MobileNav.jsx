import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Sidebar } from '../Sidebar/Sidebar';

export const MobileNav = ({ isOpen, onClose }) => {
  // Handle Escape key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative z-10 w-72 max-w-[80vw] h-full bg-white shadow-2xl flex flex-col"
          >
            {/* Close Button Header */}
            <div className="absolute top-3 right-3 z-20">
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <Sidebar collapsed={false} onItemClick={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
