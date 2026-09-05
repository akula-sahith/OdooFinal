import React, { useState } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { TableSkeleton } from '../../../components/feedback/Skeleton/TableSkeleton';
import { ErrorState } from '../../../components/feedback/ErrorState/ErrorState';
import { useToast } from '../../../components/feedback/Toast';
import { usePermissions } from '../../../hooks/auth/usePermissions';
import { useApprovalChain } from '../hooks/useApprovalChain';
import { ApprovalChainVisualization } from '../components/ApprovalChainVisualization';
import { ApprovalLevelCard } from '../components/ApprovalLevelCard';
import { ApprovalChainEditor } from '../components/ApprovalChainEditor';
import { Sliders, Shield } from 'lucide-react';

export const ApprovalChainPage = () => {
  const toast = useToast();
  const { hasPermission } = usePermissions();
  const canUpdate = hasPermission('approvals.update');

  const {
    levels,
    isLoading,
    error,
    refetch,
    updateApprovalChain,
  } = useApprovalChain();

  const [editingLevel, setEditingLevel] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorError, setEditorError] = useState(null);

  const handleSaveChain = async (updatedLevels) => {
    setIsSubmitting(true);
    setEditorError(null);

    const result = await updateApprovalChain(updatedLevels);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Approval chain governance sequence updated successfully.');
      setEditingLevel(null);
      refetch();
    } else {
      setEditorError(result.error || 'Failed to update approval chain.');
      toast.error(result.error || 'Failed to update approval chain.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <PageHeader title="Approval Chain Governance" description="Loading approval sequence..." />
        <Card padding="lg">
          <TableSkeleton rows={4} columns={2} />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <PageHeader title="Approval Chain Governance" description="Error loading approval sequence" />
        <Card padding="lg">
          <ErrorState
            title="Approval Chain Offline"
            description={error}
            actionLabel="Retry Loading Sequence"
            onAction={refetch}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-left">
      {/* Page Header */}
      <PageHeader
        title="Approval Chain Governance"
        description="Configure discount escalation thresholds, authorized review roles, and multi-tier approval sequences."
      />

      {/* Visual Sequence Simulation */}
      <ApprovalChainVisualization levels={levels} />

      {/* Level Breakdown Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#714B67]" />
              Escalation Threshold Levels
            </h3>
            <p className="text-xs text-slate-500">
              Active role assignments and discount limit boundaries enforced during quotation generation.
            </p>
          </div>
        </div>

        <div className="space-y-3.5">
          {levels.map((lvl) => (
            <ApprovalLevelCard
              key={lvl.id || lvl.level}
              level={lvl}
              canEdit={canUpdate}
              onEdit={(item) => setEditingLevel(item)}
            />
          ))}
        </div>
      </div>

      {/* Configuration Modal */}
      {editingLevel && (
        <ApprovalChainEditor
          isOpen={Boolean(editingLevel)}
          onClose={() => setEditingLevel(null)}
          onSave={handleSaveChain}
          level={editingLevel}
          allLevels={levels}
          isSaving={isSubmitting}
          serverError={editorError}
        />
      )}
    </div>
  );
};

export default ApprovalChainPage;
