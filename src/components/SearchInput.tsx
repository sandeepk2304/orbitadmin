import { Search, X } from 'lucide-react';

/**
 * SearchInput Component
 * 
 * Reusable search bar with clear button.
 * 
 * Purpose:
 * standard search input with icons and reset functionality.
 * 
 * Props:
 * @param value Current search string
 * @param onChange Event handler for text changes
 * @param placeholder Placeholder text (defaults to 'Search...')
 * 
 * Usage Example:
 * ```tsx
 * <SearchInput value={query} onChange={setQuery} placeholder="Search users..." />
 * ```
 */
export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = 'Search...' }: SearchInputProps) {
  return (
    <div className="relative w-full max-w-xs">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#8a8a9e]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a27] text-[#11191f] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full transition-colors"
          title="Clear search"
          type="button"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
