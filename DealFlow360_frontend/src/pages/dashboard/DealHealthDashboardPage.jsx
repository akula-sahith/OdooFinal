import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import { Layout } from '../../components/common/Layout';
import { Activity, AlertTriangle, ShieldAlert, CheckCircle, RefreshCw, ArrowRight, DollarSign, TrendingUp, Clock, FileText } from 'lucide-react';

export const DealHealthDashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);
  const navigate = useNavigate();

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [metRes, altRes] = await Promise.all([
        dashboardApi.getSalesMetrics(),
        dashboardApi.getDealHealthAlerts(),
      ]);
      setMetrics(metRes || {});
      setAlerts(Array.isArray(altRes) ? altRes : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleResolveAlert = async (alertId) => {
    setResolvingId(alertId);
    try {
      await dashboardApi.resolveDealHealthAlert(alertId);
      await loadDashboardData();
    } catch (err) {
      alert(err.message || 'Alert resolution failed.');
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-blue-100 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Activity className="w-6 h-6 text-sky-600" />
              Deal Health &amp; Anomaly Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Monitors stalled quotes, discount anomalies, and delivery promise slippage in real time
            </p>
          </div>

          <button
            onClick={loadDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 text-xs font-semibold shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Metrics
          </button>
        </div>

        {/* Real-time Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-xs">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Active Quotes</span>
            <div className="text-2xl font-black text-slate-900">{metrics?.activeQuotesCount ?? 0}</div>
            <div className="text-[10px] font-mono text-sky-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Live Pipeline
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-xs">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Pending Approvals</span>
            <div className="text-2xl font-black text-amber-600">{metrics?.pendingApprovalsCount ?? 0}</div>
            <div className="text-[10px] font-mono text-amber-600 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Requires Action
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-xs">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Converted Orders</span>
            <div className="text-2xl font-black text-emerald-600">{metrics?.convertedOrdersCount ?? 0}</div>
            <div className="text-[10px] font-mono text-emerald-600 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Confirmed
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-xs">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Total Pipeline Value</span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              ${Number(metrics?.totalPipelineValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] font-mono text-sky-600">
              Win Rate: {metrics?.winRate ?? 75.5}%
            </div>
          </div>
        </div>

        {/* Anomaly Alerts List */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Active Anomaly &amp; Stalled Deal Alerts ({alerts.length})
            </h3>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-500 text-xs font-mono">Loading alerts...</div>
          ) : alerts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs italic">
              No deal health anomalies or stalled quotes detected. Pipeline is healthy!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-sky-600">Quote #{alert.quotationId || alert.id}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold uppercase">
                        {alert.alertType || 'DISCOUNT ANOMALY'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">{alert.description || alert.message || 'Quotation inactive beyond days threshold.'}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/quotations/${alert.quotationId || alert.id}`)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] rounded-lg inline-flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Open Quote
                    </button>

                    <button
                      onClick={() => handleResolveAlert(alert.id)}
                      disabled={resolvingId === alert.id}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-[11px] rounded-lg shadow-xs"
                    >
                      {resolvingId === alert.id ? 'Resolving...' : 'Send Escalation Nudge'}
                    </button>
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
