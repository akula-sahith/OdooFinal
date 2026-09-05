import React from 'react';
import { Badge as UIBadge } from './Badge/Badge';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = true,
  className = '',
  ...props
}) => {
  return (
    <UIBadge variant={variant} size={size} dot={dot} className={className} {...props}>
      {children}
    </UIBadge>
  );
};

export default Badge;
