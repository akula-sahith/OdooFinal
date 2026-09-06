import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

/**
 * Reusable SearchInput Component
 * Supports clear button, loading state, shortcut badge, and debounced callback.
 */
export const SearchInput = ({
  value: externalValue,
  onChange,
  onSearch,
  onClear: externalOnClear,
  placeholder = 'Search records...',
  isLoading = false,
  debounceMs = 300,
  showShortcut = false,
  className = '',
  containerClassName = '',
  autoFocus = false,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(externalValue || '');
  const inputRef = useRef(null);

  // Sync internal state if controlled from outside
  useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  // Handle debounced search notification
  useEffect(() => {
    if (onSearch) {
      const handler = setTimeout(() => {
        onSearch(internalValue);
      }, debounceMs);
      return () => clearTimeout(handler);
    }
  }, [internalValue, debounceMs, onSearch]);

  const handleChange = (e) => {
    const val = e.target.value;
    setInternalValue(val);
    if (onChange) onChange(e);
  };

  const handleClear = () => {
    setInternalValue('');
    if (inputRef.current) inputRef.current.focus();
    if (onChange) {
      const syntheticEvent = { target: { value: '' } };
      onChange(syntheticEvent);
    }
    if (onSearch) onSearch('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={`relative w-full text-left ${containerClassName}`}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={internalValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full h-10 px-3.5 pl-10 pr-10 text-sm text-slate-900 bg-white border border-slate-300 rounded-xl placeholder-slate-400 font-medium transition-all duration-200 focus:outline-none focus:border-[#714B67] focus:ring-2 focus:ring-[#714B67]/15 ${className}`}
        {...props}
      />

      <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
        ) : internalValue ? (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : showShortcut ? (
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded">
            ⌘K
          </kbd>
        ) : null}
      </div>
    </div>
  );
};

export default SearchInput;
