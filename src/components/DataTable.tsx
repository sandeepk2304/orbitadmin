import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import SearchInput from './SearchInput';
import Pagination from './Pagination';
import EmptyState from './EmptyState';

/**
 * DataTable Component
 * 
 * Reusable table component supporting:
 * * Sorting
 * * Pagination
 * * Filtering
 * * Row Selection & Bulk Actions
 * * Custom Cell Rendering
 * 
 * Props:
 * @param columns Array of columns definitions
 * @param data Array of records to display
 * @param searchPlaceholder Search bar placeholder text
 * @param searchKey Optional key to search records by (string match)
 * @param filterOptions Optional category filters (e.g. status lists)
 * @param selectable Enable checkboxes for bulk selection
 * @param bulkActions Node elements for action buttons when rows are selected
 * @param keyField Unique record identifier (default: 'id')
 * @param defaultSortKey Sorting column to start with
 * @param defaultSortAsc Sort ascending or descending default
 * @param itemsPerPage Records to show per page
 */
// One variant per field, so `render` receives that field's own type.
export type ColumnDef<T> = {
  [K in keyof T & string]: {
    key: K;
    header: string;
    sortable?: boolean;
    align?: 'left' | 'right' | 'center';
    render?: (value: T[K], item: T) => ReactNode;
  };
}[keyof T & string];

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T & string;
  filterOptions?: {
    key: keyof T & string;
    label: string;
    options: string[];
  }[];
  selectable?: boolean;
  bulkActions?: (selectedItems: T[]) => ReactNode;
  keyField?: keyof T & string;
  defaultSortKey?: keyof T & string;
  defaultSortAsc?: boolean;
  itemsPerPage?: number;
}

export default function DataTable<T extends object>({
  columns,
  data,
  searchPlaceholder = 'Search...',
  searchKey,
  filterOptions,
  selectable = false,
  bulkActions,
  keyField = 'id' as keyof T & string,
  defaultSortKey,
  defaultSortAsc = true,
  itemsPerPage = 10,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<(keyof T & string) | undefined>(defaultSortKey);
  const [sortAsc, setSortAsc] = useState(defaultSortAsc);
  const [selectedIds, setSelectedIds] = useState<Set<unknown>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // Apply filters and searches
  const filteredData = useMemo(() => {
    let result = [...data];

    // 1. Search Query
    if (search && searchKey) {
      result = result.filter((item) => {
        const val = item[searchKey];
        return val ? String(val).toLowerCase().includes(search.toLowerCase()) : false;
      });
    }

    // 2. Select Category Filters
    Object.entries(filters).forEach(([key, val]) => {
      if (val && val !== 'All') {
        result = result.filter((item) => String(item[key as keyof T]) === val);
      }
    });

    // 3. Sorting
    if (sortKey) {
      result.sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];

        if (av === undefined || av === null) return 1;
        if (bv === undefined || bv === null) return -1;

        if (typeof av === 'string' && typeof bv === 'string') {
          return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
        }

        return sortAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
      });
    }

    return result;
  }, [data, search, searchKey, filters, sortKey, sortAsc]);

  // Paginated View
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const selectedItems = useMemo(() => {
    return data.filter((item) => selectedIds.has(item[keyField]));
  }, [data, selectedIds, keyField]);

  // A new search or filter starts again from page one with nothing selected.
  const resetView = () => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    resetView();
  };

  const handleFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    resetView();
  };

  const handleSort = (key: keyof T & string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map((item) => item[keyField])));
    }
  };

  const handleSelectRow = (id: unknown) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {searchKey && (
            <SearchInput value={search} onChange={handleSearch} placeholder={searchPlaceholder} />
          )}

          {filterOptions &&
            filterOptions.map((fo) => (
              <div key={fo.label} className="relative">
                <select
                  value={filters[fo.key] || 'All'}
                  onChange={(e) => handleFilter(fo.key, e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a27] text-[#11191f] dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer transition-colors"
                >
                  <option value="All">All {fo.label}</option>
                  {fo.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            ))}
        </div>

        {/* Selected Row Actions */}
        {selectedIds.size > 0 && bulkActions && (
          <div className="flex items-center gap-3 animate-in slide-in-from-right-4 duration-150">
            <span className="text-xs font-semibold text-gray-500 dark:text-[#8a8a9e]">
              {selectedIds.size} selected:
            </span>
            {bulkActions(selectedItems)}
          </div>
        )}
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-[#1a1a27] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-[#242435] border-b border-gray-100 dark:border-white/5 transition-colors">
              <tr>
                {selectable && (
                  <th className="px-6 py-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        paginatedData.length > 0 && selectedIds.size === paginatedData.length
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
                    />
                  </th>
                )}
                {columns.map((col) => {
                  const isSorted = sortKey === col.key;
                  return (
                    <th
                      key={col.header}
                      className={`px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-[#8a8a9e] uppercase tracking-wider transition-colors ${
                        col.sortable
                          ? 'cursor-pointer select-none hover:text-gray-800 dark:hover:text-white'
                          : ''
                      } ${
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                      }`}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      <span
                        className={`inline-flex items-center gap-1 ${
                          col.align === 'right' ? 'justify-end w-full' : ''
                        }`}
                      >
                        {col.header}
                        {col.sortable && (
                          <ArrowUpDown
                            size={12}
                            className={`transition-opacity ${isSorted ? 'opacity-100' : 'opacity-40'}`}
                          />
                        )}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 transition-colors">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)} className="p-0">
                    <div className="py-12 border-none rounded-none">
                      <EmptyState
                        title="No records found"
                        description="Try modifying your search or filter values to find what you are looking for."
                      />
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => {
                  const id = row[keyField];
                  const isSelected = selectedIds.has(id);
                  return (
                    <tr
                      key={String(id)}
                      className={`hover:bg-gray-50/70 dark:hover:bg-white/[0.02] transition-colors ${
                        isSelected ? 'bg-indigo-50/30 dark:bg-indigo-500/[0.03]' : ''
                      }`}
                    >
                      {selectable && (
                        <td className="px-6 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(id)}
                            className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
                          />
                        </td>
                      )}
                      {columns.map((col) => {
                        const cellVal = row[col.key];
                        // The variant for this key takes exactly this value; the union can't say so.
                        const render = col.render as ((value: unknown, item: T) => ReactNode) | undefined;
                        return (
                          <td
                            key={col.header}
                            className={`px-6 py-4 text-gray-600 dark:text-gray-300 font-medium ${
                              col.align === 'right'
                                ? 'text-right'
                                : col.align === 'center'
                                ? 'text-center'
                                : 'text-left'
                            }`}
                          >
                            {render ? render(cellVal, row) : String(cellVal ?? '')}
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

        {/* Pagination bar */}
        {filteredData.length > 0 && (
          <Pagination
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
