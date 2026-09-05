import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Sliders, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../../hooks/auth/useAuth';

export const UserMenu = () => {
  const { user, role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100/80 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#714B67]/20"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-9 h-9 rounded-full bg-[#714B67] text-white font-bold text-xs flex items-center justify-center shadow-2xs border border-slate-200">
          {user?.fullName?.charAt(0) || 'U'}
        </div>

        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-bold text-slate-900 leading-tight">
            {user?.fullName || 'Rahul Kumar'}
          </span>
          <span className="text-[10px] font-semibold text-[#714B67]">
            {role || 'Company Staff'}
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200/90 shadow-xl py-2 z-50 text-slate-900"
          >
            {/* User Details */}
            <div className="px-4 py-2.5 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-900 truncate">
                {user?.fullName || 'Rahul Kumar'}
              </p>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                {user?.email || 'staff@company.com'}
              </p>
              <div className="mt-1.5 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#F7F2F5] text-[#714B67] border border-[#714B67]/20">
                Role: {role || 'Staff'}
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                to="/company/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#F7F2F5] hover:text-[#714B67] transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>My Profile (Read-Only)</span>
              </Link>

              <Link
                to="/company/security"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#F7F2F5] hover:text-[#714B67] transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>Security Center</span>
              </Link>

              <Link
                to="/company/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#F7F2F5] hover:text-[#714B67] transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                <span>Preferences</span>
              </Link>
            </div>

            {/* Logout Action */}
            <div className="pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
