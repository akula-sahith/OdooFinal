import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import TableSkeleton from '../TableSkeleton/TableSkeleton';
import Checkbox from '../../ui/Checkbox';
import EmptyState from '../../feedback/EmptyState';
import ErrorState from '../../feedback/ErrorState';

/**
 * Reusable DataTable Foundation Component
 * Data-source independent table rendering engine for all DealFlow360 modules.
 */
export const DataTable = ({
  columns = [], // [{ key: 'name', label: 'Name', sortable: true, render: (val, row) => ... }]
  data = [],
  isLoading = false,
  error = null,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items to display in this list.',
  emptyAction,
  onRowClick,
  selectable = false,
  selectedRowIds = [],
  onSelectRow,
  onSelectAll,
  sortColumn,
  sortDirection = 'asc', // asc | desc
  onSort,
  className = '',
}) => {
  if (isLoading) {
    return <TableSkeleton columns={columns.length + (selectable ? 1 : 0)} rows={5} />;
  }

  if (error) {
    return (
      <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center">
        <ErrorState message={error.message || 'Failed to load table data.'} />
      </div>
    );
  }

  const allSelected = data.length > 0 && selectedRowIds.length === data.length;
  const isIndeterminate = selectedRowIds.length > 0 && selectedRowIds.length < data.length;

  const handleHeaderSort = (colKey, isSortable) => {
    if (!isSortable || !onSort) return;
    const nextDir = sortColumn === colKey && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(colKey, nextDir);
  };

  return (
    <div className={`w-full overflow-hidden border border-slate-200/80 rounded-2xl bg-white shadow-xs ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* TABLE HEADER */}
          <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3.5 text-center">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={isIndeterminate}
                    onChange={(e) => onSelectAll && onSelectAll(e.target.checked)}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => {
                const isCurrentSort = sortColumn === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={() => handleHeaderSort(col.key, col.sortable)}
                    className={`px-5 py-3.5 transition-colors ${
                      col.sortable ? 'cursor-pointer hover:bg-slate-100/70 hover:text-slate-900' : ''
                    } ${col.headerClassName || ''}`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <span>{col.label}</span>
                      {col.sortable && (
                        <span className="text-slate-400">
                          {isCurrentSort ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5 text-[#714B67]" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-[#714B67]" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-800">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-12 px-4 text-center">
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    action={emptyAction}
                  />
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                const rowId = row.id || rowIndex;
                const isSelected = selectedRowIds.includes(rowId);

                return (
                  <tr
                    key={rowId}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-colors duration-150 ${
                      onRowClick ? 'cursor-pointer hover:bg-slate-50' : 'hover:bg-slate-50/50'
                    } ${isSelected ? 'bg-[#F7F2F5]/60' : ''}`}
                  >
                    {selectable && (
                      <td
                        className="w-12 px-4 py-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) => onSelectRow && onSelectRow(rowId, e.target.checked)}
                          aria-label={`Select row ${rowIndex + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => {
                      const value = row[col.key];
                      return (
                        <td key={col.key} className={`px-5 py-4 ${col.className || ''}`}>
                          {col.render ? col.render(value, row, rowIndex) : (value ?? '-')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
