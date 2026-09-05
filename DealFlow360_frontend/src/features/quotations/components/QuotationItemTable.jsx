import React, { useState } from 'react';
import { Package, Edit3, Trash2, AlertCircle, ShoppingBag, Percent } from 'lucide-react';
import { formatCurrency } from '../../../constants/currency';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { QuotationItemEditModal } from './QuotationItemEditModal';
import { calculateLineSubtotal, calculateLineDiscountAmount, calculateNetLineAmount } from '../utils/quotationCalculations';

/**
 * QuotationItemTable Component
 * Renders line item breakdown table displaying verified base prices, quantities,
 * requested discounts, net line subtotals, and actions for editing quantity or removing items.
 */
export const QuotationItemTable = ({
  items = [],
  currency = 'INR',
  onUpdateItem,
  onRemoveItem,
  readOnly = false,
}) => {
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  const handleConfirmDelete = () => {
    if (deletingItem) {
      onRemoveItem(deletingItem.productId || deletingItem.quotationItemId);
      setDeletingItem(null);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-3">
        <div className="inline-flex p-3 rounded-full bg-slate-100 text-slate-400">
          <ShoppingBag size={24} />
        </div>
        <h4 className="text-sm font-semibold text-slate-700">No products added yet</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Select active products from the product selector above to build your commercial proposal line items.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm text-left">
      <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Package size={16} className="text-[#714B67]" />
          Quotation Line Items ({items.length})
        </h3>
        <span className="text-xs text-slate-500 font-medium">Currency: {currency}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-100/60 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3">Product Name</th>
              <th className="p-3">SKU</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-right">Unit Base Price</th>
              <th className="p-3 text-right">Line Subtotal</th>
              <th className="p-3 text-center">Discount %</th>
              <th className="p-3 text-right">Net Line Subtotal</th>
              {!readOnly && <th className="p-3 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, idx) => {
              const productName = item.productNameSnapshot || item.productName || 'Product';
              const sku = item.skuSnapshot || item.sku || 'SKU-N/A';
              const unitPrice = item.unitBasePrice || 0;
              const lineSubtotal = item.lineSubtotal ?? calculateLineSubtotal(item.quantity, unitPrice);
              const discountPct = item.requestedDiscountPercentage || 0;
              const discountAmt = item.discountAmount ?? calculateLineDiscountAmount(lineSubtotal, discountPct);
              const netSubtotal = item.netLineAmount ?? calculateNetLineAmount(lineSubtotal, discountAmt);

              return (
                <tr key={item.quotationItemId || item.productId || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-semibold text-slate-900">
                    {productName}
                    {item.priceError && (
                      <div className="text-[10px] text-rose-600 font-normal flex items-center gap-1 mt-0.5">
                        <AlertCircle size={10} /> {item.priceError}
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-mono text-slate-600 text-[11px]">{sku}</td>
                  <td className="p-3 text-center font-bold text-slate-800">{item.quantity}</td>
                  <td className="p-3 text-right font-medium text-slate-700">
                    {formatCurrency(unitPrice, currency)}
                  </td>
                  <td className="p-3 text-right font-medium text-slate-700">
                    {formatCurrency(lineSubtotal, currency)}
                  </td>
                  <td className="p-3 text-center">
                    {discountPct > 0 ? (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {discountPct}%
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">0%</span>
                    )}
                  </td>
                  <td className="p-3 text-right font-bold text-slate-900">
                    {formatCurrency(netSubtotal, currency)}
                  </td>
                  {!readOnly && (
                    <td className="p-3 text-center space-x-1">
                      <button
                        type="button"
                        onClick={() => setEditingItem(item)}
                        className="p-1.5 rounded hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 transition-colors"
                        title="Edit Line Item"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingItem(item)}
                        className="p-1.5 rounded hover:bg-rose-100 text-rose-600 hover:text-rose-800 transition-colors"
                        title="Remove Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <QuotationItemEditModal
          isOpen={Boolean(editingItem)}
          item={editingItem}
          currency={currency}
          onClose={() => setEditingItem(null)}
          onSave={(productId, newQty, newDiscountPct) => {
            onUpdateItem(productId, newQty, newDiscountPct);
            setEditingItem(null);
          }}
        />
      )}

      {/* Confirmation Dialog for Removal */}
      <ConfirmationDialog
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Line Item?"
        message={`Are you sure you want to remove "${deletingItem?.productNameSnapshot || deletingItem?.productName || 'this item'}" from the quotation?`}
        confirmText="Remove Item"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};
