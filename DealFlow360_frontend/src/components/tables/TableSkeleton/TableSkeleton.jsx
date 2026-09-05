import React from 'react';

/**
 * Reusable TableSkeleton Component
 * Preserves table layout with animated shimmer rows.
 */
export const TableSkeleton = ({
  rows = 5,
  columns = 5,
  showHeader = true,
  className = '',
}) => {
  return (
    <div className={`w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white ${className}`}>
      <table className="w-full text-left border-collapse">
        {showHeader && (
          <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <th key={colIndex} className="px-5 py-3.5">
                  <div className="h-4 bg-slate-200/70 rounded-md animate-pulse w-24" />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-slate-100">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="animate-pulse">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-5 py-4">
                  <div
                    className="h-4 bg-slate-200/60 rounded-md"
                    style={{
                      width: `${Math.floor(Math.random() * 40) + 40}%`,
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
