import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, X, AlertCircle } from 'lucide-react';
import { validateStockTransfer } from '../validation/inventoryValidation';

export const StockTransferModal = ({
  isOpen,
  onClose,
  onConfirm,
  stockRecord = null,
  warehouses = [],
  submitting = false,
  error = null,
}) => {
  const [destinationWarehouseId, setDestinationWarehouseId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    setDestinationWarehouseId('');
    setQuantity('');
    setValidationError(null);
  }, [isOpen, stockRecord]);

  if (!isOpen || !stockRecord) return null;

  const destinationOptions = warehouses.filter(
    (w) => w.warehouseId !== stockRecord.warehouseId && w.warehouseCode !== stockRecord.warehouseCode && w.status === 'ACTIVE'
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;

    const check = validateStockTransfer({
      sourceWarehouseId: stockRecord.warehouseId,
      destinationWarehouseId,
      productId: stockRecord.productId,
      quantity,
      availableQuantity: stockRecord.availableQuantity,
    });

    if (!check.isValid) {
      setValidationError(check.error);
      return;
    }

    setValidationError(null);
    onConfirm({
      sourceWarehouseId: stockRecord.warehouseId,
      destinationWarehouseId,
      productId: stockRecord.productId,
      quantity: Number(quantity),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
            <ArrowRightLeft className="w-5 h-5" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Inter-Warehouse Stock Transfer</h3>
          </div>
          <button onClick={onClose} disabled={submitting} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Source Info Card */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="font-bold text-slate-900 dark:text-white">{stockRecord.productName}</div>
            <div className="text-[11px] text-slate-500 font-mono">
              SKU: {stockRecord.sku} • Source Hub: <strong className="text-slate-700 dark:text-slate-300">{stockRecord.warehouseCode}</strong>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
              <span className="text-slate-500">Available Stock for Transfer:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-extrabold">{stockRecord.availableQuantity} units</strong>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              Destination Warehouse <span className="text-rose-500">*</span>
            </label>
            <select
              value={destinationWarehouseId}
              onChange={(e) => setDestinationWarehouseId(e.target.value)}
              disabled={submitting}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-800 dark:text-slate-200"
            >
              <option value="">Select Destination Warehouse...</option>
              {destinationOptions.map((w) => (
                <option key={w.warehouseId} value={w.warehouseId}>
                  {w.warehouseCode} — {w.name} ({w.city})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              Transfer Quantity <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max={stockRecord.availableQuantity}
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder={`Max: ${stockRecord.availableQuantity}`}
              disabled={submitting}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm font-bold text-slate-900 dark:text-white"
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
              disabled={submitting || !destinationWarehouseId || !quantity}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
            >
              {submitting ? 'Transferring...' : 'Execute Stock Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
