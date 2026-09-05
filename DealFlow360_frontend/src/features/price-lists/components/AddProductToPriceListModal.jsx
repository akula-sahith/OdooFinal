import React, { useState, useEffect } from 'react';
import { Package, DollarSign, Save, X, AlertCircle } from 'lucide-react';
import { Modal } from '../../../components/dialogs/Modal/Modal';
import { Select } from '../../../components/ui/Select/Select';
import { Input } from '../../../components/ui/Input/Input';
import { Button } from '../../../components/ui/Button/Button';
import { Alert } from '../../../components/ui/Alert/Alert';
import { productService } from '../../products/services/productService';
import { validatePriceListItem } from '../validation/priceListItemValidation';
import { formatCurrency } from '../../../constants/currency';

/**
 * AddProductToPriceListModal Component
 * Modal for selecting a product from the Phase 4 catalogue and setting its Base Price.
 */
export const AddProductToPriceListModal = ({
  isOpen = false,
  onClose,
  onSubmit,
  onAddProduct,
  existingItems = [],
  currency = 'USD',
  isSaving = false,
  serverError = null,
}) => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const [formData, setFormData] = useState({
    product_id: '',
    base_price: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({ product_id: '', base_price: '' });
      setErrors({});
      setTouched({});

      let isMounted = true;
      const loadProducts = async () => {
        setLoadingProducts(true);
        setLoadError(null);
        try {
          const response = await productService.getProducts({ status: 'ACTIVE', pageSize: 100 });
          const list = Array.isArray(response) ? response : (response?.data || response?.products || []);
          if (isMounted) setProducts(list);
        } catch (err) {
          if (isMounted) {
            setLoadError(err?.message || 'Failed to load products from catalogue.');
            setProducts([]);
          }
        } finally {
          if (isMounted) setLoadingProducts(false);
        }
      };

      loadProducts();
      return () => {
        isMounted = false;
      };
    }
  }, [isOpen]);

  const existingProductIds = new Set(
    existingItems.map((i) => i.productId || i.product_id || i.product?.id)
  );

  const productOptions = products.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.sku})`,
    disabled: existingProductIds.has(p.id),
  }));

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ product_id: true, base_price: true });

    const { isValid, errors: valErrors } = validatePriceListItem(formData);
    if (!isValid) {
      setErrors(valErrors);
      return;
    }

    const selectedProduct = products.find((p) => p.id === formData.product_id);
    const targetProductId = selectedProduct ? selectedProduct.id : formData.product_id;

    if (existingProductIds.has(targetProductId)) {
      setErrors((prev) => ({ ...prev, product_id: 'This product is already in the price list.' }));
      return;
    }

    const submitHandler = onSubmit || onAddProduct;
    if (submitHandler) {
      submitHandler({
        productId: targetProductId,
        basePrice: Number(formData.base_price),
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSaving ? undefined : onClose}
      title="Add Product to Price List"
      description={`Select an active product from the catalogue and assign its Base Price (${currency.toUpperCase()}).`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-left" noValidate>
        {(serverError || loadError) && (
          <Alert variant="danger" icon={AlertCircle} title="Operation Failed">
            {serverError || loadError}
          </Alert>
        )}

        {/* Product Selector */}
        <Select
          label="Select Product"
          value={formData.product_id}
          onChange={(e) => handleChange('product_id', e.target.value)}
          options={productOptions}
          placeholder={loadingProducts ? 'Loading products...' : 'Choose product...'}
          isLoading={loadingProducts}
          error={touched.product_id ? errors.product_id : undefined}
          required
          leadingIcon={Package}
          disabled={isSaving || loadingProducts}
          helperText="Only active products from the master catalogue are selectable."
        />

        {/* Base Price */}
        <Input
          type="number"
          step="0.01"
          min="0"
          label={`Base Price (${currency.toUpperCase()})`}
          value={formData.base_price}
          onChange={(e) => handleChange('base_price', e.target.value)}
          error={touched.base_price ? errors.base_price : undefined}
          required
          placeholder="0.00"
          leadingIcon={DollarSign}
          disabled={isSaving}
          helperText={
            formData.base_price && !isNaN(Number(formData.base_price))
              ? `Formatted: ${formatCurrency(formData.base_price, currency)}`
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
            {isSaving ? 'Adding...' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddProductToPriceListModal;
