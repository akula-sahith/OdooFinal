/**
 * KpiCard Component
 * Displays a single executive metric card with title, value, change indicator, icon, and subtext.
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function KpiCard({
  title,
  value,
  subtitle,
  trend, // percentage e.g. "+12%" or "-5%"
  trendDirection = 'up', // 'up' | 'down' | 'neutral'
  icon: Icon,
  variant = 'default', // 'default' | 'emerald' | 'amber' | 'blue' | 'purple' | 'rose'
}) {
  const variantStyles = {
    default: 'border-slate-800 bg-slate-900/90 text-white',
    emerald: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300',
    amber: 'border-amber-500/30 bg-amber-950/20 text-amber-300',
    blue: 'border-blue-500/30 bg-blue-950/20 text-blue-300',
    purple: 'border-purple-500/30 bg-purple-950/20 text-purple-300',
    rose: 'border-rose-500/30 bg-rose-950/20 text-rose-300',
  };

  const iconBgStyles = {
    default: 'bg-slate-800 text-emerald-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/20 text-amber-400',
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
    rose: 'bg-rose-500/20 text-rose-400',
  };

  return (
    <div
      className={`p-5 rounded-2xl border backdrop-blur shadow-lg transition-all hover:translate-y-[-2px] hover:shadow-xl ${
        variantStyles[variant] || variantStyles.default
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${iconBgStyles[variant] || iconBgStyles.default}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-2xl font-black tracking-tight text-white">{value}</h3>

        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
              trendDirection === 'up'
                ? 'bg-emerald-500/10 text-emerald-400'
                : trendDirection === 'down'
                ? 'bg-rose-500/10 text-rose-400'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {trendDirection === 'up' && <TrendingUp className="w-3 h-3" />}
            {trendDirection === 'down' && <TrendingDown className="w-3 h-3" />}
            {trendDirection === 'neutral' && <Minus className="w-3 h-3" />}
            <span>{trend}</span>
          </div>
        )}
      </div>

      {subtitle && <p className="mt-2 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}

export default KpiCard;
