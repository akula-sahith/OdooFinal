/**
 * Invoice Line Items Table Component (Using Historical Commercial Snapshots)
 * Phase 14 — DealFlow360
 */

import React from 'react';
import { Barcode, Plus, Trash2 } from 'lucide-react';

export const InvoiceItemTable = ({
  items = [],
  currency = 'USD',
  isEditable = false,
  onItemChange,
  onRemoveItem,
  onAddItem,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
          Billed Products & Commercial Snapshots
        </h4>
        {isEditable && onAddItem && (
          <button
            type="button"
            onClick={onAddItem}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Billed Item
          </button>
        )}
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Item Details Snapshot</th>
              <th className="py-3 px-4 text-center">Qty</th>
              <th className="py-3 px-4 text-right">Unit Price</th>
              <th className="py-3 px-4 text-right">Discount</th>
              <th className="py-3 px-4 text-right">Tax (%)</th>
              <th className="py-3 px-4 text-right">Line Total</th>
              {isEditable && <th className="py-3 px-4 text-center">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium">
            {items.map((item, idx) => (
              <tr key={item.id || idx} className="hover:bg-slate-50/70 transition-colors">
                {/* Item Details */}
                <td className="py-3 px-4">
                  {isEditable ? (
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={item.productNameSnapshot || ''}
                        onChange={(e) => onItemChange(idx, 'productNameSnapshot', e.target.value)}
                        className="w-full h-8 px-2 text-xs font-bold bg-white border border-slate-200 rounded-lg outline-none"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="SKU"
                          value={item.skuSnapshot || ''}
                          onChange={(e) => onItemChange(idx, 'skuSnapshot', e.target.value)}
                          className="w-1/3 h-7 px-2 text-[11px] font-mono bg-white border border-slate-200 rounded-lg outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.descriptionSnapshot || ''}
                          onChange={(e) => onItemChange(idx, 'descriptionSnapshot', e.target.value)}
                          className="w-2/3 h-7 px-2 text-[11px] bg-white border border-slate-200 rounded-lg outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="font-bold text-slate-900 block">{item.productNameSnapshot}</span>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono mt-0.5">
                        <Barcode className="w-3 h-3 text-slate-400" />
                        <span>SKU: {item.skuSnapshot}</span>
                      </div>
                      {item.descriptionSnapshot && (
                        <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                          {item.descriptionSnapshot}
                        </p>
                      )}
                    </div>
                  )}
                </td>

                {/* Qty */}
                <td className="py-3 px-4 text-center">
                  {isEditable ? (
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => onItemChange(idx, 'quantity', Number(e.target.value))}
                      className="w-16 h-8 px-2 text-xs font-bold bg-white border border-slate-200 rounded-lg text-center outline-none"
                    />
                  ) : (
                    <span className="font-bold text-slate-900">{item.quantity}</span>
                  )}
                </td>

                {/* Unit Price */}
                <td className="py-3 px-4 text-right">
                  {isEditable ? (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => onItemChange(idx, 'unitPrice', Number(e.target.value))}
                      className="w-24 h-8 px-2 text-xs font-bold bg-white border border-slate-200 rounded-lg text-right outline-none"
                    />
                  ) : (
                    <span className="font-semibold text-slate-800">
                      ${item.unitPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </td>

                {/* Discount */}
                <td className="py-3 px-4 text-right">
                  {isEditable ? (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.discount || 0}
                      onChange={(e) => onItemChange(idx, 'discount', Number(e.target.value))}
                      className="w-20 h-8 px-2 text-xs font-bold bg-white border border-slate-200 rounded-lg text-right outline-none"
                    />
                  ) : (
                    <span className="text-slate-600 font-medium">
                      ${(item.discount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </td>

                {/* Tax Rate */}
                <td className="py-3 px-4 text-right">
                  {isEditable ? (
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={item.taxRate || 0}
                      onChange={(e) => onItemChange(idx, 'taxRate', Number(e.target.value))}
                      className="w-16 h-8 px-2 text-xs font-bold bg-white border border-slate-200 rounded-lg text-right outline-none"
                    />
                  ) : (
                    <span className="text-slate-600 font-medium">{item.taxRate || 0}%</span>
                  )}
                </td>

                {/* Line Total */}
                <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                  ${item.lineTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>

                {/* Action */}
                {isEditable && (
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
