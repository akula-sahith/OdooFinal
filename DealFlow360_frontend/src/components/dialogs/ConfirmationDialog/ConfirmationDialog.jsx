import React from 'react';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import Modal from '../Modal/Modal';
import Button from '../../ui/Button';

/**
 * Reusable ConfirmationDialog Component
 * Supports standard, info, and destructive action confirmations with loading states.
 */
export const ConfirmationDialog = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed with this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // danger | primary | success | info
  isLoading = false,
  error = null,
}) => {
  const iconMap = {
    danger: <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />,
    primary: <Info className="w-6 h-6 text-[#714B67] shrink-0" />,
    success: <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />,
    info: <Info className="w-6 h-6 text-blue-600 shrink-0" />,
  };

  const bgMap = {
    danger: 'bg-rose-50 border-rose-100',
    primary: 'bg-[#F7F2F5] border-[#714B67]/20',
    success: 'bg-emerald-50 border-emerald-100',
    info: 'bg-blue-50 border-blue-100',
  };

  const buttonVariantMap = {
    danger: 'danger',
    primary: 'primary',
    success: 'success',
    info: 'primary',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? undefined : onClose}
      size="sm"
      closeOnBackdrop={!isLoading}
      closeOnEscape={!isLoading}
    >
      <div className="space-y-4 text-left">
        <div className="flex items-start gap-3.5">
          <div className={`p-3 rounded-xl border ${bgMap[variant] || bgMap.danger}`}>
            {iconMap[variant] || iconMap.danger}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {description}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-medium">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={buttonVariantMap[variant] || 'danger'}
            size="md"
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
