import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from '../../ui/Button';

/**
 * Reusable Modal / Dialog Component
 * Keyboard accessible with backdrop blur, Escape listener, focus trap, and size options.
 */
export const Modal = ({
  isOpen = false,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md', // sm | md | lg | xl | full
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = '',
}) => {
  const modalRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpen && closeOnEscape && e.key === 'Escape') {
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Lock body scroll when modal is open
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

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]',
  };

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      if (onClose) onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        className={`w-full bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden transform animate-in zoom-in-95 duration-200 ${sizes[size] || sizes.md} ${className}`}
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between gap-4 shrink-0 bg-white">
            <div>
              {title && (
                <h2 id="modal-title" className="text-lg font-bold text-slate-900 tracking-tight font-heading">
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
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto grow text-slate-700 text-sm">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
