/**
 * Carrier Create/Edit Form Modal Component
 * Phase 13 — DealFlow360
 */

import React, { useState, useEffect } from 'react';
import { X, Truck, ShieldAlert, Check } from 'lucide-react';
import { validateCarrierInput } from '../validation/fulfillmentValidation';

export const CarrierFormModal = ({ isOpen, onClose, carrier, onSubmitCarrier }) => {
  const [formData, setFormData] = useState({
    carrierCode: '',
    name: '',
    status: 'ACTIVE',
    trackingUrlTemplate: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (carrier) {
      setFormData({
        carrierCode: carrier.carrierCode || '',
        name: carrier.name || '',
        status: carrier.status || 'ACTIVE',
        trackingUrlTemplate: carrier.trackingUrlTemplate || '',
      });
    } else {
      setFormData({
        carrierCode: '',
        name: '',
        status: 'ACTIVE',
        trackingUrlTemplate: '',
      });
    }
  }, [carrier, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const check = validateCarrierInput(formData);
    if (!check.isValid) {
      setError(check.errors.join(' '));
      return;
    }

    onSubmitCarrier(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#714B67]" />
            <h3 className="text-base font-extrabold text-slate-900">
              {carrier ? 'Edit Carrier Provider' : 'Configure New Carrier Provider'}
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
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Carrier Display Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. FedEx Express Freight"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-10 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Carrier Code *
              </label>
              <input
                type="text"
                required
                placeholder="FEDEX"
                value={formData.carrierCode}
                onChange={(e) => setFormData({ ...formData, carrierCode: e.target.value })}
                className="w-full h-10 px-3 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full h-10 px-3 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none cursor-pointer"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Carrier Tracking URL Template
            </label>
            <input
              type="text"
              placeholder="https://carrier.com/track?num={TRACKING_NUMBER}"
              value={formData.trackingUrlTemplate}
              onChange={(e) => setFormData({ ...formData, trackingUrlTemplate: e.target.value })}
              className="w-full h-10 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Use <code className="font-bold">{'{TRACKING_NUMBER}'}</code> placeholder tag.
            </span>
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
              <Check className="w-4 h-4" /> Save Carrier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
