import React from 'react';
import { UserPlus, PackagePlus, UserCheck, CheckSquare, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { usePermissions } from '../../../hooks/auth/usePermissions';

/**
 * Quick Actions Operational Shortcuts Section
 * Features valid, implemented routes respecting role permissions.
 */
export const QuickActionsSection = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const actions = [
    {
      label: 'Add Customer',
      icon: UserPlus,
      permission: 'customers.create',
      destination: '/company/customers',
      variant: 'primary',
    },
    {
      label: 'Add Product SKU',
      icon: PackagePlus,
      permission: 'products.create',
      destination: '/company/products',
      variant: 'outline',
    },
    {
      label: 'Manage Staff',
      icon: UserCheck,
      permission: 'users.view',
      destination: '/company/users',
      variant: 'outline',
    },
    {
      label: 'Review Approvals',
      icon: CheckSquare,
      permission: 'approvals.view',
      destination: '/company/approvals',
      variant: 'outline',
    },
  ];

  // Filter actions allowed for current user
  const allowedActions = actions.filter((act) => !act.permission || hasPermission(act.permission));

  if (allowedActions.length === 0) return null;

  return (
    <Card variant="standard">
      <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#714B67]" />
            <CardTitle>Operational Quick Actions</CardTitle>
          </div>
          <CardDescription>
            Shortcuts for common admin and managerial tasks.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 flex flex-wrap items-center gap-3">
        {allowedActions.map((act) => {
          const Icon = act.icon;
          return (
            <Button
              key={act.label}
              variant={act.variant}
              size="md"
              leadingIcon={Icon}
              onClick={() => navigate(act.destination)}
            >
              {act.label}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default QuickActionsSection;
