import React, { useState } from 'react';
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  StatusBadge,
  Tabs,
  Badge,
} from '../../components/ui';
import { EmptyState } from '../../components/feedback/EmptyState';
import { CheckCircle2, XCircle, RotateCcw, ShieldCheck, DollarSign } from 'lucide-react';

/**
 * DealFlow360 Approvals Queue Component
 * Implements the 2-Tier Approval Architecture:
 * - Tier 1: Sales Manager Approval (Discounts & margins exceeding rep threshold up to manager limit)
 * - Tier 2: Finance / Ops Approval (High-risk deals, credit limit overrides, or discounts above manager threshold)
 */
export const ApprovalsPlaceholder = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [approvals, setApprovals] = useState([]);

  const handleAction = (id, newStatus) => {
    setApprovals(approvals.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
  };

  const filteredApprovals = approvals.filter((item) => {
    if (activeTab === 'manager') return item.tier === 'manager' && item.status.startsWith('PENDING');
    if (activeTab === 'finance') return item.tier === 'finance' && item.status.startsWith('PENDING');
    if (activeTab === 'completed') return item.status === 'APPROVED' || item.status === 'REJECTED';
    return true;
  });

  const pendingCount = approvals.filter((a) => a.status.startsWith('PENDING')).length;

  return (
    <div className="space-y-6 pb-12 text-left max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Quotation Approvals Queue"
        description="2-Tier approval workflow for discount overrides, credit limit extensions, and high-risk deals."
        badge={
          <Badge variant="plum" size="sm">
            {pendingCount} Pending Approval{pendingCount !== 1 ? 's' : ''}
          </Badge>
        }
      />

      {/* Workflow Role Architecture Banner */}
      <div className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#714B67]" />
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              Automated 2-Tier Governance Routing
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-3xl">
            <strong>Tier 1:</strong> Sales Managers review discount requests above rep limits. <br />
            <strong>Tier 2:</strong> Finance / Ops reviews high-risk deals and credit overrides exceeding manager thresholds.
          </p>
        </div>
      </div>

      {/* Tabs Filter */}
      <Tabs
        tabs={[
          { id: 'all', label: 'All Requests', count: approvals.length },
          { id: 'manager', label: 'Tier 1: Manager Queue', count: approvals.filter((a) => a.tier === 'manager' && a.status.startsWith('PENDING')).length },
          { id: 'finance', label: 'Tier 2: Finance Queue', count: approvals.filter((a) => a.tier === 'finance' && a.status.startsWith('PENDING')).length },
          { id: 'completed', label: 'Completed History', count: approvals.filter((a) => a.status === 'APPROVED' || a.status === 'REJECTED').length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Main Approvals Queue Content */}
      <Card variant="standard">
        <CardContent className="p-5">
          {filteredApprovals.length > 0 ? (
            <div className="space-y-4">
              {filteredApprovals.map((item) => (
                <div key={item.id} className="border border-slate-200 rounded-xl p-5 space-y-3 bg-white shadow-2xs hover:border-[#714B67]/40 transition-all">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-[#714B67] bg-[#F7F2F5] px-2 py-0.5 rounded-md border border-[#714B67]/20">
                        {item.id}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 font-heading">
                        {item.type}
                      </h3>
                      <Badge variant={item.tier === 'finance' ? 'error' : 'warning'} size="sm">
                        {item.tier === 'finance' ? 'Tier 2: Finance' : 'Tier 1: Manager'}
                      </Badge>
                    </div>

                    <StatusBadge status={item.status} size="sm" />
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {item.details}
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs pt-2 border-t border-slate-100">
                    <div className="text-slate-500 font-semibold space-x-3">
                      <span>Requestor: <strong className="text-slate-800">{item.requestor}</strong></span>
                      <span>Client: <strong className="text-slate-800">{item.client}</strong></span>
                      {item.discountPercentage && (
                        <span>Discount: <strong className="text-[#714B67]">{item.discountPercentage}%</strong></span>
                      )}
                    </div>

                    {item.status.startsWith('PENDING') && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          leadingIcon={RotateCcw}
                          onClick={() => handleAction(item.id, 'REVISION_REQUESTED')}
                        >
                          Request Revision
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          leadingIcon={XCircle}
                          onClick={() => handleAction(item.id, 'REJECTED')}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          leadingIcon={CheckCircle2}
                          onClick={() => handleAction(item.id, 'APPROVED')}
                        >
                          Approve Request
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CheckCircle2}
              title="No Pending Approvals"
              description="Quotation discount overrides and high-risk deal escalations will appear here for Manager or Finance authorization."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalsPlaceholder;
