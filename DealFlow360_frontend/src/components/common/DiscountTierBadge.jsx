import React from 'react';
import { Award, Shield, Crown, Zap } from 'lucide-react';

export const TIER_CONFIG = {
  1: { code: 'BRONZE', label: 'Bronze Tier', ceiling: '10% Max', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300', icon: Shield },
  2: { code: 'SILVER', label: 'Silver Tier', ceiling: '15% Max', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', icon: Award },
  3: { code: 'GOLD', label: 'Gold Tier', ceiling: '25% Max', bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-300', icon: Zap },
  4: { code: 'PLATINUM', label: 'Platinum Tier', ceiling: '35% Max', bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-300', icon: Crown },
};

export const getDiscountTierInfo = (tierIdOrName) => {
  if (!tierIdOrName) return TIER_CONFIG[1];
  if (typeof tierIdOrName === 'number' || !isNaN(Number(tierIdOrName))) {
    const id = Number(tierIdOrName);
    return TIER_CONFIG[id] || TIER_CONFIG[1];
  }
  const str = String(tierIdOrName).toUpperCase();
  if (str.includes('PLATINUM')) return TIER_CONFIG[4];
  if (str.includes('GOLD')) return TIER_CONFIG[3];
  if (str.includes('SILVER')) return TIER_CONFIG[2];
  return TIER_CONFIG[1];
};

export const DiscountTierBadge = ({ tierId, tierName, customer, showCeiling = true, size = 'sm' }) => {
  const targetId = tierId || customer?.discountTierId || tierName;
  const config = getDiscountTierInfo(targetId);
  const Icon = config.icon;

  const sizeClasses = size === 'xs' 
    ? 'px-2 py-0.5 text-[10px]' 
    : size === 'lg' 
    ? 'px-3 py-1.5 text-xs' 
    : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-lg border shadow-2xs ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
      title={`Customer Discount Governance Tier: ${config.label} (${config.ceiling})`}
    >
      <Icon className={size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
      {showCeiling && (
        <span className="opacity-80 font-mono text-[10px] font-normal border-l border-current pl-1.5">
          {config.ceiling}
        </span>
      )}
    </span>
  );
};

export default DiscountTierBadge;
