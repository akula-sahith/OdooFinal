import React, { useState, useRef } from 'react';

/**
 * Reusable Tooltip Component
 * Displays helpful contextual tips on hover or focus with configurable position and delay.
 */
export const Tooltip = ({
  content,
  children,
  position = 'top', // top | bottom | left | right
  delay = 200,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  if (!content) return children;

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 rounded-lg shadow-md whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150 ${positions[position] || positions.top} ${className}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
