import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Tag,
  Receipt,
  CreditCard,
  Truck,
  Building,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { useCustomerOrder } from '../hooks/useCustomerOrder';
import { communicationService } from '../../conversations/services/communicationService';
import { OrderTimeline } from '../components/OrderTimeline';
import { CustomerOrderSummary } from '../components/CustomerOrderSummary';
import { ShipmentTrackingCard } from '../components/ShipmentTrackingCard';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';
import { fulfillmentService } from '../../fulfillment/services/fulfillmentService';

export const CustomerOrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { order, loading, error, refetch } = useCustomerOrder(orderId);
  const [fulfillment, setFulfillment] = useState(null);
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    const loadFulfillmentData = async () => {
      if (!orderId) return;
      try {
        const [fulList, shpList] = await Promise.all([
          fulfillmentService.getFulfillments({ search: orderId }),
          fulfillmentService.getShipments({ search: orderId }),
        ]);
        const orderFul = fulList.find((f) => f.orderId === orderId);
        const orderShps = shpList.filter((s) => s.orderId === orderId);
        setFulfillment(orderFul || null);
        setShipments(orderShps || []);
      } catch (e) {
        console.error('Error fetching order fulfillment details:', e);
      }
    };
    loadFulfillmentData();
  }, [orderId]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4 bg-white rounded-2xl border border-slate-200">
        <div className="w-10 h-10 border-4 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Retrieving customer order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-white border border-rose-200 rounded-2xl p-12 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-extrabold text-slate-900">Order Not Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">{error || 'You are not authorized to view this order.'}</p>
        <button
          type="button"
          onClick={() => navigate('/customer/orders')}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          Back to Orders Directory
        </button>
      </div>
    );
  }

  const {
    orderNumber = orderId,
    orderDate = order.createdDate,
    quotationId,
    quotationNumber,
    customerName,
    currency = 'USD',
    status = 'CONFIRMED',
    items = [],
    subtotal = 0,
    discountTotal = 0,
    taxTotal = 0,
    grandTotal = order.totalAmount || 0,
    expectedDelivery,
    invoices = [],
    payments = [],
  } = order;

  return (
    <div className="space-y-6 pb-16 text-left">
      {/* Back Button & Title Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/customer/orders')}
            className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 font-mono">{orderNumber}</h1>
              <StatusBadge status={status} />
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Order Date: {orderDate} • Customer: {customerName}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={async () => {
            const conv = await communicationService.getOrCreateConversation('ORDER', orderId, {
              customerId: 'CUST-001',
              customerName: customerName,
            });
            navigate(`/customer/messages/${conv.id}`);
          }}
          className="px-3.5 py-2 text-xs font-bold bg-[#714B67] hover:bg-[#56384E] text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" /> Message Sales Representative
        </button>
      </div>

      {/* Overview Metadata Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Quotation Ref</span>
            <span className="font-mono font-bold text-[#714B67] mt-0.5 block">
              {quotationId || quotationNumber ? (
                <button
                  onClick={() => navigate(`/customer/quotations/${quotationId || quotationNumber}`)}
                  className="hover:underline"
                >
                  {quotationNumber || quotationId}
                </button>
              ) : (
                'N/A'
              )}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Order Total</span>
            <span className="font-extrabold text-slate-900 mt-0.5 block">
              {currency} ${Number(grandTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Expected Delivery</span>
            <span className="font-bold text-emerald-700 mt-0.5 block">
              {expectedDelivery || 'Processing'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Fulfillment Stage</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {fulfillment?.status || 'ALLOCATED'}
            </span>
          </div>
        </div>
      </div>

      {/* Order Execution Milestones Timeline */}
      <OrderTimeline order={order} fulfillment={fulfillment} shipments={shipments} />

      {/* Line Items Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden space-y-4 p-6">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-[#714B67]" />
          Ordered Products & Commercial Line Items
        </h3>

        {items.length > 0 ? (
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-right">Discount</th>
                    <th className="py-3 px-4 text-right">Tax</th>
                    <th className="py-3 px-4 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{item.productName}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{item.sku}</td>
                      <td className="py-3 px-4 text-center font-bold">{item.quantity}</td>
                      <td className="py-3 px-4 text-right">${item.unitPrice?.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-emerald-700 font-semibold">
                        {item.discount ? `-$${item.discount.toLocaleString()}` : '$0.00'}
                      </td>
                      <td className="py-3 px-4 text-right">${item.tax?.toLocaleString() || '$0.00'}</td>
                      <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                        ${item.lineTotal?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-4 text-xs text-slate-500 bg-slate-50 rounded-xl">Line items included in package consignment.</div>
        )}

        <div className="flex justify-end">
          <div className="w-full sm:w-80">
            <CustomerOrderSummary
              subtotal={subtotal}
              discountTotal={discountTotal}
              taxTotal={taxTotal}
              grandTotal={grandTotal}
              currency={currency}
            />
          </div>
        </div>
      </div>

      {/* Fulfillment & Shipment Details */}
      {shipments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#714B67]" /> Shipment Consignments & Tracking
          </h3>
          {shipments.map((shp) => (
            <ShipmentTrackingCard key={shp.shipmentId} shipment={shp} />
          ))}
        </div>
      )}

      {/* Cross-Module Related Records */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900">Related Commercial Documents</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Quotation */}
          <div
            onClick={() => quotationId && navigate(`/customer/quotations/${quotationId}`)}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#714B67] hover:shadow-xs transition-all cursor-pointer flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#714B67] flex items-center justify-center font-bold">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Source Quotation</span>
              <span className="text-xs font-mono font-bold text-[#714B67]">{quotationId || 'QT-2026-1004'}</span>
            </div>
          </div>

          {/* Invoice */}
          <div
            onClick={() => navigate(`/customer/invoices`)}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#714B67] hover:shadow-xs transition-all cursor-pointer flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Issued Invoices</span>
              <span className="text-xs font-mono font-bold text-indigo-700">
                {invoices.length > 0 ? invoices.join(', ') : 'INV-2026-000001'}
              </span>
            </div>
          </div>

          {/* Payments */}
          <div
            onClick={() => navigate(`/customer/payments`)}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#714B67] hover:shadow-xs transition-all cursor-pointer flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Payment History</span>
              <span className="text-xs font-mono font-bold text-emerald-700">
                {payments.length > 0 ? payments.join(', ') : 'PAY-2026-000001'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderDetailPage;
