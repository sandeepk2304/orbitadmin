import { AlertTriangle, Info } from 'lucide-react';

/**
 * ConfirmDialog Component
 * 
 * Reusable modal for confirming destructive or critical actions.
 * 
 * Purpose:
 * Renders a dialog overlay forcing user choice before continuing with an action.
 * 
 * Props:
 * @param isOpen Is modal active
 * @param title Confirmation title
 * @param message Clarifying description
 * @param onConfirm Action on confirm click
 * @param onCancel Action on cancel click
 * @param confirmText Confirm label (e.g. 'Delete')
 * @param cancelText Cancel label (e.g. 'Cancel')
 * @param variant Visual state ('danger' | 'warning' | 'info')
 * 
 * Usage Example:
 * ```tsx
 * <ConfirmDialog 
 *   isOpen={isOpen} 
 *   title="Delete Account?" 
 *   message="This action will permanently delete this account. This cannot be undone." 
 *   onConfirm={handleDelete} 
 *   onCancel={() => setIsOpen(false)} 
 * />
 * ```
 */
export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return (
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/15 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-500" size={24} />
          </div>
        );
      case 'warning':
        return (
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-amber-500" size={24} />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center mx-auto mb-4">
            <Info className="text-blue-500" size={24} />
          </div>
        );
    }
  };

  const getConfirmBtnStyle = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20';
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20';
      default:
        return 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1a1a27] rounded-2xl p-6 shadow-xl max-w-sm w-full mx-auto border border-gray-100 dark:border-white/10 transition-colors animate-in fade-in-50 zoom-in-95 duration-150">
        {getIcon()}
        <h3 className="text-lg font-bold text-[#11191f] dark:text-white text-center">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-[#8a8a9e] text-center mt-2 leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-sm font-semibold text-[#11191f] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${getConfirmBtnStyle()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
