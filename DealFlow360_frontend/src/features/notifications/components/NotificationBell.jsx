import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, ExternalLink } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationList } from './NotificationList';

/**
 * NotificationBell Component
 * Header bell icon button with real unread count badge and notification dropdown popover.
 */
export const NotificationBell = ({ userType = 'CUSTOMER' }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications(userType);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewAll = () => {
    setIsOpen(false);
    const targetPage = userType === 'SALESPERSON' ? '/company/notifications' : '/customer/notifications';
    navigate(targetPage);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-xl text-slate-400 hover:text-white sm:hover:text-slate-900 hover:bg-slate-800 sm:hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#714B67]/30"
        title="View Notifications"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
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
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200/90 shadow-xl py-3 z-50 text-slate-900 text-left"
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
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] font-semibold text-[#714B67] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* List */}
            <NotificationList
              notifications={notifications}
              loading={loading}
              userType={userType}
              onMarkAsRead={markAsRead}
              onCloseDropdown={() => setIsOpen(false)}
            />

            {/* Footer link to view full notifications page */}
            <div className="px-4 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleViewAll}
                className="text-xs font-bold text-[#714B67] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>View all notifications</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
