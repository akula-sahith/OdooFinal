import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Inbox } from 'lucide-react';

export const NotificationButton = ({ unreadCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#714B67]/20"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200/90 shadow-xl py-3 z-50 text-slate-900"
          >
            {/* Header */}
            <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-bold text-sm text-slate-900">
                  Notifications
                </h4>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => alert('Marking all notifications as read...')}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            </div>

            {/* Notification Body - API Ready Empty State */}
            <div className="p-6 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Inbox className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-900">No New Notifications</p>
              <p className="text-[11px] text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                Real-time alerts for quotation approvals, new orders, and system security events will appear here when connected to backend webhooks.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
