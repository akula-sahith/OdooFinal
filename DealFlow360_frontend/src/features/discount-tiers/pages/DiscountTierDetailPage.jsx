import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Percent, Shield, Award, Layers, Calendar, Info } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { TableSkeleton } from '../../../components/feedback/Skeleton/TableSkeleton';
import { ErrorState } from '../../../components/feedback/ErrorState/ErrorState';
import { useToast } from '../../../components/feedback/Toast';
import { usePermissions } from '../../../hooks/auth/usePermissions';
import { useDiscountTier } from '../hooks/useDiscountTier';

export const DiscountTierDetailPage = () => {
  const { discountTierId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { hasPermission } = usePermissions();

  const canUpdate = hasPermission('discounts.update');
  const canManageStatus = hasPermission('discounts.manage_status');

  const {
    discountTier,
    isLoading,
    error,
    refetch,
    toggleStatus,
  } = useDiscountTier(discountTierId);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleToggleStatus = async () => {
    setIsUpdatingStatus(true);
    const result = await toggleStatus();
    setIsUpdatingStatus(false);

    if (result.success) {
      toast.success(`Discount Tier "${discountTier.name}" set to ${result.newStatus}.`);
      setStatusModalOpen(false);
      refetch();
    } else {
      toast.error(result.error || 'Failed to update status.');
    }
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return 'Indefinite';
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <PageHeader title="Discount Tier Details" description="Loading governance rule info..." />
        <Card padding="lg">
          <TableSkeleton rows={4} columns={2} />
        </Card>
      </div>
    );
  }

  if (error || !discountTier) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <PageHeader title="Discount Tier Details" description="Error loading tier detail" />
        <Card padding="lg">
          <ErrorState
            title="Discount Tier Not Found"
            description={error || 'The specified discount tier configuration could not be loaded.'}
            actionLabel="Back to Discount Tiers"
            onAction={() => navigate('/company/discount-tiers')}
          />
        </Card>
      </div>
    );
  }

  const minDisc = discountTier.minimumDiscount !== undefined ? discountTier.minimumDiscount : discountTier.minimum_discount ?? 0;
  const maxDisc = discountTier.maximumDiscount !== undefined ? discountTier.maximumDiscount : discountTier.maximum_discount ?? 0;
  const level = discountTier.approvalLevel !== undefined ? discountTier.approvalLevel : discountTier.approval_level ?? 0;
  const role = discountTier.approvalRole || discountTier.approval_role || 'Salesperson';
  const prio = discountTier.priority ?? 1;

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left">
      {/* Header */}
      <PageHeader
        title={discountTier.name}
        description={`Code: ${discountTier.code} | Priority Order: #${prio}`}
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="outline"
              leadingIcon={ArrowLeft}
              onClick={() => navigate('/company/discount-tiers')}
            >
              Back
            </Button>

            {canManageStatus && (
              <Button
                variant={discountTier.status === 'ACTIVE' ? 'outline' : 'secondary'}
                onClick={() => setStatusModalOpen(true)}
              >
                {discountTier.status === 'ACTIVE' ? 'Deactivate Rule' : 'Activate Rule'}
              </Button>
            )}

            {canUpdate && (
              <Button
                variant="primary"
                leadingIcon={Edit}
                onClick={() => navigate(`/company/discount-tiers/${discountTierId}/edit`)}
              >
                Edit Tier Rule
              </Button>
            )}
          </div>
        }
      />

      {/* Main Metadata Overview Card */}
      <Card variant="default" padding="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Status & Identification */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status & Identification
            </span>
            <div className="flex items-center gap-2">
              <StatusBadge status={discountTier.status} />
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {discountTier.code}
              </span>
            </div>
          </div>

          {/* Discount Percentage Range */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Permitted Discount Band
            </span>
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base font-mono">
              <Percent className="w-4 h-4 text-[#714B67]" />
              <span>{minDisc}% – {maxDisc}%</span>
            </div>
          </div>

          {/* Approval Requirement */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Escalation Level & Role
            </span>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Level {level}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{role}</span>
              </div>
            </div>
          </div>

          {/* Priority & Period */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Priority & Window
            </span>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Priority #{prio}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{formatDateDisplay(discountTier.effectiveFrom)} → {formatDateDisplay(discountTier.effectiveTo)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Governance Description */}
        {discountTier.description && (
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-start gap-2.5 text-slate-600 text-sm">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800 block text-xs uppercase tracking-wider mb-0.5">
                Escalation Rationale & Business Scope
              </span>
              <p className="leading-relaxed">{discountTier.description}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Governance Mechanics Info Banner */}
      <Card variant="standard" className="bg-slate-50/60 p-5 border border-slate-200">
        <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#714B67]" />
          Governance Rule Mechanics
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          When a salesperson creates a quotation, the system evaluates the requested discount against this tier configuration.
          If the requested discount falls between <strong className="text-slate-800">{minDisc}%</strong> and <strong className="text-slate-800">{maxDisc}%</strong>,
          the system assigns <strong className="text-slate-800">Approval Level {level}</strong> and requires sign-off from <strong className="text-[#714B67]">{role}</strong> before the quotation can be issued.
        </p>
      </Card>

      {/* Confirmation Modal for Status Toggle */}
      <ConfirmationDialog
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onConfirm={handleToggleStatus}
        title={
          discountTier.status === 'ACTIVE'
            ? 'Deactivate Discount Tier'
            : 'Activate Discount Tier'
        }
        description={`Are you sure you want to ${
          discountTier.status === 'ACTIVE' ? 'deactivate' : 'activate'
        } "${discountTier.name}"?`}
        confirmLabel={
          discountTier.status === 'ACTIVE' ? 'Deactivate' : 'Activate'
        }
        confirmVariant={discountTier.status === 'ACTIVE' ? 'danger' : 'primary'}
        isLoading={isUpdatingStatus}
      />
    </div>
  );
};

export default DiscountTierDetailPage;
