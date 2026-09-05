import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, RefreshCw, Filter, Calendar } from 'lucide-react';
import { useCustomerOrders } from '../hooks/useCustomerOrders';
import { CustomerOrderTable } from '../components/CustomerOrderTable';

export const CustomerOrderListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const { orders, loading, error, refetch, setFilters } = useCustomerOrders({
    search: searchTerm,
    status: selectedStatus,
  });

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    setFilters((prev) => ({ ...prev, search: val }));
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setFilters((prev) => ({ ...prev, status }));
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4 bg-white rounded-2xl border border-slate-200">
        <div className="w-10 h-10 border-4 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading customer order directory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-rose-200 rounded-2xl p-12 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <ShoppingCart className="w-6 h-6" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900">Unable to Load Orders</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">{error}</p>
        <button
          type="button"
          onClick={refetch}
          className="px-4 py-2 bg-[#714B67] text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry Request
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <ShoppingCart className="w-6 h-6 text-[#714B67]" />
            My Sales Orders
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Track confirmed customer orders, fulfillment progression, and delivery commitments.
          </p>
        </div>
        <button
          type="button"
          onClick={refetch}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 md:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by order number or quotation ref..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full h-10 pl-9 pr-4 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 overflow-x-auto">
            {['ALL', 'CONFIRMED', 'FULFILLMENT_IN_PROGRESS', 'COMPLETED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => handleStatusChange(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-[#714B67] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {st === 'ALL' ? 'All Orders' : st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table or Empty State */}
      {orders.length > 0 ? (
        <CustomerOrderTable orders={orders} />
      ) : (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-16 text-center space-y-3">
          <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Orders Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
            There are currently no sales orders associated with your account matching the criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerOrderListPage;
