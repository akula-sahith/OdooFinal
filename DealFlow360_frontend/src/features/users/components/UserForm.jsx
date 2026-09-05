import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Phone, Building, Hash, Check, Save } from 'lucide-react';
import { Input } from '../../../components/ui/Input/Input';
import { Select } from '../../../components/ui/Select/Select';
import { Button } from '../../../components/ui/Button/Button';
import { validateUserForm } from '../validation/userValidation';

/**
 * UserForm Component
 * Form for provisioning or updating staff user profile details and role assignments.
 */
export const UserForm = ({
  initialValues = {},
  roles = [],
  onSubmit,
  isSubmitting = false,
  isEdit = false,
  onCancel,
  onDirtyChange,
}) => {
  const [formData, setFormData] = useState({
    firstName: initialValues.firstName || '',
    lastName: initialValues.lastName || '',
    email: initialValues.email || '',
    roleId: initialValues.roleId || (roles[0]?.id || ''),
    status: initialValues.status || 'ACTIVE',
    phone: initialValues.phone || '',
    department: initialValues.department || '',
    employeeCode: initialValues.employeeCode || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData({
        firstName: initialValues.firstName || '',
        lastName: initialValues.lastName || '',
        email: initialValues.email || '',
        roleId: initialValues.roleId || (roles[0]?.id || ''),
        status: initialValues.status || 'ACTIVE',
        phone: initialValues.phone || '',
        department: initialValues.department || '',
        employeeCode: initialValues.employeeCode || '',
      });
    }
  }, [initialValues, roles]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (onDirtyChange) {
        const isDirty = JSON.stringify(updated) !== JSON.stringify({
          firstName: initialValues.firstName || '',
          lastName: initialValues.lastName || '',
          email: initialValues.email || '',
          roleId: initialValues.roleId || (roles[0]?.id || ''),
          status: initialValues.status || 'ACTIVE',
          phone: initialValues.phone || '',
          department: initialValues.department || '',
          employeeCode: initialValues.employeeCode || '',
        });
        onDirtyChange(isDirty);
      }
      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const result = validateUserForm(formData);
    if (result.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: result.errors[field] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validateUserForm(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        roleId: true,
        phone: true,
      });
      return;
    }
    onSubmit(formData);
  };

  const roleOptions = roles.map((r) => ({
    value: r.id,
    label: `${r.name} (${r.code})`,
  }));

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active Account' },
    { value: 'INACTIVE', label: 'Inactive Account' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-bold text-slate-900">
          {isEdit ? 'Edit Staff Profile' : 'Provision Staff Account'}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Assign role identities and governance status to internal DealFlow360 personnel.
        </p>
      </div>

      {/* Core Personal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          required
          leadingIcon={User}
          value={formData.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          onBlur={() => handleBlur('firstName')}
          error={touched.firstName && errors.firstName}
          placeholder="e.g. Jane"
        />

        <Input
          label="Last Name"
          required
          leadingIcon={User}
          value={formData.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          onBlur={() => handleBlur('lastName')}
          error={touched.lastName && errors.lastName}
          placeholder="e.g. Doe"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email Address"
          type="email"
          required
          leadingIcon={Mail}
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          error={touched.email && errors.email}
          placeholder="e.g. jane.doe@company.com"
          helperText="Unique corporate SSO or work email."
        />

        <Input
          label="Phone Number"
          leadingIcon={Phone}
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          onBlur={() => handleBlur('phone')}
          error={touched.phone && errors.phone}
          placeholder="e.g. +1 (555) 019-2831"
        />
      </div>

      {/* Role & Access Governance */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Assigned Security Role"
          required
          leadingIcon={Shield}
          value={formData.roleId}
          onChange={(e) => handleChange('roleId', e.target.value)}
          onBlur={() => handleBlur('roleId')}
          options={roleOptions}
          error={touched.roleId && errors.roleId}
          placeholder="Select Security Role..."
          helperText="Role identity determines capabilities."
        />

        <Select
          label="Governance Status"
          required
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          options={statusOptions}
          helperText="Inactive accounts block access without purging history."
        />
      </div>

      {/* Corporate Metadata */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Department / Unit"
          leadingIcon={Building}
          value={formData.department}
          onChange={(e) => handleChange('department', e.target.value)}
          placeholder="e.g. Enterprise Sales"
        />

        <Input
          label="Employee Code / ID"
          leadingIcon={Hash}
          value={formData.employeeCode}
          onChange={(e) => handleChange('employeeCode', e.target.value)}
          placeholder="e.g. EMP-104"
        />
      </div>

      {/* Form Action Buttons */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          isLoading={isSubmitting}
          leftIcon={isEdit ? Save : Check}
          className="bg-[#714B67] hover:bg-[#5a3b52] text-white"
        >
          {isEdit ? 'Save Changes' : 'Create Staff User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
