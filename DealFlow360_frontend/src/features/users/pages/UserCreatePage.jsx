import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Button } from '../../../components/ui/Button/Button';
import { useToast } from '../../../components/feedback/Toast';
import { UserForm } from '../components/UserForm';
import { useUser } from '../hooks/useUser';
import { roleService } from '../../roles/services/roleService';

export const UserCreatePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { createUser, saving } = useUser();

  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        const response = await roleService.getRoles({ pageSize: 100 });
        setRoles(response.data || []);
      } catch (err) {
        toast.error('Failed to load security roles for user assignment.');
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, [toast]);

  const handleSubmit = async (formData) => {
    const result = await createUser(formData);
    if (result.success) {
      toast.success(`Staff user "${result.data.name || result.data.email}" provisioned successfully.`);
      navigate('/company/users');
    } else {
      toast.error(result.error || 'Failed to create staff user account.');
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Provision Staff User Account"
        description="Create a new internal staff member profile and assign a security role identity."
        actions={
          <Button
            variant="outline"
            leftIcon={ArrowLeft}
            onClick={() => navigate('/company/users')}
          >
            Back to Staff Users
          </Button>
        }
      />

      {loadingRoles ? (
        <div className="p-8 bg-white border border-slate-200/80 rounded-xl text-center text-slate-500 text-sm">
          Loading security roles...
        </div>
      ) : (
        <UserForm
          roles={roles}
          onSubmit={handleSubmit}
          isSubmitting={saving}
          isEdit={false}
          onCancel={() => navigate('/company/users')}
        />
      )}
    </div>
  );
};

export default UserCreatePage;
