import React from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { PackageCheck } from 'lucide-react';

export const ProductDetailsPlaceholder = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Product SKU: ${id}`}
        subtitle="Detailed product specifications, unit pricing tiers, and stock movement logs."
        badgeText={`SKU: ${id}`}
        badgeVariant="teal"
      />

      <EmptyState
        icon={PackageCheck}
        title={`Product Specification Details (${id})`}
        description="SKU pricing rules, inventory warehouses, and technical data sheets will load from the backend API."
        notice="API Contract Ready. No dummy product payload."
      />
    </div>
  );
};
