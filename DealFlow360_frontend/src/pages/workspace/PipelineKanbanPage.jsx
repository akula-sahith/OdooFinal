import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quotationApi } from '../../api/quotationApi';
import { customerApi } from '../../api/customerApi';
import { Layout } from '../../components/common/Layout';
import { Kanban, RefreshCw, DollarSign, ArrowRight, User } from 'lucide-react';

const STAGES = [
  { id: 'DRAFT', title: 'Draft', color: 'border-slate-200 bg-slate-50 text-slate-800' },
  { id: 'SUBMITTED', title: 'Submitted', color: 'border-blue-200 bg-blue-50/50 text-blue-900' },
  { id: 'PENDING_APPROVAL', title: 'Pending Approval', color: 'border-amber-200 bg-amber-50/50 text-amber-900' },
  { id: 'APPROVED', title: 'Approved', color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900' },
  { id: 'SENT', title: 'Sent to Customer', color: 'border-sky-200 bg-sky-50/50 text-sky-900' },
  { id: 'UNDER_NEGOTIATION', title: 'Under Negotiation', color: 'border-purple-200 bg-purple-50/50 text-purple-900' },
  { id: 'CONFIRMED', title: 'Confirmed Order', color: 'border-emerald-300 bg-emerald-100/50 text-emerald-950' },
];

export const PipelineKanbanPage = () => {
  const [quotations, setQuotations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const [quotesRes, custRes] = await Promise.all([
        quotationApi.getAllQuotations(),
        customerApi.getAllCustomers(),
      ]);
      setQuotations(Array.isArray(quotesRes) ? quotesRes : []);
      setCustomers(Array.isArray(custRes) ? custRes : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCustomerName = (custGoalId) => {
    const found = customers.find((c) => c.id === custGoalId || c.dbId === custGoalId);
    return found ? (found.companyName || found.name) : `Customer #${custGoalId}`;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-blue-100 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Kanban className="w-6 h-6 text-sky-600" />
              Deal Pipeline Kanban
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Visual deal progression from draft quotation through approval, negotiation, and confirmation
            </p>
          </div>

          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 text-xs font-semibold shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Pipeline
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 font-mono">Loading Kanban board...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 overflow-x-auto pb-4">
            {STAGES.map((stage) => {
              const stageQuotes = quotations.filter(
                (q) => (q.status || 'DRAFT').toUpperCase() === stage.id
              );
              const columnTotal = stageQuotes.reduce(
                (sum, q) => sum + Number(q.totalAmount || 0),
                0
              );

              return (
                <div
                  key={stage.id}
                  className={`border rounded-2xl p-4 flex flex-col justify-between space-y-3 min-w-[240px] ${stage.color}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm tracking-tight">{stage.title}</h3>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/80 border border-slate-200 text-slate-700 font-semibold shadow-xs">
                        {stageQuotes.length}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-500">
                      Total: ${columnTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
                    {stageQuotes.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400 italic border border-dashed border-slate-300 rounded-xl">
                        No deals in stage
                      </div>
                    ) : (
                      stageQuotes.map((quote) => (
                        <div
                          key={quote.id}
                          onClick={() => navigate(`/quotations/${quote.id}`)}
                          className="bg-white border border-slate-200 hover:border-sky-500 p-3.5 rounded-xl cursor-pointer transition-all hover:scale-[1.02] shadow-xs space-y-2 group"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-[10px] font-mono text-sky-600 font-bold">
                              #{quote.id}
                            </span>
                            <span className="text-xs font-semibold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                              {getCustomerName(quote.customerId)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-100">
                            <span className="text-slate-500">Amount:</span>
                            <span className="text-slate-900 font-bold">
                              ${Number(quote.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};
