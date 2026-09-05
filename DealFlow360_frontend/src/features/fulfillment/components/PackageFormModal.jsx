/**
 * Package Creation Form Modal Component
 * Supports Multi-Package Assignment & Dimension Validation
 * Phase 13 — DealFlow360
 */

import React, { useState } from 'react';
import { X, Package, ShieldAlert, Check } from 'lucide-react';
import { validatePackageDimensions } from '../validation/fulfillmentValidation';

export const PackageFormModal = ({ isOpen, onClose, fulfillment, onSubmitPackage }) => {
  if (!isOpen || !fulfillment) return null;

  const [formData, setFormData] = useState({
    packageNumber: `PKG-${fulfillment.fulfillmentId.replace('FUL-', '')}-${Math.floor(1 + Math.random() * 99)}`,
    weight: '15.5',
    weightUnit: 'kg',
    length: '50',
    width: '40',
    height: '30',
    dimensionUnit: 'cm',
    notes: 'Standard Reinforced Box Container',
  });

  // Calculate available picked items ready for packing
  const availableItems = fulfillment.items?.map((item) => {
    const pickedUnassigned = item.pickedQuantity - item.packedQuantity;
    return {
      ...item,
      pickedUnassigned,
    };
  }) || [];

  const [itemQuantities, setItemQuantities] = useState(() => {
    const initial = {};
    availableItems.forEach((i) => {
      if (i.pickedUnassigned > 0) {
        initial[i.itemId] = i.pickedUnassigned; // Default pack all remaining
      }
    });
    return initial;
  });

  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const dimCheck = validatePackageDimensions(formData);
    if (!dimCheck.isValid) {
      setError(dimCheck.errors.join(' '));
      return;
    }

    // Build package items payload
    const packageItems = [];
    let totalItemsSelected = 0;

    for (const item of availableItems) {
      const selectedQty = Number(itemQuantities[item.itemId] || 0);
      if (selectedQty > 0) {
        if (selectedQty > item.pickedUnassigned) {
          setError(`Cannot pack ${selectedQty} units of ${item.productName}. Only ${item.pickedUnassigned} picked units remain.`);
          return;
        }
        packageItems.push({
          packageItemId: `PKGI-${Date.now()}-${item.itemId}`,
          fulfillmentItemId: item.itemId,
          productId: item.productId,
          quantity: selectedQty,
        });
        totalItemsSelected += selectedQty;
      }
    }

    if (totalItemsSelected === 0) {
      setError('Please assign at least 1 picked item quantity to this package container.');
      return;
    }

    onSubmitPackage({
      ...formData,
      items: packageItems,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#714B67]" />
            <h3 className="text-base font-extrabold text-slate-900">
              Create Shipping Package Container
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Package Identifier */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Package ID / Tag *
              </label>
              <input
                type="text"
                required
                value={formData.packageNumber}
                onChange={(e) => setFormData({ ...formData, packageNumber: e.target.value })}
                className="w-full h-10 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Weight *</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  required
                  min="0"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full h-10 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
                />
                <select
                  value={formData.weightUnit}
                  onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value })}
                  className="h-10 px-2 text-xs font-bold bg-slate-100 border border-slate-200 rounded-xl"
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Container Dimensions (L × W × H) *
            </label>
            <div className="grid grid-cols-4 gap-2">
              <input
                type="number"
                placeholder="Length"
                required
                min="0"
                value={formData.length}
                onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                className="h-10 px-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
              <input
                type="number"
                placeholder="Width"
                required
                min="0"
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                className="h-10 px-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
              <input
                type="number"
                placeholder="Height"
                required
                min="0"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="h-10 px-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
              <select
                value={formData.dimensionUnit}
                onChange={(e) => setFormData({ ...formData, dimensionUnit: e.target.value })}
                className="h-10 px-2 text-xs font-bold bg-slate-100 border border-slate-200 rounded-xl"
              >
                <option value="cm">cm</option>
                <option value="in">in</option>
              </select>
            </div>
          </div>

          {/* Assign Picked Items */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Assign Picked Items to This Package:
            </label>
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 max-h-48 overflow-y-auto space-y-2">
              {availableItems.map((item) => (
                <div
                  key={item.itemId}
                  className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">{item.productName}</span>
                    <span className="text-[11px] text-slate-400 block">
                      Picked Unassigned: {item.pickedUnassigned} units
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-medium text-slate-500">Pack Qty:</span>
                    <input
                      type="number"
                      min="0"
                      max={item.pickedUnassigned}
                      disabled={item.pickedUnassigned === 0}
                      value={itemQuantities[item.itemId] || 0}
                      onChange={(e) =>
                        setItemQuantities({
                          ...itemQuantities,
                          [item.itemId]: Number(e.target.value),
                        })
                      }
                      className="w-16 h-8 px-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg text-center outline-none disabled:opacity-50"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Packing Notes</label>
            <textarea
              rows="2"
              placeholder="e.g. Handle with care, fragile optical sensors enclosed..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#714B67] hover:bg-[#56384E] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" /> Seal & Pack Container
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
