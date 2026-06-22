import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination Component
 * 
 * Reusable component for navigating multiple data pages.
 * 
 * Purpose:
 * Renders next/prev page triggers, page numbers, and item description.
 * 
 * Props:
 * @param totalItems Total number of records
 * @param itemsPerPage Records display count per page
 * @param currentPage Current active page (1-indexed)
 * @param onPageChange Action trigger on page click
 * 
 * Usage Example:
 * ```tsx
 * <Pagination 
 *   totalItems={100} 
 *   itemsPerPage={10} 
 *   currentPage={1} 
 *   onPageChange={(page) => setPage(page)} 
 * />
 * ```
 */
export interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white dark:bg-[#1a1a27] border-t border-gray-100 dark:border-white/5 transition-colors">
      <p className="text-xs text-gray-500 dark:text-[#8a8a9e] font-semibold">
        Showing <span className="text-[#11191f] dark:text-white font-bold">{from}</span> to{' '}
        <span className="text-[#11191f] dark:text-white font-bold">{to}</span> of{' '}
        <span className="text-[#11191f] dark:text-white font-bold">{totalItems}</span> records
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* Prev Button */}
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-[#8a8a9e] hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page numbers */}
          {pages.map((p) => {
            const isCurrent = p === currentPage;
            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'border border-gray-200 dark:border-white/10 text-gray-500 dark:text-[#8a8a9e] hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {p}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-[#8a8a9e] hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="Next Page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
