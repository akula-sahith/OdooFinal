import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable Drawer Component
 * Supports left and right slide-over views with responsive mobile width.
 */
export const Drawer = ({
  isOpen = false,
  onClose,
  title,
  description,
  children,
  footer,
  position = 'right', // left | right
  size = 'md', // sm (320px) | md (400px) | lg (560px) | xl (720px)
  className = '',
}) => {
  // Lock body scroll
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

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpen && e.key === 'Escape') {
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'sm:w-80',
    md: 'sm:w-[420px]',
    lg: 'sm:w-[560px]',
    xl: 'sm:w-[720px]',
  };

  const positionClasses = {
    right: 'right-0 animate-in slide-in-from-right duration-300',
    left: 'left-0 animate-in slide-in-from-left duration-300',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
    
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300"
      />

      
      <div
        className={`fixed inset-y-0 w-full ${widthClasses[size] || widthClasses.md} bg-white shadow-2xl flex flex-col z-10 ${positionClasses[position] || positionClasses.right} ${className}`}
        role="dialog"
        aria-modal="true"
      >
    
        {(title || onClose) && (
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 shrink-0 bg-white">
            <div>
              {title && (
                <h2 className="text-lg font-bold text-slate-900 tracking-tight font-heading">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-xs text-slate-500 font-medium mt-0.5">{description}</p>
              )}
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto grow text-slate-700 text-sm">{children}</div>

        {/* Optional Footer */}
        {footer && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Drawer;
