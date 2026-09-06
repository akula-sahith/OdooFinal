import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fulfillmentApi } from '../../api/fulfillmentApi';
import { billingApi } from '../../api/billingApi';
import { Layout } from '../../components/common/Layout';
import { Truck, Warehouse, Package, CheckCircle, RefreshCw, Layers, ShieldCheck, ArrowRight, DollarSign } from 'lucide-react';

export const FulfillmentSplitPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [fulfillmentOrders, setFulfillmentOrders] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [targetOrderId, setTargetOrderId] = useState(orderId || '1');

  const loadFulfillmentData = async () => {
    setLoading(true);
    try {
      const [whRes, stockRes] = await Promise.all([
        fulfillmentApi.getAllWarehouses(),
        fulfillmentApi.getAllStock(),
      ]);

      setWarehouses(Array.isArray(whRes) ? whRes : []);
      setStockList(Array.isArray(stockRes) ? stockRes : []);

      if (targetOrderId) {
        try {
          const foRes = await fulfillmentApi.getFulfillmentOrdersByOrderId(targetOrderId);
          setFulfillmentOrders(Array.isArray(foRes) ? foRes : []);
        } catch (e) {
          console.warn('Fulfillment order fetch warning', e);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFulfillmentData();
  }, [targetOrderId]);

  const handleProcessSplit = async () => {
    setProcessing(true);
    try {
      const res = await fulfillmentApi.processFulfillment(targetOrderId);
      alert('Multi-warehouse fulfillment split computed successfully!');
      await loadFulfillmentData();
    } catch (err) {
      alert(err.message || 'Fulfillment split calculation failed.');
    } finally {
      setProcessing(false);
    }
  };

  const handleGenerateInvoice = async () => {
    try {
      const inv = await billingApi.generateInvoice(targetOrderId);
      alert(`Invoice #${inv.id} generated for Order #${targetOrderId}! Redirecting to Billing...`);
      navigate('/billing');
    } catch (err) {
      alert(err.message || 'Invoice generation failed.');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-blue-100 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Truck className="w-6 h-6 text-sky-600" />
              Multi-Warehouse Fulfillment &amp; Auto-Split Engine
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Splits order fulfillment across warehouses based on live inventory, shipping cost weights, and backorders
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              value={targetOrderId}
              onChange={(e) => setTargetOrderId(e.target.value)}
              placeholder="Order ID"
              className="w-28 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-mono focus:outline-none focus:border-sky-500"
            />

            <button
              onClick={handleProcessSplit}
              disabled={processing}
              className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              <Layers className="w-4 h-4" />
              {processing ? 'Processing...' : 'Run Auto-Split'}
            </button>
          </div>
        </div>

        {/* Warehouses Live Stock Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {warehouses.map((wh) => (
            <div key={wh.id} className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Warehouse className="w-5 h-5 text-sky-600" />
                  <h3 className="font-bold text-sm text-slate-900">{wh.name}</h3>
                </div>
                <span className="text-[10px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 font-bold">
                  ACTIVE DEPOT
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div>Location: <span className="text-slate-800 font-medium">{wh.location || 'Main Warehouse'}</span></div>
                <div>Shipping Weight Factor: <span className="text-amber-600 font-mono">{wh.shippingWeightFactor || '1.0'}x</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* Fulfillment Splitting Results Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Package className="w-5 h-5 text-sky-600" />
                Fulfillment Splitting for Order #{targetOrderId}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically minimizes total shipment count and shipping overhead across depots
              </p>
            </div>

            <button
              onClick={handleGenerateInvoice}
              className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all"
            >
              Generate Invoice &rarr;
            </button>
          </div>

          {fulfillmentOrders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs italic border border-dashed border-slate-200 rounded-xl space-y-2">
              <p>No active fulfillment allocation computed for Order #{targetOrderId}.</p>
              <button
                onClick={handleProcessSplit}
                className="px-3 py-1.5 bg-sky-600 text-white font-semibold text-xs rounded-lg shadow-xs"
              >
                Compute Auto-Split Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {fulfillmentOrders.map((fo) => (
                <div key={fo.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sky-700 text-xs font-bold">
                      Fulfillment Shipment #{fo.id}
                    </span>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                      {fo.status || 'READY_FOR_PICKING'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-slate-700 pt-2 border-t border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Warehouse Depot</span>
                      <span>Depot #{fo.warehouseId || 1}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Shipment Cost</span>
                      <span className="text-sky-700 font-bold">${Number(fo.shippingCost || 25.00).toFixed(2)}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Shipment Count</span>
                      <span>1 Consolidated</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Backorders</span>
                      <span className="text-emerald-700 font-semibold">0 Backorders</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
