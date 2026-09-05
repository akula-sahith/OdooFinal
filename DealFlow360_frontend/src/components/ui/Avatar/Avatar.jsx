import React, { useState } from 'react';

/**
 * Reusable Avatar Component
 * Displays user image or initials fallback with optional status indicator dot.
 */
export const Avatar = ({
  src,
  name = '',
  size = 'md', // xs (24px) | sm (32px) | md (40px) | lg (48px) | xl (64px)
  status, // online | offline | busy | away
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  // Extract initials from name
  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const statusColors = {
    online: 'bg-emerald-500 ring-white',
    offline: 'bg-slate-400 ring-white',
    busy: 'bg-rose-500 ring-white',
    away: 'bg-amber-500 ring-white',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-2',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
    xl: 'w-4 h-4 ring-2',
  };

  return (
    <div className={`relative inline-flex shrink-0 select-none ${className}`}>
      <div className={`rounded-full overflow-hidden flex items-center justify-center font-bold bg-[#F7F2F5] text-[#714B67] border border-[#714B67]/20 shadow-xs ${sizes[size] || sizes.md}`}>
        {src && !imageError ? (
          <img
            src={src}
            alt={name || 'Avatar'}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ${statusColors[status] || statusColors.online} ${statusSizes[size] || statusSizes.md}`}
        />
      )}
    </div>
  );
};

export default Avatar;
