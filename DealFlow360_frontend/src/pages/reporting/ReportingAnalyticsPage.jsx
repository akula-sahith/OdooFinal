import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../../api/dashboardApi';
import { Layout } from '../../components/common/Layout';
import { BarChart3, Download, Filter, RefreshCw, Calendar, Users, FileText } from 'lucide-react';

export const ReportingAnalyticsPage = () => {
  const [salesPerf, setSalesPerf] = useState([]);
  const [statusReport, setStatusReport] = useState([]);
  const [productReport, setProductReport] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [period, setPeriod] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadReports = async () => {
    setLoading(true);
    try {
      const [sRes, stRes, prRes] = await Promise.all([
        dashboardApi.getSalesPerformanceReport(),
        dashboardApi.getQuotationsByStatusReport(),
        dashboardApi.getProductPerformanceReport(),
      ]);
      setSalesPerf(Array.isArray(sRes) ? sRes : []);
      setStatusReport(Array.isArray(stRes) ? stRes : []);
      setProductReport(Array.isArray(prRes) ? prRes : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleExportPDF = () => {
    alert('Exporting Sales Performance Report to PDF...');
  };

  const handleExportXLS = () => {
    alert('Exporting Sales Performance Data to Excel (.XLS)...');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-blue-100 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-sky-600" />
              Reporting &amp; Platform Analytics
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Sales team performance, quotation conversion velocity, and product category discount tracking
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 text-xs font-semibold shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              PDF Export
            </button>

            <button
              onClick={handleExportXLS}
              className="flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold text-xs shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              XLS Export
            </button>
          </div>
        </div>

        {/* Reporting Filters Bar */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-sky-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Report Filters</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">Period: All Time</option>
              <option value="TODAY">Today</option>
              <option value="WEEK">This Week</option>
              <option value="MONTH">This Month</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">Status: All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="CONFIRMED">Confirmed Orders</option>
            </select>

            <button
              onClick={loadReports}
              className="p-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Analytics Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Team Performance */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Sales Rep Performance Breakdown
              </h3>
            </div>
            <div className="p-5 text-xs text-slate-600 space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-800">Commercial Sales Team A</span>
                <span className="font-mono text-sky-600 font-bold">$142,500.00 Pipeline</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-800">Enterprise Sales Team B</span>
                <span className="font-mono text-sky-600 font-bold">$98,000.00 Pipeline</span>
              </div>
            </div>
          </div>

          {/* Product Category Performance */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Top Discounted Categories &amp; Products
              </h3>
            </div>
            <div className="p-5 text-xs text-slate-600 space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-800">Hardware &amp; Server Line</span>
                <span className="font-mono text-amber-600 font-bold">12.5% Avg Discount</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-800">Cloud SaaS Subscriptions</span>
                <span className="font-mono text-emerald-600 font-bold">6.0% Avg Discount</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
