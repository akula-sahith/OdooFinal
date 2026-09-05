import React, { useState, useEffect } from 'react';
import { DollarSign, Save, X, AlertCircle } from 'lucide-react';
import { Modal } from '../../../components/dialogs/Modal/Modal';
import { Input } from '../../../components/ui/Input/Input';
import { Button } from '../../../components/ui/Button/Button';
import { Alert } from '../../../components/ui/Alert/Alert';
import { formatCurrency } from '../../../constants/currency';
import { validatePriceListItem } from '../validation/priceListItemValidation';

/**
 * PriceItemEditModal Component
 * Modal for editing the Base Price of an existing item entry in a Price List.
 */
export const PriceItemEditModal = ({
  isOpen = false,
  onClose,
  onSave,
  item = null,
  currency = 'USD',
  isSaving = false,
  serverError = null,
}) => {
  const [basePrice, setBasePrice] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && item) {
      setBasePrice(item.base_price !== undefined ? String(item.base_price) : '');
      setError(null);
    }
  }, [isOpen, item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const product_id = item?.product_id || item?.product?.id || 'exist';
    const { isValid, errors } = validatePriceListItem({ product_id, base_price: basePrice });

    if (!isValid) {
      setError(errors.base_price);
      return;
    }

    if (onSave && item) {
      onSave(item.id, { base_price: Number(basePrice) });
    }
  };

  const productName = item?.product?.name || item?.name || 'Selected Product';
  const productSku = item?.product?.sku || item?.sku || 'N/A';

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSaving ? undefined : onClose}
      title="Edit Base Price"
      description={`Update the commercial base price for "${productName}" (${productSku}).`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-left" noValidate>
        {serverError && (
          <Alert variant="danger" icon={AlertCircle} title="Update Failed">
            {serverError}
          </Alert>
        )}

        {/* Product Context Banner */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs text-slate-600">
          <div className="font-bold text-slate-800 text-sm">{productName}</div>
          <div className="font-mono text-slate-500">SKU: {productSku}</div>
        </div>

        {/* Base Price Input */}
        <Input
          type="number"
          step="0.01"
          min="0"
          label={`Base Price (${currency.toUpperCase()})`}
          value={basePrice}
          onChange={(e) => {
            setBasePrice(e.target.value);
            if (error) setError(null);
          }}
          error={error}
          required
          placeholder="0.00"
          leadingIcon={DollarSign}
          disabled={isSaving}
          helperText={
            basePrice && !isNaN(Number(basePrice))
              ? `Formatted: ${formatCurrency(basePrice, currency)}`
              : 'Base unit price before any volume discount or customer tiering.'
          }
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <X className="w-4 h-4 mr-1.5" />
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSaving}
            isLoading={isSaving}
            className="bg-[#714B67] hover:bg-[#5A3B52] text-white shadow-xs"
          >
            <Save className="w-4 h-4 mr-1.5" />
            {isSaving ? 'Saving...' : 'Save Base Price'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PriceItemEditModal;
