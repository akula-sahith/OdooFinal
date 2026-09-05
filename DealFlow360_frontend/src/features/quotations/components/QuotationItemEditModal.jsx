import React, { useState, useEffect } from 'react';
import { Edit3, AlertCircle } from 'lucide-react';
import { Input } from '../../../components/ui/Input/Input';
import { Button } from '../../../components/ui/Button/Button';
import { formatCurrency } from '../../../constants/currency';
import { calculateLineSubtotal, calculateLineDiscountAmount, calculateNetLineAmount } from '../utils/quotationCalculations';

/**
 * QuotationItemEditModal Component
 * Allows salespeople to update item quantity and requested discount % with live net subtotal preview.
 */
export const QuotationItemEditModal = ({
  isOpen,
  item,
  currency = 'INR',
  onClose,
  onSave,
}) => {
  const [quantity, setQuantity] = useState('');
  const [discountPct, setDiscountPct] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setQuantity(String(item.quantity || 1));
      setDiscountPct(String(item.requestedDiscountPercentage || 0));
      setError('');
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const unitBasePrice = item.unitBasePrice || 0;
  const numQty = Number(quantity);
  const numDiscPct = Number(discountPct);

  const isValidQty = !isNaN(numQty) && numQty > 0 && isFinite(numQty);
  const isValidDisc = !isNaN(numDiscPct) && numDiscPct >= 0 && numDiscPct <= 100 && isFinite(numDiscPct);

  const lineSubtotal = isValidQty ? calculateLineSubtotal(numQty, unitBasePrice) : 0;
  const discountAmount = (isValidQty && isValidDisc) ? calculateLineDiscountAmount(lineSubtotal, numDiscPct) : 0;
  const netSubtotal = calculateNetLineAmount(lineSubtotal, discountAmount);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidQty) {
      setError('Quantity must be a valid positive number greater than 0.');
      return;
    }
    if (!isValidDisc) {
      setError('Discount percentage must be between 0% and 100%.');
      return;
    }
    onSave(item.productId || item.quotationItemId, numQty, numDiscPct);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 text-left">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#714B67]/10 text-[#714B67]">
              <Edit3 size={18} />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">Edit Line Item Specifications</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg leading-none font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Product Details (Read-only) */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-semibold text-slate-900 text-sm">
              {item.productNameSnapshot || item.productName || 'Product'}
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>SKU: <strong className="font-mono">{item.skuSnapshot || item.sku || 'N/A'}</strong></span>
              <span>Unit Price: <strong className="font-mono">{formatCurrency(unitBasePrice, currency)}</strong></span>
            </div>
          </div>

          {/* Inputs Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quantity <span className="text-rose-500">*</span>
              </label>
              <Input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  setError('');
                }}
                className="text-sm font-semibold text-slate-900"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Line Discount (%)
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={discountPct}
                onChange={(e) => {
                  setDiscountPct(e.target.value);
                  setError('');
                }}
                className="text-sm font-semibold text-slate-900"
              />
            </div>
          </div>

          {/* Live Breakdown Preview */}
          <div className="p-3 bg-purple-50 rounded-lg border border-[#714B67]/20 space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Line Subtotal:</span>
              <span className="font-mono font-medium">{formatCurrency(lineSubtotal, currency)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Discount ({numDiscPct}%):</span>
              <span className="font-mono font-medium text-amber-700">-{formatCurrency(discountAmount, currency)}</span>
            </div>
            <div className="pt-1.5 border-t border-[#714B67]/20 flex justify-between font-bold text-slate-900 text-sm">
              <span>Net Line Subtotal:</span>
              <span className="font-mono text-[#714B67]">{formatCurrency(netSubtotal, currency)}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!isValidQty || !isValidDisc}
              className="text-xs bg-[#714B67] hover:bg-[#5a3b52]"
            >
              Update Line Item
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
