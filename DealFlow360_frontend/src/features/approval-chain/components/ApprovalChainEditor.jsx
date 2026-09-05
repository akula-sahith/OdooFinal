import React, { useState, useEffect } from 'react';
import { Save, X, AlertCircle, Percent, Award, Shield } from 'lucide-react';
import { Modal } from '../../../components/dialogs/Modal/Modal';
import { Input } from '../../../components/ui/Input/Input';
import { Select } from '../../../components/ui/Select/Select';
import { Textarea } from '../../../components/ui/Textarea/Textarea';
import { Button } from '../../../components/ui/Button/Button';
import { Alert } from '../../../components/ui/Alert/Alert';
import { APPROVAL_ROLES } from '../../discount-tiers/types/discountTierTypes';
import { validateApprovalChain } from '../validation/approvalChainValidation';

/**
 * ApprovalChainEditor Component
 * Modal dialog for configuring threshold rules and role assignments for a specific approval governance level.
 */
export const ApprovalChainEditor = ({
  isOpen = false,
  onClose,
  onSave,
  level = null,
  allLevels = [],
  isSaving = false,
  serverError = null,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    role: 'Salesperson',
    thresholdPercent: '',
    description: '',
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && level) {
      setFormData({
        title: level.title || `Level ${level.level} Governance Rule`,
        role: level.role || 'Salesperson',
        thresholdPercent: level.thresholdPercent !== undefined ? String(level.thresholdPercent) : '',
        description: level.description || '',
      });
      setError(null);
    }
  }, [isOpen, level]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!level) return;

    // Validate updated level thresholds against full sequence
    const updatedLevels = allLevels.map((l) =>
      l.level === level.level
        ? {
            ...l,
            title: formData.title,
            role: formData.role,
            thresholdPercent: Number(formData.thresholdPercent),
            description: formData.description,
            triggerCondition: `Requested discount <= ${formData.thresholdPercent}%`,
          }
        : l
    );

    const { isValid, levelErrors } = validateApprovalChain(updatedLevels);
    const currentIndex = allLevels.findIndex((l) => l.level === level.level);

    if (!isValid && levelErrors[currentIndex]) {
      const errs = levelErrors[currentIndex];
      setError(errs.thresholdPercent || errs.role || errs.level || 'Invalid configuration parameters.');
      return;
    }

    if (onSave) {
      onSave(updatedLevels);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSaving ? undefined : onClose}
      title={`Configure Level ${level?.level ?? 0} Approval Threshold`}
      description={`Update discount limit percentage, assigned role, and escalation triggers for Level ${level?.level ?? 0}.`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-left" noValidate>
        {(serverError || error) && (
          <Alert variant="danger" icon={AlertCircle} title="Configuration Error">
            {serverError || error}
          </Alert>
        )}

        {/* Level Title */}
        <Input
          label="Governance Level Title"
          value={formData.title}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, title: e.target.value }));
            if (error) setError(null);
          }}
          required
          placeholder="e.g. Level 1 — Sales Manager Threshold"
          leadingIcon={Shield}
          disabled={isSaving}
        />

        {/* Assigned Role */}
        <Select
          label="Assigned Approval Role"
          value={formData.role}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, role: e.target.value }));
            if (error) setError(null);
          }}
          options={APPROVAL_ROLES}
          required
          leadingIcon={Award}
          disabled={isSaving || Number(level?.level) === 0}
          helperText="Company role authorized to review exceptions at this level."
        />

        {/* Threshold Percent */}
        <Input
          type="number"
          step="0.01"
          min="0"
          max="100"
          label="Maximum Discount Limit (%)"
          value={formData.thresholdPercent}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, thresholdPercent: e.target.value }));
            if (error) setError(null);
          }}
          required
          placeholder="5.00"
          leadingIcon={Percent}
          disabled={isSaving}
          helperText="Maximum discount allowed under this level before requiring higher escalation."
        />

        {/* Description */}
        <Textarea
          label="Level Governance Description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Explain when this level triggers and required review procedure..."
          rows={3}
          maxLength={300}
          disabled={isSaving}
        />

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <X className="w-4 h-4 mr-1.5" />
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSaving}
            isLoading={isSaving}
            className="bg-[#714B67] hover:bg-[#5A3B52] text-white shadow-xs"
          >
            <Save className="w-4 h-4 mr-1.5" />
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ApprovalChainEditor;
