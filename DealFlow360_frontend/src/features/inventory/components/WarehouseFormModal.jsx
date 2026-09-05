import React, { useState, useEffect } from 'react';
import { Building2, X, AlertCircle } from 'lucide-react';
import { validateWarehouse } from '../validation/inventoryValidation';

export const WarehouseFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  submitting = false,
  error = null,
}) => {
  const [formData, setFormData] = useState({
    warehouseCode: '',
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    status: 'ACTIVE',
  });

  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        warehouseCode: initialData.warehouseCode || '',
        name: initialData.name || '',
        description: initialData.description || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        country: initialData.country || 'India',
        postalCode: initialData.postalCode || '',
        status: initialData.status || 'ACTIVE',
      });
    } else {
      setFormData({
        warehouseCode: '',
        name: '',
        description: '',
        address: '',
        city: '',
        state: '',
        country: 'India',
        postalCode: '',
        status: 'ACTIVE',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;

    const check = validateWarehouse(formData);
    if (!check.isValid) {
      setValidationError(check.error);
      return;
    }

    setValidationError(null);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
            <Building2 className="w-5 h-5" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {initialData ? 'Edit Warehouse Location' : 'Register New Warehouse'}
            </h3>
          </div>
          <button onClick={onClose} disabled={submitting} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Warehouse Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={!!initialData || submitting}
                value={formData.warehouseCode}
                onChange={(e) => setFormData({ ...formData, warehouseCode: e.target.value.toUpperCase() })}
                placeholder="e.g. WH-VJA-01"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase font-bold text-slate-800 dark:text-slate-200 disabled:opacity-60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                disabled={submitting}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-slate-200"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              Warehouse Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              disabled={submitting}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Vijayawada Central Logistics Hub"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700 dark:text-slate-300">Address</label>
            <input
              type="text"
              disabled={submitting}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Industrial Estate, Street Address"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={submitting}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">State</label>
              <input
                type="text"
                disabled={submitting}
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="State"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">Postal Code</label>
              <input
                type="text"
                disabled={submitting}
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="520007"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {(error || validationError) && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error || validationError}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} disabled={submitting} className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : initialData ? 'Update Warehouse' : 'Create Warehouse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
