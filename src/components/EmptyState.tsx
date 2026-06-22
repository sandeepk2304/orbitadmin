import React from 'react';
import { Archive } from 'lucide-react';

/**
 * EmptyState Component
 * 
 * Reusable layout for when no records are available.
 * 
 * Purpose:
 * standard view for empty directories, lists, queries, etc.
 * 
 * Props:
 * @param title Bold header text
 * @param description Description of what to do (e.g. 'Add a new record')
 * @param icon Custom Lucide React icon to display (defaults to Archive)
 * @param action Optional action button below description
 * 
 * Usage Example:
 * ```tsx
 * <EmptyState 
 *   title="No users found" 
 *   description="Try adding a user or adjust your filter query." 
 *   action={<button onClick={handleAdd}>Add User</button>}
 * />
 * ```
 */
export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, icon: Icon = Archive, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 py-16 bg-white dark:bg-[#1a1a27] rounded-2xl border border-dashed border-gray-200 dark:border-white/10 transition-colors">
      <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4 transition-colors">
        <Icon size={24} />
      </div>
      <h3 className="text-base font-bold text-[#11191f] dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-gray-400 dark:text-[#8a8a9e] mt-1 max-w-sm leading-relaxed">
        {description}
      </p>
      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
}
