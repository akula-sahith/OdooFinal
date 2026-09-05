import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

/**
 * Custom hook to manage single product fetching, updating, and status management.
 *
 * @param {string} productId
 * @returns {Object} Single product state and actions
 */
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(Boolean(productId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const fetchProduct = useCallback(async () => {
    if (!productId || productId === 'new') {
      setLoading(false);
      setProduct(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProductById(productId);
      setProduct(data?.data || data);
    } catch (err) {
      setError(err?.message || 'Failed to fetch product details.');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  /**
   * Save (create or update) product record.
   * Handles server validation & duplicate SKU (409) status codes cleanly.
   */
  const saveProduct = async (formData) => {
    setSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      let savedRecord;
      if (productId && productId !== 'new') {
        savedRecord = await productService.updateProduct(productId, formData);
      } else {
        savedRecord = await productService.createProduct(formData);
      }
      const record = savedRecord?.data || savedRecord;
      setProduct(record);
      return { success: true, data: record };
    } catch (err) {
      const serverMessage = err?.data?.message || err?.message || 'Failed to save product.';
      
      // Handle 409 Duplicate SKU / Code
      if (err?.status === 409 || serverMessage.toLowerCase().includes('already exists') || serverMessage.toLowerCase().includes('duplicate')) {
        const customMsg = 'Product code already exists.';
        setFieldErrors({ sku: customMsg });
        setError(customMsg);
        return { success: false, error: customMsg, fieldErrors: { sku: customMsg } };
      }

      // Handle 422 / 400 Field Validation Errors
      if (err?.data?.errors && typeof err.data.errors === 'object') {
        setFieldErrors(err.data.errors);
      }
      
      setError(serverMessage);
      return { success: false, error: serverMessage };
    } finally {
      setSaving(false);
    }
  };

  /**
   * Toggle or update product status (ACTIVE / INACTIVE)
   */
  const updateStatus = async (newStatus) => {
    if (!productId) return { success: false, error: 'Product ID missing' };
    setSaving(true);
    setError(null);

    try {
      const updated = await productService.updateProductStatus(productId, newStatus);
      const record = updated?.data || updated;
      setProduct(prev => (prev ? { ...prev, status: newStatus } : record));
      return { success: true, data: record };
    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Failed to update product status.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setSaving(false);
    }
  };

  return {
    product,
    loading,
    saving,
    error,
    fieldErrors,
    actions: {
      refetch: fetchProduct,
      saveProduct,
      updateStatus,
      setFieldErrors,
      clearErrors: () => {
        setError(null);
        setFieldErrors({});
      },
    },
  };
};

export default useProduct;
