import React from 'react';
import { Package, Tag, Sliders, ShieldCheck, Warehouse, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/feedback/Skeleton';
import { ErrorState } from '../../../components/feedback/ErrorState';

/**
 * Configuration Health Summary Cards Section
 * Displays setup metrics for Products, Price Lists, Discount Tiers, Approval Chains, and Warehouses.
 */
export const ConfigurationHealthSection = ({
  health = null, // { productsCount, priceListsCount, discountRulesCount, approvalChainsCount, warehousesCount }
  isLoading = false,
  error = null,
  onRetry,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Card key={idx} variant="standard" className="p-4">
            <Skeleton variant="text" width="60%" />
            <div className="py-2">
              <Skeleton variant="text" width="80%" height="24px" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="bordered" className="border-rose-200">
        <CardContent>
          <ErrorState
            title="Unable to load configuration metrics"
            message={error}
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    );
  }

  const items = [
    {
      key: 'products',
      title: 'Products',
      icon: Package,
      destination: '/company/products',
      value: health?.productsCount,
      color: 'bg-slate-100 text-slate-800 border-slate-200',
    },
    {
      key: 'priceLists',
      title: 'Price Lists',
      icon: Tag,
      destination: '/company/pricing',
      value: health?.priceListsCount,
      color: 'bg-[#F7F2F5] text-[#714B67] border-[#714B67]/20',
    },
    {
      key: 'discountRules',
      title: 'Discount Tiers',
      icon: Sliders,
      destination: '/company/settings',
      value: health?.discountRulesCount,
      color: 'bg-blue-50 text-blue-700 border-blue-100',
    },
    {
      key: 'approvalChains',
      title: 'Approval Chains',
      icon: ShieldCheck,
      destination: '/company/roles',
      value: health?.approvalChainsCount,
      color: 'bg-amber-50 text-amber-800 border-amber-100',
    },
    {
      key: 'warehouses',
      title: 'Warehouses',
      icon: Warehouse,
      destination: '/company/settings',
      value: health?.warehousesCount,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map((cfg) => {
        const Icon = cfg.icon;
        const hasVal = cfg.value !== undefined && cfg.value !== null;

        return (
          <Card
            key={cfg.key}
            variant="interactive"
            onClick={() => navigate(cfg.destination)}
            className="group p-4 flex flex-col justify-between space-y-3 text-left"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">
                {cfg.title}
              </span>
              <div className={`p-2 rounded-lg border ${cfg.color}`}>
                <Icon className="w-3.5 h-3.5 shrink-0" />
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                {hasVal ? cfg.value.toLocaleString() : '—'}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#714B67] transition-colors" />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ConfigurationHealthSection;
