import React from 'react';

/**
 * Reusable Skeleton Component
 * Supports text, circle, rectangle, card, table-row, and avatar skeleton placeholders.
 */
export const Skeleton = ({
  variant = 'text', // text | circle | rectangle | card | table-row | avatar
  width,
  height,
  className = '',
  count = 1,
  ...props
}) => {
  const baseClasses = 'bg-slate-200/80 animate-pulse shrink-0 motion-reduce:animate-none';

  const variantClasses = {
    text: 'h-4 rounded-md w-full',
    circle: 'rounded-full',
    rectangle: 'rounded-xl w-full h-24',
    avatar: 'w-10 h-10 rounded-full',
    card: 'w-full h-48 rounded-2xl border border-slate-100',
    'table-row': 'w-full h-12 rounded-lg',
  };

  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  const items = Array.from({ length: count });

  if (count > 1) {
    return (
      <div className="space-y-2.5 w-full">
        {items.map((_, idx) => (
          <div
            key={idx}
            style={style}
            className={`${baseClasses} ${variantClasses[variant] || variantClasses.text} ${className}`}
            {...props}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      style={style}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.text} ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
