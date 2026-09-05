/**
 * Fulfillment, Package & Shipment Status Badge Component
 * Phase 13 — DealFlow360
 */

import React from 'react';
import {
  Clock,
  CheckCircle2,
  PackageCheck,
  Truck,
  AlertTriangle,
  RotateCcw,
  XCircle,
  Package,
  Layers,
} from 'lucide-react';
import { FULFILLMENT_STATUS, SHIPMENT_STATUS, PACKAGE_STATUS } from '../types/fulfillmentTypes';

export const FulfillmentStatusBadge = ({ status, type = 'FULFILLMENT', className = '' }) => {
  const getBadgeConfig = () => {
    switch (status) {
      // Fulfillment / Pick / Pack States
      case FULFILLMENT_STATUS.PENDING:
        return { label: 'Pending', icon: Clock, style: 'bg-slate-100 text-slate-700 border-slate-200' };
      case FULFILLMENT_STATUS.READY:
        return { label: 'Ready for Pick', icon: Package, style: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case FULFILLMENT_STATUS.PICKING:
        return { label: 'Picking', icon: Layers, style: 'bg-sky-50 text-sky-700 border-sky-200 animate-pulse' };
      case FULFILLMENT_STATUS.PICKED:
        return { label: 'Picked', icon: CheckCircle2, style: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case FULFILLMENT_STATUS.PACKING:
        return { label: 'Packing', icon: PackageCheck, style: 'bg-purple-50 text-purple-700 border-purple-200' };
      case FULFILLMENT_STATUS.PACKED:
        return { label: 'Packed', icon: PackageCheck, style: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' };
      case FULFILLMENT_STATUS.SHIPMENT_CREATED:
        return { label: 'Shipment Created', icon: Truck, style: 'bg-amber-50 text-amber-700 border-amber-200' };
      case FULFILLMENT_STATUS.COMPLETED:
      case SHIPMENT_STATUS.DELIVERED:
        return { label: 'Delivered', icon: CheckCircle2, style: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case FULFILLMENT_STATUS.CANCELLED:
      case SHIPMENT_STATUS.CANCELLED:
        return { label: 'Cancelled', icon: XCircle, style: 'bg-rose-50 text-rose-700 border-rose-200' };

      // Shipment States
      case SHIPMENT_STATUS.SHIPPED:
        return { label: 'Shipped', icon: Truck, style: 'bg-blue-50 text-blue-700 border-blue-200' };
      case SHIPMENT_STATUS.IN_TRANSIT:
        return { label: 'In Transit', icon: Truck, style: 'bg-cyan-50 text-cyan-700 border-cyan-200 font-bold' };
      case SHIPMENT_STATUS.OUT_FOR_DELIVERY:
        return { label: 'Out for Delivery', icon: Truck, style: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold' };
      case SHIPMENT_STATUS.DELIVERY_FAILED:
        return { label: 'Delivery Failed', icon: AlertTriangle, style: 'bg-rose-100 text-rose-800 border-rose-300' };
      case SHIPMENT_STATUS.RETURNED:
        return { label: 'Returned', icon: RotateCcw, style: 'bg-orange-50 text-orange-700 border-orange-200' };

      // Package States
      case PACKAGE_STATUS.OPEN:
        return { label: 'Open Package', icon: Package, style: 'bg-slate-100 text-slate-700 border-slate-200' };
      case PACKAGE_STATUS.PACKED:
        return { label: 'Container Packed', icon: PackageCheck, style: 'bg-purple-100 text-purple-800 border-purple-300' };

      default:
        return { label: status || 'Unknown', icon: Clock, style: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${config.style} ${className}`}
    >
      <IconComponent className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};
