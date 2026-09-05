import React, { useState, useRef, useEffect } from 'react';

/**
 * Reusable Dropdown Component
 * Supports trigger wrapping, items with icons, separators, disabled items, and destructive actions.
 */
export const Dropdown = ({
  trigger,
  items = [], // [{ label: 'Edit', icon: EditIcon, onClick: () => {}, disabled: false, destructive: false, isSeparator: false }]
  align = 'right', // left | right
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpen && e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const alignClasses = {
    left: 'left-0 origin-top-left',
    right: 'right-0 origin-top-right',
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div onClick={() => setIsOpen((prev) => !prev)} className="inline-flex cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute mt-1.5 w-52 rounded-xl bg-white border border-slate-200/90 shadow-lg py-1 z-40 animate-in fade-in zoom-in-95 duration-150 ${alignClasses[align] || alignClasses.right} ${className}`}
          role="menu"
        >
          {items.map((item, index) => {
            if (item.isSeparator) {
              return <div key={`sep-${index}`} className="my-1 border-t border-slate-100" role="separator" />;
            }

            const Icon = item.icon;
            const isDestructive = item.destructive;
            const isDisabled = item.disabled;

            return (
              <button
                key={item.label || index}
                type="button"
                disabled={isDisabled}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isDisabled) return;
                  if (item.onClick) item.onClick();
                  setIsOpen(false);
                }}
                className={`w-full px-3.5 py-2 text-xs font-semibold flex items-center gap-2.5 transition-colors duration-150 text-left disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDestructive
                    ? 'text-rose-600 hover:bg-rose-50'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
                role="menuitem"
              >
                {Icon && <Icon className={`w-4 h-4 shrink-0 ${isDestructive ? 'text-rose-500' : 'text-slate-400'}`} />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
