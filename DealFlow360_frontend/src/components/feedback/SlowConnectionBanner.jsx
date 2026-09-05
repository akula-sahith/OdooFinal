import React from 'react';
import { WifiOff, Loader2 } from 'lucide-react';

export const SlowConnectionBanner = ({
  message = 'This is taking a little longer than expected...',
}) => {
  return (
    <div className="w-full px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center justify-between gap-3 my-3 shadow-2xs">
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
        <span>{message}</span>
      </div>

      <div className="flex items-center gap-1 text-[11px] text-amber-700 font-bold shrink-0">
        <WifiOff className="w-3.5 h-3.5" />
        <span>Slow Network Detected</span>
      </div>
    </div>
  );
};
