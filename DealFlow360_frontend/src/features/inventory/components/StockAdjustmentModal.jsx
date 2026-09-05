import React, { useState, useEffect } from 'react';
import { Sliders, X, AlertCircle } from 'lucide-react';
import { validateStockAdjustment } from '../validation/inventoryValidation';

export const StockAdjustmentModal = ({
  isOpen,
  onClose,
  onConfirm,
  stockRecord = null,
  submitting = false,
  error = null,
}) => {
  const [quantityChange, setQuantityChange] = useState('');
  const [reason, setReason] = useState('');
  const [reference, setReference] = useState('');
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    setQuantityChange('');
    setReason('');
    setReference('');
    setValidationError(null);
  }, [isOpen, stockRecord]);

  if (!isOpen || !stockRecord) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;

    const check = validateStockAdjustment({
      productId: stockRecord.productId,
      warehouseId: stockRecord.warehouseId,
      quantityChange,
      reason,
    });

    if (!check.isValid) {
      setValidationError(check.error);
      return;
    }

    setValidationError(null);
    onConfirm({
      productId: stockRecord.productId,
      warehouseId: stockRecord.warehouseId,
      quantityChange: Number(quantityChange),
      reason: reason.trim(),
      reference: reference.trim(),
    });
  };

  const calculatedNewOnHand = stockRecord.onHandQuantity + (Number(quantityChange) || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
            <Sliders className="w-5 h-5" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Adjust Physical Stock</h3>
          </div>
          <button onClick={onClose} disabled={submitting} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Target Product & Warehouse Info */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="font-bold text-slate-900 dark:text-white">{stockRecord.productName}</div>
            <div className="text-[11px] text-slate-500 font-mono">
              SKU: {stockRecord.sku} • Warehouse: <strong className="text-slate-700 dark:text-slate-300">{stockRecord.warehouseCode}</strong>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
              <span className="text-slate-500">Current On Hand:</span>
              <strong className="text-slate-900 dark:text-white text-sm">{stockRecord.onHandQuantity}</strong>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              Quantity Change (+ to add, - to reduce) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={quantityChange}
              onChange={(e) => {
                setQuantityChange(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="e.g. +50 or -3"
              disabled={submitting}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm font-bold text-slate-900 dark:text-white"
            />
            {quantityChange !== '' && !isNaN(Number(quantityChange)) && (
              <p className="text-[11px] text-slate-500">
                New On Hand Total will be: <strong className="text-slate-900 dark:text-white font-mono">{calculatedNewOnHand < 0 ? 0 : calculatedNewOnHand}</strong>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              Adjustment Reason <span className="text-rose-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={submitting}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="">Select Reason...</option>
              <option value="New stock received from vendor">New stock received from vendor</option>
              <option value="Damaged or expired goods audit">Damaged or expired goods audit</option>
              <option value="Physical count inventory correction">Physical count inventory correction</option>
              <option value="Sample / Internal demonstration dispatch">Sample / Internal demonstration dispatch</option>
              <option value="Other manual adjustment">Other manual adjustment</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700 dark:text-slate-300">Reference Doc / PO / Batch #</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. PO-2026-904"
              disabled={submitting}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
            />
          </div>

          {(error || validationError) && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error || validationError}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} disabled={submitting} className="px-4 py-2 font-semibold text-slate-600">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !quantityChange || !reason}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
            >
              {submitting ? 'Recording Adjustment...' : 'Record Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
