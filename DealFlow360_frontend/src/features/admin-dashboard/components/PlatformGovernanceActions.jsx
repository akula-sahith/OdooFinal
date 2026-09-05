import React from 'react';
import { Tag, Sliders, ShieldCheck, Package, Warehouse, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

/**
 * Platform Governance & Setup Quick Actions Component
 */
export const PlatformGovernanceActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Price Lists & Tiers',
      icon: Tag,
      destination: '/company/pricing',
      variant: 'primary',
    },
    {
      label: 'Discount Rules',
      icon: Sliders,
      destination: '/company/settings',
      variant: 'outline',
    },
    {
      label: 'Approval Chains',
      icon: ShieldCheck,
      destination: '/company/roles',
      variant: 'outline',
    },
    {
      label: 'Product Catalog',
      icon: Package,
      destination: '/company/products',
      variant: 'outline',
    },
    {
      label: 'Warehouse Setup',
      icon: Warehouse,
      destination: '/company/settings',
      variant: 'outline',
    },
  ];

  return (
    <Card variant="standard">
      <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#714B67]" />
            <CardTitle>Governance Shortcuts</CardTitle>
          </div>
          <CardDescription>
            Quick configuration shortcuts for platform rules, price lists, and warehouses.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 flex flex-wrap items-center gap-3">
        {actions.map((act) => {
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

export default PlatformGovernanceActions;
