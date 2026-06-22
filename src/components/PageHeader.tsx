import React from 'react';

/**
 * PageHeader Component
 * 
 * Reusable header component for application pages.
 * 
 * Purpose:
 * Renders page title, brief description, optional breadcrumbs, and a primary action button.
 * 
 * Props:
 * @param title Page title (main heading)
 * @param description Optional brief explanation below the title
 * @param action Optional node for action items (e.g. Add button, filters)
 * @param breadcrumbs Optional list of breadcrumb links/text
 * 
 * Usage Example:
 * ```tsx
 * <PageHeader 
 *   title="Users Management" 
 *   description="Manage organization members and assign roles."
 *   action={<button onClick={handleAdd}>Add User</button>}
 * />
 * ```
 */
export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export default function PageHeader({ title, description, action, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div className="space-y-1.5">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-1.5 text-xs font-semibold text-gray-400 dark:text-[#8a8a9e]">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-gray-300 dark:text-white/10">/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-indigo-500 transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-gray-500 dark:text-gray-300">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#11191f] dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-gray-500 dark:text-[#8a8a9e] max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      
      {action && (
        <div className="flex items-center gap-3 shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
