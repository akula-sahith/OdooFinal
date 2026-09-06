import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { approvalApi } from '../../api/approvalApi';
import { quotationApi } from '../../api/quotationApi';
import { customerApi } from '../../api/customerApi';
import { useAuth } from '../../context/AuthContext';
import { Layout } from '../../components/common/Layout';
import { CheckSquare, XCircle, CheckCircle, ShieldAlert, RefreshCw, Eye, MessageSquare, AlertCircle } from 'lucide-react';

export const ApprovalQueuePage = () => {
  const [approvals, setApprovals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [decisionReason, setDecisionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [appRes, custRes] = await Promise.all([
        approvalApi.getAllApprovals(),
        customerApi.getAllCustomers(),
      ]);
      setApprovals(Array.isArray(appRes) ? appRes : []);
      setCustomers(Array.isArray(custRes) ? custRes : []);
    } catch (err) {
      setError(err.message || 'Failed to load approval requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (approvalId) => {
    setActionLoading(true);
    try {
      await approvalApi.approveRecord(approvalId, user?.id || 1, decisionReason || 'Approved by Manager');
      setSelectedApproval(null);
      setDecisionReason('');
      await loadData();
    } catch (err) {
      alert(err.message || 'Approval action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (approvalId) => {
    if (!decisionReason) {
      alert('Please provide a decision reason for rejection.');
      return;
    }
    setActionLoading(true);
    try {
      await approvalApi.rejectRecord(approvalId, user?.id || 1, decisionReason);
      setSelectedApproval(null);
      setDecisionReason('');
      await loadData();
    } catch (err) {
      alert(err.message || 'Rejection action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-blue-100 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-sky-600" />
              Discount &amp; Approval Queue
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Multi-tier discount governance dashboard with blended risk scores and audit trails
            </p>
          </div>

          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 text-xs font-semibold shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Queue
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 font-mono">Fetching approval requests...</p>
          </div>
        ) : approvals.length === 0 ? (
          <div className="py-16 text-center bg-white border border-dashed border-slate-200 rounded-2xl p-8 space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-800">Approval Queue Clear</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              No pending discount approval requests require your review at this time.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Pending &amp; Processed Approvals ({approvals.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-5">ID</th>
                    <th className="py-3 px-5">Quotation Ref</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5">Min Required Level</th>
                    <th className="py-3 px-5">Created At</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {approvals.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-5 font-mono text-sky-600 font-bold">#{app.id}</td>
                      <td className="py-3 px-5 font-mono font-semibold text-slate-900">
                        Quote #{app.quotationId || app.id}
                      </td>
                      <td className="py-3 px-5">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                            app.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : app.status === 'REJECTED'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {app.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="py-3 px-5 font-mono text-slate-500">
                        {app.status === 'PENDING' ? 'Sales Manager / Finance' : 'Complete'}
                      </td>
                      <td className="py-3 px-5 font-mono text-slate-400">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="py-3 px-5 text-right space-x-2">
                        <button
                          onClick={() => navigate(`/quotations/${app.quotationId || app.id}`)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Quote
                        </button>

                        {app.status === 'PENDING' && (
                          <button
                            onClick={() => setSelectedApproval(app)}
                            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-[11px] rounded-lg transition-colors inline-flex items-center gap-1 shadow-xs"
                          >
                            Review Decision
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Approval Decision Modal */}
        {selectedApproval && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl w-full max-w-md space-y-5 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-sky-600" />
                Review Approval Request #{selectedApproval.id}
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 font-mono">
                  <div className="text-slate-500">Target Quotation: <span className="text-slate-900 font-bold">Quote #{selectedApproval.quotationId || selectedApproval.id}</span></div>
                  <div className="text-slate-500">Blended Risk Ceiling: <span className="text-amber-600 font-bold">Category Ceiling Triggered</span></div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Decision Reason / Audit Note
                  </label>
                  <textarea
                    rows="3"
                    value={decisionReason}
                    onChange={(e) => setDecisionReason(e.target.value)}
                    placeholder="Enter reason for approval or rejection..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-sky-500"
                  ></textarea>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedApproval(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReject(selectedApproval.id)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs"
                  >
                    Reject Quote
                  </button>

                  <button
                    onClick={() => handleApprove(selectedApproval.id)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs"
                  >
                    Approve Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
