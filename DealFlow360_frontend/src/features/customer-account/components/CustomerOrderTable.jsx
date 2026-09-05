import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ShoppingCart } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';

export const CustomerOrderTable = ({ orders = [] }) => {
  const navigate = useNavigate();

  if (!orders || orders.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Order Number</th>
              <th className="py-3.5 px-4">Order Date</th>
              <th className="py-3.5 px-4">Quotation Ref</th>
              <th className="py-3.5 px-4 text-center">Items</th>
              <th className="py-3.5 px-4 text-right">Total</th>
              <th className="py-3.5 px-4">Currency</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Expected Delivery</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium">
            {orders.map((o) => {
              const itemCount = o.items ? o.items.length : 1;
              const formattedTotal = Number(o.grandTotal || o.totalAmount || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              });

              return (
                <tr key={o.id || o.orderNumber} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#714B67]">
                    <button
                      onClick={() => navigate(`/customer/orders/${o.id || o.orderNumber}`)}
                      className="hover:underline cursor-pointer"
                    >
                      {o.orderNumber || o.id}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{o.orderDate || o.createdDate}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-700 font-semibold">
                    {o.quotationNumber || o.quotationId ? (
                      <button
                        onClick={() => navigate(`/customer/quotations/${o.quotationId || o.quotationNumber}`)}
                        className="hover:underline text-slate-800 cursor-pointer"
                      >
                        {o.quotationNumber || o.quotationId}
                      </button>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                      {itemCount} item(s)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">${formattedTotal}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-bold">{o.currency || 'USD'}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={o.status || 'CONFIRMED'} />
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{o.expectedDelivery || 'Processing'}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => navigate(`/customer/orders/${o.id || o.orderNumber}`)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="View Detailed Order"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
