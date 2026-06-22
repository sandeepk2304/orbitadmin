
/**
 * StatusBadge Component
 * 
 * Reusable badge for conveying user, project, task, or payment status.
 * 
 * Purpose:
 * Renders status keywords inside colored badges with proper dark mode equivalents.
 * 
 * Props:
 * @param status Status text (e.g. 'Active', 'Inactive', 'Pending', 'High', 'Done')
 * @param variant Optional custom overrides (e.g. 'success', 'warning', 'error', 'info', 'neutral')
 * 
 * Usage Example:
 * ```tsx
 * <StatusBadge status="Active" />
 * <StatusBadge status="High" variant="error" />
 * ```
 */
export interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

export default function StatusBadge({ status, variant }: StatusBadgeProps) {
  const getStyle = (): string => {
    if (variant) {
      switch (variant) {
        case 'success':
          return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400';
        case 'warning':
          return 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400';
        case 'error':
          return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400';
        case 'info':
          return 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400';
        default:
          return 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300';
      }
    }

    // Auto mapping based on status string
    const normalized = status.toLowerCase().trim();
    switch (normalized) {
      case 'active':
      case 'paid':
      case 'completed':
      case 'done':
      case 'success':
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400';
      case 'pending':
      case 'in progress':
      case 'processing':
      case 'medium':
      case 'warning':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400';
      case 'inactive':
      case 'failed':
      case 'cancelled':
      case 'error':
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400';
      case 'planning':
      case 'shipped':
      case 'info':
      case 'review':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap ${getStyle()}`}>
      {status}
    </span>
  );
}
