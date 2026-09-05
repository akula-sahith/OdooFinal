import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import {
  Package,
  Search,
  Plus,
  X,
  Trash2,
  CheckCircle2,
  Box,
} from 'lucide-react';

export const ProductsPlaceholder = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'Hardware',
    price: '499.00',
    unit: 'Unit',
    moq: '1',
  });

  // Load from LocalStorage (ZERO PRE-SEEDED DUMMY DATA)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dealflow360_products');
      if (saved) {
        setProducts(JSON.parse(saved));
      } else {
        setProducts([]);
      }
    } catch (e) {
      setProducts([]);
    }
  }, []);

  const saveProducts = (newList) => {
    setProducts(newList);
    try {
      localStorage.setItem('dealflow360_products', JSON.stringify(newList));
    } catch (e) {
      // ignore
    }
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const newProd = {
      id: formData.sku || `SKU-${Date.now().toString().slice(-4)}`,
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      unit: formData.unit,
      moq: parseInt(formData.moq) || 1,
      status: 'In Stock',
      createdDate: new Date().toLocaleDateString(),
    };

    saveProducts([newProd, ...products]);
    setIsModalOpen(false);
    setFormData({
      sku: '',
      name: '',
      category: 'Hardware',
      price: '499.00',
      unit: 'Unit',
      moq: '1',
    });
  };

  const handleDelete = (id) => {
    saveProducts(products.filter((p) => p.id !== id));
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || p.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Master Product Catalog"
        subtitle="Manage product SKUs, price lists, minimum order quantities, and unit specifications."
        badgeText={`${products.length} Products`}
        badgeVariant="plum"
      />

      {/* Unified Enterprise Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden space-y-4 p-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by SKU, product title, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {['All', 'Hardware', 'Software', 'Services'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab ? 'bg-[#714B67] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="h-9 px-4 bg-[#714B67] hover:bg-[#56384E] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-white" /> Add Product SKU
            </button>
          </div>
        </div>

        {/* Data Table or Zero State */}
        {filteredProducts.length > 0 ? (
          <div className="rounded-xl border border-slate-200/80 overflow-hidden pt-2">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">SKU Code</th>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Base Price</th>
                    <th className="py-3 px-4">Min Order Qty</th>
                    <th className="py-3 px-4">Availability</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#714B67]">{p.id}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-extrabold text-slate-900">${p.price.toLocaleString()} / {p.unit}</td>
                      <td className="py-3 px-4 font-semibold text-slate-600">{p.moq} {p.unit}s</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#714B67] bg-[#F7F2F5] px-2 py-0.5 rounded-full border border-[#714B67]/30">
                          <CheckCircle2 className="w-3 h-3 text-[#714B67]" /> In Stock
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Clean Zero State Shell */
          <div className="py-16 text-center space-y-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <div className="w-12 h-12 bg-[#F7F2F5] text-[#714B67] rounded-2xl flex items-center justify-center mx-auto border border-[#714B67]/20">
              <Package className="w-6 h-6 text-[#714B67]" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-sm font-extrabold text-slate-900">No Product SKUs Added</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Add master catalog SKUs to enable proposal line items.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#714B67] hover:bg-[#56384E] text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" /> Add Product SKU
            </button>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Box className="w-5 h-5 text-[#714B67]" /> Add Product SKU
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    placeholder="e.g. SKU-HARDWARE-99"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full h-10 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Services">Services</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Industrial Rackmount Server Chassis 4U"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price ($USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="499.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full h-10 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Min Order Qty</label>
                  <input
                    type="number"
                    placeholder="1"
                    value={formData.moq}
                    onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                    className="w-full h-10 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#714B67] hover:bg-[#56384E] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Save Product SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
