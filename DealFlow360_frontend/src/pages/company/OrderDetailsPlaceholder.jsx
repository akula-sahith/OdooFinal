import React from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { ShoppingBag } from 'lucide-react';

export const OrderDetailsPlaceholder = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Order Details: ${id}`}
        subtitle="Order items breakdown, fulfillment progress, invoice tracking, and customer contact."
        badgeText={`Order ID: ${id}`}
        badgeVariant="teal"
      />

      <EmptyState
        icon={ShoppingBag}
        title={`Order Summary (${id})`}
        description="Fulfillment tracking, shipment dispatches, and invoicing status will load from the API."
        notice="API Contract Ready. No dummy order payload."
      />
    </div>
  );
};
