import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, AlertCircle, Check } from 'lucide-react';
import { Card } from '../../../components/ui/Card/Card';
import { Input } from '../../../components/ui/Input/Input';
import { Button } from '../../../components/ui/Button/Button';
import { formatCurrency } from '../../../constants/currency';
import { quotationService } from '../services/quotationService';

/**
 * QuotationProductSelector Component
 * Enables salespeople to search, inspect base prices from the selected Price List,
 * specify positive quantities, and add items to the quotation proposal.
 */
export const QuotationProductSelector = ({
  priceListId = '',
  currency = 'INR',
  onAddProduct,
  disabled = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch products for current Price List with debounced search
  useEffect(() => {
    let isMounted = true;
    const handler = setTimeout(async () => {
      if (!priceListId) return;
      setLoading(true);
      setErrorMessage('');
      try {
        const list = await quotationService.getProductsForPriceList(priceListId, { search: searchTerm });
        if (isMounted) {
          setProducts(list);
          if (selectedProduct) {
            const match = list.find((p) => (p.id || p.productId) === (selectedProduct.id || selectedProduct.productId));
            if (match) setSelectedProduct(match);
          }
        }
      } catch (err) {
        if (isMounted) setErrorMessage('Failed to load products for selected price list.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
      isMounted = false;
    };
  }, [priceListId, searchTerm]);

  const handleSelectProduct = (prod) => {
    setErrorMessage('');
    if (!prod.hasPriceInList && prod.unitBasePrice === null) {
      setErrorMessage(`Product "${prod.name}" does not have a base price in the selected price list.`);
      setSelectedProduct(null);
      return;
    }
    setSelectedProduct(prod);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedProduct) {
      setErrorMessage('Please select a product from the catalogue.');
      return;
    }

    const qtyNum = Number(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0 || !isFinite(qtyNum)) {
      setErrorMessage('Quantity must be a positive number greater than 0.');
      return;
    }

    if (selectedProduct.unitBasePrice === null || selectedProduct.unitBasePrice === undefined) {
      setErrorMessage('This product does not have a base price in the selected price list.');
      return;
    }

    const result = onAddProduct(selectedProduct, qtyNum);
    if (result && result.error) {
      setErrorMessage(result.error);
      return;
    }

    // Reset selection after adding
    setSelectedProduct(null);
    setQuantity('1');
  };

  return (
    <Card className="p-5 border border-slate-200 bg-white shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
          <Package size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Add Product Line Item</h3>
          <p className="text-xs text-slate-500">Select active catalogue items with verified Price List base prices</p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 text-xs rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-3 text-slate-400" />
        <Input
          type="text"
          placeholder="Search products by Name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={disabled || !priceListId}
          className="pl-9 text-xs"
        />
      </div>

      {/* Product List Selector */}
      <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 bg-slate-50/50">
        {loading ? (
          <div className="p-4 text-center text-xs text-slate-400">Loading products from catalogue...</div>
        ) : products.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400">No active products match your search.</div>
        ) : (
          products.map((prod) => {
            const isSelected = selectedProduct && (selectedProduct.id || selectedProduct.productId) === (prod.id || prod.productId);
            const hasPrice = prod.hasPriceInList && prod.unitBasePrice !== null;
            return (
              <div
                key={prod.id || prod.productId}
                onClick={() => handleSelectProduct(prod)}
                className={`p-3 flex items-center justify-between cursor-pointer transition-colors text-xs ${
                  isSelected
                    ? 'bg-purple-50 border-l-4 border-[#714B67]'
                    : 'hover:bg-slate-100/80 bg-white'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-800 flex items-center gap-2">
                    {prod.name}
                    {!hasPrice && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-800 rounded font-normal">
                        No Base Price
                      </span>
                    )}
                  </div>
                  <div className="text-slate-500 text-[11px] space-x-3">
                    <span>SKU: <strong className="font-mono text-slate-700">{prod.sku}</strong></span>
                    <span>Category: {prod.category || 'General'}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-bold text-slate-900">
                    {hasPrice ? formatCurrency(prod.unitBasePrice, currency) : '-'}
                  </div>
                  <div className="text-[10px] text-slate-400">Base Unit Price</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quantity & Add Action */}
      {selectedProduct && (
        <form onSubmit={handleAdd} className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quantity for {selectedProduct.name} <span className="text-rose-500">*</span>
            </label>
            <Input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={disabled}
              placeholder="Enter quantity"
              className="text-xs"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={disabled || !selectedProduct.hasPriceInList}
            className="w-full flex items-center justify-center gap-1.5 text-xs py-2 bg-[#714B67] hover:bg-[#5a3b52]"
          >
            <Plus size={14} /> Add Product Line
          </Button>
        </form>
      )}
    </Card>
  );
};
